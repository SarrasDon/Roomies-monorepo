import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { map, takeUntil, throttleTime } from 'rxjs/operators';
import { Expense } from '../../../shared/models/expense.model';

@Component({
  selector: 'roomies-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpensesListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport, { static: true })
  virtualScroll: CdkVirtualScrollViewport;

  @Input() expenses: Expense[] = [];

  @Output() paging = new EventEmitter<{ first: number; rows: number }>();

  listHeight = 500;
  itemSize = 50;
  destroy$ = new Subject<{ first: number; rows: number }>();

  constructor(private host: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.listHeight = this.calcListHeight();
    const step = Math.floor(this.listHeight / this.itemSize);
    this.virtualScroll.scrolledIndexChange
      .pipe(
        throttleTime(100),
        map((e: number) => ({
          first: e > 0 ? e + 2 * step : 0,
          rows: 30
        })),
        takeUntil(this.destroy$)
      )
      .subscribe(this.paging);
  }

  trackByFn(index: number, item: Expense) {
    return item._id;
  }

  calcListHeight() {
    const el = this.host.nativeElement;
    const topOfDiv = el.offsetTop;
    const bottomOfVisibleWindow = window.innerHeight;
    return bottomOfVisibleWindow - topOfDiv;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
