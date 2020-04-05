import { Injectable, NgZone } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { UsersService } from '../../core/services';
import { toDictionary } from '../../shared/utils';
import { AuthService } from '../services/auth.service';
import * as AuthActions from './auth.actions';
import { Router } from '@angular/router';
import { Dictionary } from '@roomies/shared.data';
import { User } from '@roomies/user.contracts';

export interface AuthStateModel {
  currentUser: User | null;
  isLoggedIn: boolean;
  userDictionary: Dictionary<User>;
  access_token: string;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    userDictionary: {},
    access_token: null,
    isLoggedIn: false,
    currentUser:
      (JSON.parse(localStorage.getItem('user') as string) as User) || null
  }
})
@Injectable()
export class AuthState {
  @Selector()
  public static currentUser(state: AuthStateModel): User | null {
    return state.currentUser;
  }

  @Selector()
  public static isLoggedIn(state: AuthStateModel) {
    return state.isLoggedIn;
  }

  @Selector()
  public static access_token(state: AuthStateModel) {
    return state.access_token;
  }

  constructor(
    private authService: AuthService,
    public userService: UsersService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  @Action(AuthActions.Login)
  login(
    ctx: StateContext<AuthStateModel>,
    { email, password }: AuthActions.Login
  ) {
    return this.authService.login(email, password).pipe(
      tap(({ access_token, user }) => {
        ctx.patchState({ access_token, currentUser: user, isLoggedIn: true });
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  @Action(AuthActions.SetCurrentUser)
  setCurrentUser(ctx: StateContext<AuthStateModel>, { user }) {
    return ctx.patchState({ currentUser: user });
  }

  @Action(AuthActions.Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    localStorage.clear();
    this.ngZone.run(() => this.router.navigate(['/auth']));
    return ctx.patchState({ currentUser: null, isLoggedIn: false });
  }

  @Action(AuthActions.UpdateUserAvatar)
  updateAvatar(
    ctx: StateContext<AuthStateModel>,
    { avatarUrl }: AuthActions.UpdateUserAvatar
  ) {
    const user = ctx.getState().currentUser;
    return this.userService.update(user._id, { avatarUrl }).pipe(
      tap(() => {
        const currentUser = { ...user, avatarUrl };
        ctx.patchState({ currentUser });
        localStorage.setItem('user', JSON.stringify(currentUser));
      })
    );
  }

  @Action(AuthActions.UsersLoaded)
  usersLoaded(
    ctx: StateContext<AuthStateModel>,
    { users }: AuthActions.UsersLoaded
  ) {
    ctx.patchState({ userDictionary: toDictionary(users) });
  }

  @Action(AuthActions.RefreshedTokenSuccess)
  tokenRefreshed(
    ctx: StateContext<AuthStateModel>,
    { user, access_token }: AuthActions.RefreshedTokenSuccess
  ) {
    ctx.patchState({ access_token, currentUser: user, isLoggedIn: true });
    localStorage.setItem('user', JSON.stringify(user));
  }

  @Action(AuthActions.ClearUser)
  clearUser(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      access_token: null
      // currentUser: null,
      // isLoggedIn: false
    });
  }
}
