import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { from, Observable, of } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { AuthState, getCurrentUser, getIsLoggenIn, logout, updateUserAvatar } from '../../../auth/state';
import { CloudinaryService } from '../../services';

@Component({
  selector: 'roomies-header-container',
  template: `
    <roomies-header
      [isLoggedIn]="isLoggedIn$ | async"
      [avatar]="avatar$ | async"
      [userName]="userName$ | async"
      (userLoggedOut)="onUserLoggedOut($event)"
      (uploadImgStarted)="onUploadImgStarted()"
    ></roomies-header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderContainerComponent implements OnInit {
  isLoggedIn$ = this.store.pipe(select(getIsLoggenIn))
  user$ = this.store.pipe(select(getCurrentUser))
  avatar$: Observable<{ default: boolean; content: string }>;
  userName$ = this.user$.pipe(map(user => (user ? user.name : null)));

  constructor(private store: Store<AuthState>, private cloudinary: CloudinaryService) { }

  ngOnInit() {
    this.avatar$ = this.user$.pipe(
      map(user =>
        user && user.avatarUrl
          ? { content: user.avatarUrl, default: false }
          : { content: '/assets/images/default-avatar.png', default: true }
      ),
      switchMap(item =>
        item.default ? of(item) : this.getAvatar(item.content)
      )
    );
  }

  getAvatar(url: string) {
    return from(this.cloudinary.getAvatarImg(url)).pipe(
      map(content => ({ default: false, content }))
    );
  }

  onUserLoggedOut($event) {
    this.store.dispatch(logout());
  }

  onUploadImgStarted() {
    this.cloudinary.uploadResult
      .pipe(
        filter(res => res.event && res.event === 'success'),
        take(1)
      )
      .subscribe(({ info }) => {
        this.store.dispatch(updateUserAvatar({ avatarUrl: info.secure_url }));
      });
    this.cloudinary.openWidget();
  }
}
