import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, first } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private _isExpensesListScrolling = new BehaviorSubject(false);

  isExpensesListScrolling = this._isExpensesListScrolling.asObservable();

  constructor(private breakpointObserver: BreakpointObserver) { }

  observe$(...breakPoints: string[]) {
    return this.breakpointObserver.observe(breakPoints);
  }

  get isSmall() {
    let res = false;
    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .pipe(
        map(state => state.matches),
        first()
      )
      .subscribe(o => (res = o));
    return res;
  }

  expensesListScrolled(isScrolling: boolean) {
    this._isExpensesListScrolling.next(isScrolling);
  }
}
