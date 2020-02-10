import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, onErrorResumeNext } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class BaseInterceptorService implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const req = this.setGlobalHeaders(request);
    return next.handle(req);
  }

  setGlobalHeaders(request: HttpRequest<any>) {
    return request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'true'
      },
      withCredentials: true
    });
  }
}
