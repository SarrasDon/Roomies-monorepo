import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  Renderer2
} from '@angular/core';
import { Subject } from 'rxjs';
import { map, takeUntil, throttleTime } from 'rxjs/operators';
import { Expense } from '../../../shared/models';

@Component({
  selector: 'roomies-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpensesListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport)
  virtualScroll: CdkVirtualScrollViewport;

  @Input() expenses: Expense[] = [];

  @Output() paging = new EventEmitter<{ first: number; rows: number }>();

  itemSize = 76;
  destroy$ = new Subject();

  constructor(private host: ElementRef, private render: Renderer2) {}

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
