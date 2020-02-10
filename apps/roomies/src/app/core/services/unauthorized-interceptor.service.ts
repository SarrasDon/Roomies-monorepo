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
@Injectable()
export class UnauthorizedInterceptorService implements HttpInterceptor {
  constructor(private router: Router, private ngZone: NgZone) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(this.handleUnauthorized());
  }
  handleUnauthorized() {
    return (source: Observable<HttpEvent<any>>) =>
      source.pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.ngZone.run(() => this.router.navigate(['/auth']));
          }
          return of(error as any);
        })
      );
  }
}
