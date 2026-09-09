export const ROUTES = {
  USER: {
    BASE: 'user',
    REGISTER: 'register',
    LOGIN: 'login',
    REFRESH_TOKEN: 'refresh-token',
  },
  PROVIDER_SERVICE: {
    BASE: 'provider-service',
    CREATE: '',
    MY_SERVICES: 'my',
    BROWSE: 'browse',
    BROWSE_ONE: 'browse/:id',
    ADMIN: 'admin',
    GET_ONE: ':id',
    UPDATE: ':id',
  },
  BOOKING: {
    BASE: 'bookings',
    CREATE: '',
    MY_BOOKINGS: 'my',
    AVAILABLE_DATES: 'available-dates/:serviceId',
    PROVIDER_BOOKINGS: 'provider',
    ADMIN_BOOKINGS: 'admin',
    CANCEL: ':id/cancel',
  },
};
