import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { User } from '@roomies/user.contracts';
import {
  loginFail,
  loginSuccess,
  logout,
  refreshTokenSuccess,
  updateUserAvatar,
  usersLoaded,
} from './auth.actions';

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
