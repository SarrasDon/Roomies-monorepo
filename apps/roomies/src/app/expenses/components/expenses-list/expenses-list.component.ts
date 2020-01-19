import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { Subject } from 'rxjs';
import { throttleTime, filter, map, takeUntil } from 'rxjs/operators';
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
    this.virtualScroll.scrolledIndexChange
      .pipe(
        filter(() => {
          const end = this.virtualScroll.getRenderedRange().end;
          const total = this.virtualScroll.getDataLength();
          return end === total;
        }),
        map((e: number) => ({
          first: e > 0 ? e + Math.ceil(this.listHeight / this.itemSize) : 0,
          rows: 10
        })),
        throttleTime(300),
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
