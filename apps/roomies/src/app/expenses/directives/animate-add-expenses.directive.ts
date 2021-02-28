import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { UiService } from '../../core/services';

@Directive({
  selector: '[animateAddExpensesBtn]',
})
export class AnimateAddExpensesDirective implements AfterViewInit, OnDestroy {
  @Input('animateAddExpensesBtn') hideClass: string;
  onDestroy$ = new Subject();

  constructor(
    private uiService: UiService,
    private renderer: Renderer2,
    private addExpenseButton: ElementRef
  ) {}

  ngAfterViewInit(): void {
    this.uiService.isExpensesListScrolling
      .pipe(distinctUntilChanged(), takeUntil(this.onDestroy$))
      .subscribe((isScrolling) =>
        this.renderer[isScrolling ? 'addClass' : 'removeClass'](
          this.addExpenseButton.nativeElement,
          this.hideClass
        )
      );
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
