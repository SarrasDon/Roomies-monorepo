import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from './state/auth.state';

@Injectable()
export class AuthGuard implements CanLoad {
  constructor(private router: Router, private store: Store) {}

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    const user = this.store.selectSnapshot(AuthState.currentUser);
    if (!user) {
      this.router.navigate(['/auth']);
      return false;
    }
    return true;
  }
}
