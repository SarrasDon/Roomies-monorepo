import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../shared/models/user.model';
import * as AuthActions from './auth.actions';
import { Dictionary } from '../../shared/interfaces';
import { UsersService } from '../../core/services';

export interface AuthStateModel {
  currentUser: User | null;
  userDictionary: Dictionary<User>;
  access_token: string;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    userDictionary: {},
    access_token: null,
    currentUser:
      (JSON.parse(localStorage.getItem('user') as string) as User) || null
  }
})
export class AuthState {
  @Selector()
  public static currentUser(state: AuthStateModel): User | null {
    return state.currentUser;
  }

  @Selector()
  public static isLoggedIn(state: AuthStateModel) {
    return state.currentUser !== null;
  }

  @Selector()
  public static access_token(state: AuthStateModel) {
    return state.access_token;
  }

  constructor(
    private authService: AuthService,
    public userService: UsersService
  ) {}

  @Action(AuthActions.Login)
  login(
    ctx: StateContext<AuthStateModel>,
    { email, password }: AuthActions.Login
  ) {
    return this.authService.login(email, password).pipe(
      tap(({ access_token, user }) => {
        ctx.patchState({ access_token, currentUser: user });
        document.cookie = `access_token=${access_token}`;
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
    localStorage.removeItem('user');
    return ctx.patchState({ currentUser: null });
  }

  @Action(AuthActions.SignUp)
  signup(
    ctx: StateContext<AuthStateModel>,
    { email, password }: AuthActions.SignUp
  ) {
    return this.authService.signUp(email, password).pipe(
      tap(currentUser => {
        ctx.patchState({ currentUser });
        localStorage.setItem('user', JSON.stringify(currentUser));
      })
    );
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
    ctx.patchState({ userDictionary: users.toDictionary() });
  }
}
