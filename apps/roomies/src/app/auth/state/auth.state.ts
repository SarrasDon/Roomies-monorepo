import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../shared/models/user.model';
import * as AuthActions from './auth.actions';
import { UsersService } from '../../core/services/users.service';

export interface AuthStateMode {
  currentUser: User | null;
}

@State<AuthStateMode>({
  name: 'auth',
  defaults: {
    currentUser:
      (JSON.parse(localStorage.getItem('user') as string) as User) || null
  }
})
export class AuthState {
  @Selector()
  public static currentUser(state: AuthStateMode): User | null {
    return state.currentUser;
  }

  @Selector()
  public static isLoggedIn(state: AuthStateMode): boolean {
    return state.currentUser !== null;
  }

  constructor(
    private authService: AuthService,
    public userService: UsersService
  ) {}

  @Action(AuthActions.Login)
  login(
    ctx: StateContext<AuthStateMode>,
    { email, password }: AuthActions.Login
  ) {
    return this.authService.login(email, password).pipe(
      tap(user => {
        ctx.patchState({ currentUser: user });
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  @Action(AuthActions.SetCurrentUser)
  setCurrentUser(ctx: StateContext<AuthStateMode>, { user }) {
    return ctx.patchState({ currentUser: user });
  }

  @Action(AuthActions.Logout)
  logout(ctx: StateContext<AuthStateMode>) {
    localStorage.removeItem('user');
    return ctx.patchState({ currentUser: null });
  }

  @Action(AuthActions.SignUp)
  signup(
    ctx: StateContext<AuthStateMode>,
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
    ctx: StateContext<AuthStateMode>,
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
}
