import { Action, createReducer, on } from '@ngrx/store';
import { Dictionary } from '@roomies/shared.data';
import { User } from '@roomies/user.contracts';
import {
  loginSuccess,
  logout,
  updateUserAvatar,
  usersLoaded,
  refreshTokenSuccess,
  loginFail,
} from './auth.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

export const authFeatureKey = 'auth';

export interface UserEntityState extends EntityState<User> {}
export interface AuthState {
  currentUser: User | null;
  isLoggedIn: boolean;
  userDictionary: UserEntityState;
  access_token: string;
  loginError: string;
}

export const usersAdapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: (user) => user._id,
});

const initialState: AuthState = {
  currentUser:
    (JSON.parse(localStorage.getItem('user') as string) as User) || null,
  isLoggedIn: false,
  userDictionary: usersAdapter.getInitialState(),
  access_token: null,
  loginError: null,
};

const _authReducer = createReducer<AuthState>(
  initialState,
  on(loginSuccess, (state, { user, access_token }) => ({
    ...state,
    currentUser: user,
    isLoggedIn: true,
    access_token,
  })),
  on(loginFail, (state, { error }) => {
    return { ...state, loginError: error.message };
  }),
  on(logout, (state) => ({
    ...state,
    currentUser: null,
    access_token: null,
    isLoggedIn: false,
  })),
  on(updateUserAvatar, (state, { avatarUrl }) => ({
    ...state,
    currentUser: { ...state.currentUser, avatarUrl },
  })),
  on(usersLoaded, (state, { users }) => ({
    ...state,
    userDictionary: usersAdapter.addMany(users, state.userDictionary),
  })),
  on(refreshTokenSuccess, (state, { user, access_token }) => ({
    ...state,
    currentUser: user,
    access_token,
    isLoggedIn: true,
  }))
);

export const authReducer = function (state: AuthState, action: Action) {
  return _authReducer(state, action);
};
// @Injectable()
// export class AuthState {
//   @Selector()
//   public static currentUser(state: AuthStateModel): User | null {
//     return state.currentUser;
//   }

//   @Selector()
//   public static isLoggedIn(state: AuthStateModel) {
//     return state.isLoggedIn;
//   }

//   @Selector()
//   public static access_token(state: AuthStateModel) {
//     return state.access_token;
//   }

//   @Selector()
//   public static usersDict(state: AuthStateModel) {
//     return state.userDictionary;
//   }

//   @Selector()
//   public static userImagesDict(state: AuthStateModel) {
//     return Object.values(state.userDictionary)
//       .map(({ name, avatarUrl }) => ({
//         name,
//         avatarUrl
//       }))
//       .reduce(
//         (acc, cur) => ({
//           ...acc,
//           [cur.name]: cur.avatarUrl
//         }),
//         {}
//       );
//   }

//   constructor(
//     private authService: AuthService,
//     public userService: UsersService,
//     private router: Router,
//     private ngZone: NgZone
//   ) { }

//   @Action(AuthActions.Logout)
//   logout(ctx: StateContext<AuthStateModel>) {
//     localStorage.clear();
//     this.ngZone.run(() => this.router.navigate(['/auth']));
//     return ctx.patchState({ currentUser: null, isLoggedIn: false });
//   }

//   @Action(AuthActions.UpdateUserAvatar)
//   updateAvatar(
//     ctx: StateContext<AuthStateModel>,
//     { avatarUrl }: AuthActions.UpdateUserAvatar
//   ) {
//     const user = ctx.getState().currentUser;
//     return this.userService.update(user._id, { avatarUrl }).pipe(
//       tap(() => {
//         const currentUser = { ...user, avatarUrl };
//         ctx.patchState({ currentUser });
//         localStorage.setItem('user', JSON.stringify(currentUser));
//       })
//     );
//   }

//   @Action(AuthActions.UsersLoaded)
//   usersLoaded(
//     ctx: StateContext<AuthStateModel>,
//     { users }: AuthActions.UsersLoaded
//   ) {
//     ctx.patchState({ userDictionary: toDictionary(users) });
//   }

//   @Action(AuthActions.RefreshedTokenSuccess)
//   tokenRefreshed(
//     ctx: StateContext<AuthStateModel>,
//     { user, access_token }: AuthActions.RefreshedTokenSuccess
//   ) {
//     ctx.patchState({ access_token, currentUser: user, isLoggedIn: true });
//     localStorage.setItem('user', JSON.stringify(user));
//   }

//   @Action(AuthActions.ClearUser)
//   clearUser(ctx: StateContext<AuthStateModel>) {
//     ctx.patchState({
//       access_token: null
//       // currentUser: null,
//       // isLoggedIn: false
//     });
//   }
// }
