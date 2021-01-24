import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { storeSnapshot } from '../../shared/utils';
import { getAccessToken } from '../state/auth.selectors';
import { AuthState } from '../state/auth.state';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store<AuthState>) {}

  private get access_token() {
    return storeSnapshot(this.store, getAccessToken);
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.toLowerCase().includes('login')) {
      return next.handle(request);
    }
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.access_token}`,
      },
    });
    return next.handle(request);
  }
}
