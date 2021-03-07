import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, map, take } from 'rxjs/operators';
import { AuthState, getCurrentUser, getIsLoggenIn, logout, updateUserAvatar } from '../../../auth/store';
import { CloudinaryService } from '../../services';


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
    private cloudinary: CloudinaryService
  ) { }

  onUploadImg() {
    this.cloudinary.uploadResult
      .pipe(
        filter((res) => res.event && res.event === 'success'),
        take(1)
      )
      .subscribe(({ info }) => {
        this.store.dispatch(updateUserAvatar({ avatarUrl: info.secure_url }));
      });
    this.cloudinary.openWidget();
  }
  onLogout() {
    this.store.dispatch(logout());
  }
}
