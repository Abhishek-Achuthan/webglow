import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { api } from '../services/api';
import { API_ROUTES } from '../constants/api.constant';
import { setCredentials, type User } from '../store/slices/auth.slice';
import { setToken } from '../store/slices/token.slice';
import { useNavigate } from '@tanstack/react-router';
import { AxiosError } from 'axios';
import type { ApiResponse } from '../types/api.types';

interface LoginResponse {
  user: User & { _id?: string };
  accessToken: string;
}

export const useLogin = (options?: { redirectUrl?: string }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation<LoginResponse, AxiosError<ApiResponse<null>>, Record<string, unknown>>({
    mutationFn: async (credentials: Record<string, unknown>) => {
      const response = await api.post<ApiResponse<LoginResponse>>(API_ROUTES.USER.LOGIN, credentials);
      return response.data.data;
    },
    onSuccess: (data: LoginResponse) => {
      if (data?.user && data?.accessToken) {
        dispatch(
          setCredentials({
            user: {
              ...data.user,
              id: data.user._id || data.user.id,
            },
          })
        );
        dispatch(setToken(data.accessToken));
        navigate({ to: options?.redirectUrl || '/' });
      }
    },
  });
};

export const useSignup = (options?: { redirectUrl?: string }) => {
  const navigate = useNavigate();

  return useMutation<unknown, AxiosError<ApiResponse<null>>, Record<string, unknown>>({
    mutationFn: async (userData: Record<string, unknown>) => {
      const response = await api.post<ApiResponse<unknown>>(API_ROUTES.USER.REGISTER, userData);
      return response.data.data;
    },
    onSuccess: () => {
      navigate({ to: options?.redirectUrl || '/login' });
    },
  });
};
