import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { from, Observable, of } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { Logout, UpdateUserAvatar } from '../../../auth/state/auth.actions';
import { AuthState } from '../../../auth/state/auth.state';
import { User } from '../../../shared/models';
import { CloudinaryService } from '../../services/cloudinary.service';

@Component({
  selector: 'roomies-header-container',
  template: `
    <roomies-header
      [isLoggedIn]="isLoggedIn$ | async"
      [avatar]="avatar$ | async"
      [userName]="userName$ | async"
      (userLoggedOut)="onUserLoggedOut($event)"
      (uploadImgStarted)="onUploadImgStarted($event)"
    ></roomies-header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderContainerComponent implements OnInit {
  @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<boolean>;
  @Select(AuthState.currentUser) user$: Observable<User>;

  avatar$: Observable<{ default: boolean; content: string }>;
  userName$: Observable<string>;

  constructor(private store: Store, private cloudinary: CloudinaryService) {}

  ngOnInit() {
    this.userName$ = this.user$.pipe(map(user => (user ? user.name : null)));

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
    this.store.dispatch(new Logout());
  }

  onUploadImgStarted() {
    this.cloudinary.uploadResult
      .pipe(
        filter(res => res.event && res.event === 'success'),
        take(1)
      )
      .subscribe(({ info }) => {
        this.store.dispatch(new UpdateUserAvatar(info.secure_url));
      });
    this.cloudinary.openWidget();
  }
}
