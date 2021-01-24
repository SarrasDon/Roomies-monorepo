import { createFeatureSelector, createSelector } from '@ngrx/store';
import { authFeatureKey, AuthState, usersAdapter } from './auth.state';

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
