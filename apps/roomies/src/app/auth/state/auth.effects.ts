import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../services';
import {
  login,
  loginFail,
  loginSuccess,
  logout,
  refreshTokenSuccess,
} from './auth.actions';

@Injectable()
export class AuthEffects {
  //NOTE: login errors (code: 401) are also handled but unauthorized interceptor
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      mergeMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map(({ user, access_token }) => loginSuccess({ user, access_token })),
          catchError((error) => {
            return of(loginFail({ error }));
          })
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(({ user }) => localStorage.setItem('user', JSON.stringify(user))),
        tap(() => this.router.navigate(['/expenses']))
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => localStorage.clear()),
        tap(() => this.router.navigate(['/auth']))
      ),
    { dispatch: false }
  ); //TODO: invalidate tokens in API

  tokenRefresh$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(refreshTokenSuccess),
        tap(({ user }) => localStorage.setItem('user', JSON.stringify(user)))
      ),
    { dispatch: false }
  );

  //TODO: add effect for token refresh fail

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
}
