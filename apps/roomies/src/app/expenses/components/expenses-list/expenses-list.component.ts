import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { Expense } from '../../../shared/models/expense.model';

@Component({
  selector: 'roomies-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpensesListComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport, { read: null, static: true })
  virtualScroll: CdkVirtualScrollViewport;
  @Input() expenses: Expense[] = [];
  @Output() paging = new EventEmitter<{ first: number; rows: number }>();
  readonly VIRTUAL_SCROLL_HEIGHT = '300px';
  itemSize = '50';
  private debouncer = new Subject<{ first: number; rows: number }>();

  constructor() {}

  loadExpenses(e: { first: number; rows: number }) {
    this.debouncer.next(e);
  }

  ngOnInit() {
    this.debouncer.pipe(throttleTime(300)).subscribe(this.paging);
  }

  trackByFn(index: number, item: Expense) {
    return item._id; // or item.id
  }

  onScrolledIndexChange(e: number) {
    const end = this.virtualScroll.getRenderedRange().end;

    const total = this.virtualScroll.getDataLength();
    if (end === total) {
      this.debouncer.next({
        first: e > 0 ? e + Math.floor(300 / +this.itemSize) : 0,
        rows: 10
      });
    }
  }
}
