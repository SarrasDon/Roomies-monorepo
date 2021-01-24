import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthState } from '../../auth/state';
import { Store } from '@ngrx/store';
import { loginFail } from '../../auth/state/auth.actions';
@Injectable()
export class UnauthorizedInterceptorService implements HttpInterceptor {
  constructor(private router: Router, private ngZone: NgZone, private store: Store<AuthState>) { }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(this.handleUnauthorized(req));
  }
  handleUnauthorized(req: HttpRequest<any>) {
    return (source: Observable<HttpEvent<any>>) =>
      source.pipe(
        catchError((error: HttpErrorResponse) => {
          if (req.url.toLowerCase().includes('login')) {
            this.store.dispatch(loginFail({ error: { message: 'Wrong username or password!' } }));
            return of(error as any);
          }
          if (error.status === 401) {
            this.ngZone.run(() => this.router.navigate(['/auth']));
          }
          return of(error as any);
        })
      );
  }
}
