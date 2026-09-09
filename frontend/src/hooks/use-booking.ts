import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { API_ROUTES } from '../constants/api.constant';
import type {
  Booking,
  AvailableDatesResponse,
  CreateBookingPayload,
} from '../types/booking.types';
import type { PaginatedResponse } from '../types/service.types';

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export const useAvailableDates = (serviceId: string) => {
  return useQuery<AvailableDatesResponse>({
    queryKey: ['available-dates', serviceId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<AvailableDatesResponse>>(
        API_ROUTES.BOOKING.AVAILABLE_DATES(serviceId),
      );
      return response.data.data;
    },
    enabled: !!serviceId,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateBookingPayload) => {
      const response = await api.post<ApiResponse<Booking>>(
        API_ROUTES.BOOKING.CREATE,
        data,
      );
      return response.data.data;
    },
    onSuccess: (_data, variables) => {
      // Invalidate available dates and user bookings after a new booking
      queryClient.invalidateQueries({ queryKey: ['available-dates', variables.serviceId] });
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
  });
};

export const useMyBookings = (page = 1, limit = 10) => {
  return useQuery<PaginatedResponse<Booking>>({
    queryKey: ['my-bookings', page, limit],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PaginatedResponse<Booking>>>(
        `${API_ROUTES.BOOKING.MY_BOOKINGS}?page=${page}&limit=${limit}`,
      );
      return response.data.data;
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await api.patch<ApiResponse<Booking>>(
        API_ROUTES.BOOKING.CANCEL(bookingId),
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
  });
};

export const useProviderBookings = (page = 1, limit = 10) => {
  return useQuery<PaginatedResponse<Booking>>({
    queryKey: ['provider-bookings', page, limit],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PaginatedResponse<Booking>>>(
        `${API_ROUTES.BOOKING.PROVIDER_BOOKINGS}?page=${page}&limit=${limit}`,
      );
      return response.data.data;
    },
  });
};

export const useAdminBookings = (page = 1, limit = 10) => {
  return useQuery<PaginatedResponse<Booking>>({
    queryKey: ['admin-bookings', page, limit],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PaginatedResponse<Booking>>>(
        `${API_ROUTES.BOOKING.ADMIN_BOOKINGS}?page=${page}&limit=${limit}`,
      );
      return response.data.data;
    },
  });
};
