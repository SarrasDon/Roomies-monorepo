import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { partition, zip, merge, Subject } from 'rxjs';
import {
  skip,
  scan,
  map,
  delay,
  publish,
  refCount,
  mapTo,
  takeUntil,
} from 'rxjs/operators';
import { UiService } from '../../core/services';
import {
  TOTAL_COUNTER_AFTER_DIALOG_CLOSED_DELAY,
  TOTAL_COUNTER_WAIT_DOWN_DELAY,
} from '../expenses.config';
import { TotalState, selectBalanceWithSign } from '../store';

@Directive({
  selector: '[animateTotalIncrease]',
})
export class AnimateTotalIncreaseDirective implements AfterViewInit, OnDestroy {
  onDestroy$ = new Subject();

  constructor(
    private store: Store<TotalState>,
    private uiService: UiService,
    private renderer: Renderer2,
    private counterElement: ElementRef
  ) {}

  changeAfterDialogClosed$ = zip(
    this.store.pipe(select(selectBalanceWithSign), skip(1)),
    this.uiService.createExpenseDialogClosed
  ).pipe(
    map((events) => events[0]),
    delay(TOTAL_COUNTER_AFTER_DIALOG_CLOSED_DELAY),
    publish(),
    refCount()
  );
  balanceAnimation$ = merge(
    this.changeAfterDialogClosed$.pipe(mapTo('goUp')),
    this.changeAfterDialogClosed$.pipe(
      delay(TOTAL_COUNTER_WAIT_DOWN_DELAY),
      mapTo('waitDown')
    ),
    this.changeAfterDialogClosed$.pipe(delay(200), mapTo('initial'))
  );
  animationEnd$ = this.balanceAnimation$.pipe(delay(200));

  ngAfterViewInit(): void {
    this.balanceAnimation$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((className) => {
        this.renderer.addClass(this.counterElement.nativeElement, className);
      });

    this.animationEnd$.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.renderer.removeClass(this.counterElement.nativeElement, 'goUp');
      this.renderer.removeClass(this.counterElement.nativeElement, 'waitDown');
      this.renderer.removeClass(this.counterElement.nativeElement, 'initial');
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
