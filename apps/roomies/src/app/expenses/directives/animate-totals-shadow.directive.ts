import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { UiService } from '../../core/services';

@Directive({
  selector: '[animateTotalsShadow]',
})
export class AnimateTotalsShadowDirective {
  @Input('animateTotalsShadow') shadowClass: string;

  onDestroy$ = new Subject();
  constructor(
    private uiService: UiService,
    private renderer: Renderer2,
    private totalsComponent: ElementRef
  ) {}

  ngAfterViewInit(): void {
    this.uiService.isExpensesListScrolling
      .pipe(distinctUntilChanged(), takeUntil(this.onDestroy$))
      .subscribe((isScrolling) => {
        this.renderer[isScrolling ? 'addClass' : 'removeClass'](
          this.totalsComponent.nativeElement,
          this.shadowClass
        );
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
