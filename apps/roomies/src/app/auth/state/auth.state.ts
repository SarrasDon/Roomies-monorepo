import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { User } from '../../shared/models/user.model';
import * as AuthActions from './auth.actions';
import { AuthService } from '../../auth/auth.service';

export interface AuthStateMode {
  currentUser: User | null;
}

@State<AuthStateMode>({
  name: 'users',
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

  constructor(private authService: AuthService) {}

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
      tap(user => {
        ctx.patchState({ currentUser: user });
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }
}
