import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Expense } from '@roomies/expenses.contracts';
import { merge, Subject, timer } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  switchMap,
  takeUntil,
  throttleTime,
} from 'rxjs/operators';
import { getUserEntities } from '../../../auth/store';
import { UiService } from '../../../core/services';
import {
  ExpensesState,
  loadExpenses,
  loadMonthlyExpenses,
  selectExpenseReasonsEntities,
  selectExpenses,
} from '../../store';
import theme from '../../../theme.config.json';

@Component({
  selector: 'roomies-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport)
  virtualScroll: CdkVirtualScrollViewport;

  @Output() paging = new EventEmitter<{ first: number; rows: number }>();

  itemSize = theme['expense-item-height'];
  destroy$ = new Subject();
  expenses$ = this.store.pipe(select(selectExpenses));
  expenseReasons$ = this.store.pipe(select(selectExpenseReasonsEntities));
  users$ = this.store.pipe(select(getUserEntities));

  constructor(
    private uiService: UiService,
    private store: Store<ExpensesState>
  ) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    const scrolled$ = this.virtualScroll.elementScrolled();
    const startScrolling$ = scrolled$.pipe(mapTo(true));
    const stoppedScrolling$ = scrolled$.pipe(
      switchMap(() => timer(300)),
      mapTo(false)
    );

    merge(startScrolling$, stoppedScrolling$)
      .pipe(takeUntil(this.destroy$))
      .subscribe((isScrolling) =>
        this.uiService.expensesListScrolled(isScrolling)
      );

    this.virtualScroll.scrolledIndexChange
      .pipe(
        throttleTime(100),
        map((e: number) => ({
          index: e > 0 ? e + 20 : 0,
          limit: 30,
        })),
        distinctUntilChanged((x, y) => {
          return y.index - x.index <= 10;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((paging) => {
        this.store.dispatch(loadExpenses(paging));
      });

    this.virtualScroll.scrolledIndexChange
      .pipe(
        debounceTime(100),
        switchMap((index) =>
          this.expenses$.pipe(
            filter((expenses) => expenses.length > 0),
            map((expenses) => expenses[index])
          )
        ),
        map((expense) => new Date(expense.spendAt)),
        map((date) => `${date.getUTCFullYear()}-${date.getMonth()}`),
        distinctUntilChanged(),
        map((dateString) => dateString.split('-')),
        map((dateString) => ({ year: +dateString[0], month: +dateString[1] })),
        takeUntil(this.destroy$)
      )
      .subscribe(({ month, year }) =>
        this.store.dispatch(loadMonthlyExpenses({ month, year }))
      );

    this.uiService.scrollToTop = () =>
      void this.virtualScroll.scrollToIndex(0, 'smooth');

    this.uiService.hasScrolled$ = this.virtualScroll.scrolledIndexChange.pipe(
      map((index) => index > 0)
    );
  }

  trackByFn(index: number, item: Expense) {
    return item._id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
