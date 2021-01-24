import { createAction, props } from "@ngrx/store";
import { User } from "@roomies/user.contracts";

export const login = createAction('[Auth] Login', props<{ email: string, password: string }>());
export const loginSuccess = createAction('[Auth Effects] Login Success', props<{ user: User, access_token: string }>());
export const loginFail = createAction('[Auth Effects] Login Failed', props<{ error: any }>());
export const logout = createAction('[Auth] Logout');

export const updateUserAvatar = createAction('[Header] Update User avatar', props<{ avatarUrl: string }>())
export const usersLoaded = createAction('[Expense Resolver] Users Loaded', props<{ users: User[] }>())
export const refreshTokenSuccess = createAction('[Auth guard] User Refreshed Token', props<{ user: User, access_token: string }>())
export const refreshTokenFailed = createAction('[Auth guard] Refreshed Failed')
