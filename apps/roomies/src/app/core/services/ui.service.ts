import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  constructor(private breakpointObserver: BreakpointObserver) {}

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
}
