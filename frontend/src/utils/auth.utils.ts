import { store } from '../store/store';
import { ROLES } from '../constants/roles.constant';

export const hasRoleAccess = (allowedRoles: ROLES[]): boolean => {
  const state = store.getState();
  const { user, isAuthenticated } = state.auth;

  if (!isAuthenticated || !user) {
    return false;
  }

  return allowedRoles.includes(user.role);
};

export const checkRole = (role: ROLES): boolean => {
  const state = store.getState();
  return state.auth.user?.role === role;
};

export const isLoggedin = (): boolean => {
  const state = store.getState();
  return state.auth.isAuthenticated && state.token.accessToken !== null;
};
