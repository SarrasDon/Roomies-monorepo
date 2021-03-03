import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  Renderer2
} from '@angular/core';
import { merge, Subject } from 'rxjs';
import {
  delay,
  mapTo,
  publish,
  refCount,
  takeUntil,
  tap
} from 'rxjs/operators';
import { UiService } from '../../core/services';
import {
  TOTAL_COUNTER_AFTER_DIALOG_CLOSED_DELAY,
  TOTAL_COUNTER_WAIT_DOWN_DELAY
} from '../expenses.config';

@Directive({
  selector: '[animateTotalIncrease]',
})
export class AnimateTotalIncreaseDirective implements AfterViewInit, OnDestroy {
  onDestroy$ = new Subject();

  constructor(
    private uiService: UiService,
    private renderer: Renderer2,
    private counterElement: ElementRef
  ) { }

  changeAfterDialogClosed$ = this.uiService.newExpenseSubmitted.pipe(
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
    this.changeAfterDialogClosed$.pipe(delay(TOTAL_COUNTER_WAIT_DOWN_DELAY + 100), mapTo('initial'))
  ).pipe(
    publish(),
    refCount()
  );

  animationEnd$ = this.balanceAnimation$.pipe(delay(TOTAL_COUNTER_WAIT_DOWN_DELAY + 200));

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
