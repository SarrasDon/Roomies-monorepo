import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthState } from './state/auth.state';
import { Select } from '@ngxs/store';
import { first } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  @Select(AuthState.access_token) accessToken$: Observable<string>;

  constructor() {}

  private get access_token() {
    let token: string;
    this.accessToken$.pipe(first()).subscribe(t => (token = t));
    return token;
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.includes('login')) {
      return next.handle(request);
    }
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.access_token}`
      }
    });
    return next.handle(request);
  }
}
