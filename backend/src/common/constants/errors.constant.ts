export const ERRORS = {
  USER: {
    EMAIL_ALREADY_EXISTS: 'User with this email already exists',
    INVALID_CREDENTIALS: 'Email or password is incorrect',
    REFRESH_TOKEN_REQUIRED: 'Refresh token is required',
    USER_NOT_FOUND: 'User not found',
    INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token',
  },
  AUTH: {
    TOKEN_MISSING: 'Authentication token is missing',
    INVALID_TOKEN: 'Invalid or expired token',
    NO_ROLE_FOUND: 'Access denied. No role found.',
    INSUFFICIENT_PERMISSIONS: 'Access denied. Insufficient permissions.',
  },
  PROVIDER_SERVICE: {
    CREATE_FAILED: 'Failed to create service',
    LIST_FAILED: 'Failed to fetch services',
    NOT_FOUND: 'Service not found or access denied',
    UPDATE_FAILED: 'Failed to update service',
  },
  BOOKING: {
    INVALID_DATES: 'Start date must be before end date.',
    PAST_DATE: 'Start date cannot be in the past.',
    SELF_BOOKING: 'You cannot book your own service.',
    UNAVAILABLE_DATES:
      "The requested dates are outside the provider's availability.",
    CONFLICT: 'The requested dates conflict with an existing booking.',
    NOT_FOUND: 'Booking not found.',
    UNAUTHORIZED_CANCEL: 'You can only cancel your own bookings.',
    ALREADY_CANCELLED: 'Booking is already cancelled.',
    CANCEL_STARTED: 'Cannot cancel a booking that has already started.',
  },
};
