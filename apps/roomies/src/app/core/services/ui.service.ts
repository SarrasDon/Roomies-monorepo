import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, first } from 'rxjs/operators';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  newExpenseSubmitted = new Subject<boolean>();
  private _isExpensesListScrolling = new BehaviorSubject(false);
  isExpensesListScrolling = this._isExpensesListScrolling.asObservable();

  scrollToTop$ = new Subject();
  private _hasScrolled$ = new BehaviorSubject(false);
  hasScrolled$ = this._hasScrolled$.asObservable();

  constructor(private breakpointObserver: BreakpointObserver) {}

  observe$(...breakPoints: string[]) {
    return this.breakpointObserver.observe(breakPoints);
  }

  get isSmall() {
    let res = false;
    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .pipe(
        map((state) => state.matches),
        first()
      )
      .subscribe((o) => (res = o));
    return res;
  }

  expensesListScrolled(isScrolling: boolean) {
    this._isExpensesListScrolling.next(isScrolling);
  }

  hasScrolled(scroll: boolean) {
    this._hasScrolled$.next(scroll);
  }

  scrollToTop() {
    this.scrollToTop$.next();
  }
}
