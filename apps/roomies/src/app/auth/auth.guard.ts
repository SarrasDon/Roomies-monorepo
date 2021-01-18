import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from './state/auth.state';
import { AuthService } from './services';
import { catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import {
  RefreshedTokenFail,
  RefreshedTokenSuccess
} from './state/auth.actions';

@Injectable()
export class AuthGuard implements CanLoad {
  constructor(
    private router: Router,
    private store: Store,
    private authService: AuthService
  ) { }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    const isLoggedIn = this.store.selectSnapshot(AuthState.isLoggedIn);
    if (isLoggedIn) {
      return of(true);
    }

    const currentUser = this.store.selectSnapshot(AuthState.currentUser);
    if (!currentUser) {
      this.navigateToAuth();
      return of(false);
    }
    return this.authService.refresh(currentUser).pipe(
      map(({ user, access_token }) => {
        this.store.dispatch(new RefreshedTokenSuccess(user, access_token));
        return true;
      }),
      catchError(error => {
        this.store.dispatch(new RefreshedTokenFail());
        this.navigateToAuth();
        return of(false);
      })
    );
  }

  navigateToAuth() {
    this.router.navigate(['/auth']);
  }
}
