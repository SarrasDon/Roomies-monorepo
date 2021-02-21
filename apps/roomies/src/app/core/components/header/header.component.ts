import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { from, Observable, of } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import {
  AuthState,
  getCurrentUser,
  getIsLoggenIn,
  logout,
  updateUserAvatar,
} from '../../../auth/store';
import { CloudinaryService } from '../../services';

@Component({
  selector: 'roomies-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  isLoggedIn$ = this.store.pipe(select(getIsLoggenIn));
  user$ = this.store.pipe(select(getCurrentUser));
  avatar$: Observable<{ default: boolean; content: string }>;

  constructor(
    private store: Store<AuthState>,
    private cloudinary: CloudinaryService
  ) {}

  ngOnInit() {
    this.avatar$ = this.user$.pipe(
      map((user) =>
        user && user.avatarUrl
          ? { content: user.avatarUrl, default: false }
          : { content: '/assets/images/default-avatar.png', default: true }
      ),
      switchMap((item) =>
        item.default ? of(item) : this.getAvatar(item.content)
      )
    );
  }

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

  getAvatar(url: string) {
    return from(
      this.cloudinary.getAvatarImg(url, { height: 42, width: 42 })
    ).pipe(map((content) => ({ default: false, content })));
  }
}
