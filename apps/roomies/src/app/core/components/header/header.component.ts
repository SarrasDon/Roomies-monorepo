import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import {
  AuthState,
  getCurrentUser,
  getIsLoggenIn,
  logout
} from '../../../auth/store';

@Component({
  selector: 'roomies-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  isLoggedIn$ = this.store.pipe(select(getIsLoggenIn));
  user$ = this.store.pipe(select(getCurrentUser));
  avatar$ = this.user$.pipe(
    map((user) =>
      user && `url('${user.avatarUrl}')`
    ),
  );

  constructor(
    private store: Store<AuthState>,
  ) { }


  onLogout() {
    this.store.dispatch(logout());
  }
}
