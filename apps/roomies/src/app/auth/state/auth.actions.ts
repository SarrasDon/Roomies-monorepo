import { User } from '../../shared/models';

export class SetCurrentUser {
  static readonly type = '[Auth] Set current user';
  constructor(public payload: { user: User }) {}
}

export class Login {
  static readonly type = '[Auth] Login';
  constructor(public email: string, public password: string) {}
}

export class SignUp {
  static readonly type = '[Auth] SignUp';
  constructor(public email: string, public password: string) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
  constructor() {}
}

export class UpdateUserAvatar {
  static readonly type = '[Header] Update Avatar';
  constructor(public avatarUrl: string) {}
}

export class UsersLoaded {
  static readonly type = '[Expense Resolver] Users Loaded';
  constructor(public users: User[]) {}
}

export class RefreshedTokenSuccess {
  static readonly type = '[Auth guard] User Refreshed Token';
  constructor(public user: User, public access_token: string) {}
}

export class RefreshedTokenFail {
  static readonly type = '[Auth guard] Refresh Failed';
}

export class ClearUser {
  static readonly type = 'Clear user!';
}
