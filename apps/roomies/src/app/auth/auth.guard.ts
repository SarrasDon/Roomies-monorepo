import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { storeSnapshot } from '../shared/utils';
import { AuthService } from './services';
import { AuthState, getCurrentUser, getIsLoggenIn, refreshTokenFailed, refreshTokenSuccess } from './store';


@Injectable()
export class AuthGuard implements CanLoad {
  constructor(
    private router: Router,
    private store: Store<AuthState>,
    private authService: AuthService
  ) { }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    const isLoggedIn = storeSnapshot(this.store, getIsLoggenIn);
    if (isLoggedIn) {
      return of(true);
    }

    const currentUser = storeSnapshot(this.store, getCurrentUser);
    if (!currentUser) {
      this.navigateToAuth();
      return of(false);
    }
    return this.authService.refresh(currentUser).pipe(
      map(({ user, access_token }) => {
        this.store.dispatch(refreshTokenSuccess({ user, access_token }));
        return true;
      }),
      catchError((error) => {
        this.store.dispatch(refreshTokenFailed());
        this.navigateToAuth();
        return of(false);
      })
    );
  }

  navigateToAuth() {
    this.router.navigate(['/auth']);
  }
}
