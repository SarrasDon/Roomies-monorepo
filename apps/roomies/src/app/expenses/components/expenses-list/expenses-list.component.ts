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
  Renderer2,
  ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { map, takeUntil, throttleTime } from 'rxjs/operators';
import { UiService } from '../../../core/services';
import { Expense } from '@roomies/expenses.contracts';

@Component({
  selector: 'roomies-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpensesListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport)
  virtualScroll: CdkVirtualScrollViewport;

  @ViewChild('wrapper')
  wrapper: ElementRef;

  @Input() expenses: Expense[] = [];

  @Output() paging = new EventEmitter<{ first: number; rows: number }>();

  itemSize = 76;
  destroy$ = new Subject();

  constructor(private render: Renderer2, private uiService: UiService) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.render.setStyle(
      this.virtualScroll.elementRef.nativeElement,
      'height',
      `${this.calcListHeight()}px`
    );
    this.virtualScroll.scrolledIndexChange
      .pipe(
        throttleTime(100),
        map((e: number) => ({
          first: e > 0 ? e + 20 : 0,
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
    const offset = this.uiService.isSmall ? 100 + 56 : 100 + 64;
    return window.innerHeight - offset;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
