import { env } from '../env';

export const API_ROUTES = {
  USER: {
    BASE: 'user',
    REGISTER: '/user/register',
    LOGIN: '/user/login',
    REFRESH_TOKEN: '/user/refresh-token',
  },
  PROVIDER_SERVICE: {
    BASE: 'provider-service',
    CREATE: '/provider-service',
    MY_SERVICES: '/provider-service/my',
    ADMIN_SERVICES: '/provider-service/admin',
    BROWSE: '/provider-service/browse',
    BROWSE_ONE: (id: string) => `/provider-service/browse/${id}`,
    GET_ONE: (id: string) => `/provider-service/${id}`,
    UPDATE: (id: string) => `/provider-service/${id}`,
  },
  BOOKING: {
    CREATE: '/bookings',
    MY_BOOKINGS: '/bookings/my',
    AVAILABLE_DATES: (serviceId: string) => `/bookings/available-dates/${serviceId}`,
    PROVIDER_BOOKINGS: '/bookings/provider',
    ADMIN_BOOKINGS: '/bookings/admin',
    CANCEL: (id: string) => `/bookings/${id}/cancel`,
  },
};

export const API_BASE_URL = env.VITE_API_URL;

