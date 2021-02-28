import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { UiService } from '../../core/services';
import { TotalsComponent } from '../components';

@Component({
  selector: 'roomies-expenses-view',
  templateUrl: './expenses.view.html',
  styleUrls: ['./expenses.view.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesViewComponent implements AfterViewInit, OnDestroy {
  @ViewChild(TotalsComponent, { read: ElementRef }) totalsRef: any;

  onDestroy$ = new Subject<boolean>();
  constructor(private uiService: UiService, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.uiService.isExpensesListScrolling
      .pipe(distinctUntilChanged(), takeUntil(this.onDestroy$))
      .subscribe((isScrolling) => {
        this.renderer[isScrolling ? 'addClass' : 'removeClass'](
          this.totalsRef.nativeElement,
          'shadow-active'
        );
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
