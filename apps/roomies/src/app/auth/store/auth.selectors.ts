import { createFeatureSelector, createSelector } from '@ngrx/store';
import { authFeatureKey, AuthState, usersAdapter } from './auth.reducer';

export const authFeatureSelector = createFeatureSelector<AuthState>(
  authFeatureKey
);

export const getCurrentUser = createSelector(
  authFeatureSelector,
  (state) => state.currentUser
);
export const getIsLoggenIn = createSelector(
  authFeatureSelector,
  (state) => state.isLoggedIn
);
export const getAccessToken = createSelector(
  authFeatureSelector,
  (state) => state.access_token
);
export const getLoginError = createSelector(
  authFeatureSelector,
  (state) => state.loginError
);
export const getUserEntitiesState = createSelector(
  authFeatureSelector,
  (state) => state.userDictionary
);

export const {
  selectIds: getUserIds,
  selectEntities: getUserEntities,
  selectAll: getUsers,
} = usersAdapter.getSelectors(getUserEntitiesState);

export const getUserImageDict = createSelector(getUsers, (users) => {
  return users.reduce(
    (acc, user) => ({ ...acc, [user.name]: user.avatarUrl }),
    {}
  );
});

export const getUsersSorted = createSelector(
  getUsers,
  getCurrentUser,
  (users, user) => {
    if (!user) {
      return users;
    }
    return users.sort((a, b) =>
      a._id === user._id ? -1 : b._id === user._id ? 1 : 0
    );
  }
);
