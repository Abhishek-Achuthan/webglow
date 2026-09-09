import { createFileRoute, redirect } from '@tanstack/react-router';
import { store } from '../store/store';
import { ROLES } from '../constants/roles.constant';
import { ServicesListPage } from '../pages/services.list';
import { api } from '../services/api';
import { API_ROUTES } from '../constants/api.constant';
import { setToken, clearToken } from '../store/slices/token.slice';
import { logout } from '../store/slices/auth.slice';

export const Route = createFileRoute('/services')({
  beforeLoad: async () => {
    const state = store.getState();
    let token = state.token.accessToken;
    const role = state.auth.user?.role;
    const isAuthenticated = state.auth.isAuthenticated;

    if (!token && isAuthenticated) {
      try {
        const response = await api.post(API_ROUTES.USER.REFRESH_TOKEN);
        token = response.data.data.accessToken;
        store.dispatch(setToken(token as string));
      } catch {
        store.dispatch(logout());
        store.dispatch(clearToken());
      }
    }

    if (!token) {
      throw redirect({ to: '/login' });
    }

    if (role !== ROLES.USER) {
      throw redirect({ to: '/login' });
    }
  },
  component: ServicesListPage,
});
