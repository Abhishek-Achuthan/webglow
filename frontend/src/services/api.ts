import axios from 'axios';
import { API_BASE_URL } from '../constants/api.constant';
import { store } from '../store/store';
import { setToken, clearToken } from '../store/slices/token.slice';
import { logout } from '../store/slices/auth.slice';
import { router } from '../main';
import { ROLES } from '../constants/roles.constant';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = store.getState().token.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url &&
      !originalRequest.url.includes('/user/login') &&
      !originalRequest.url.includes('/user/refresh-token')
    ) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          `${API_BASE_URL}/user/refresh-token`,
          {},
          { withCredentials: true }
        );
        
        const newAccessToken = response.data.data.accessToken;
        
        store.dispatch(setToken(newAccessToken));
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        return api(originalRequest);
      } catch (error) {
        const role = store.getState().auth.user?.role;
        
        store.dispatch(clearToken());
        store.dispatch(logout());

        let url = '/login';
        if (role === ROLES.ADMIN) url = '/admin/login';
        else if (role === ROLES.PROVIDER) url = '/provider/login';

        router.navigate({ to: url });
        
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(err);
  }
);
