import { useMutation, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { API_ROUTES } from '../constants/api.constant';
import type { ProviderService, PaginatedResponse, ServiceFilters } from '../types/service.types';

export interface LocationData {
  type: string;
  coordinates: number[];
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface AvailabilityData {
  startDate: string;
  endDate: string;
}

export interface CreateProviderServiceData {
  title: string;
  category: string;
  pricePerDay: number;
  description: string;
  location: LocationData;
  contact?: string;
  availability?: AvailabilityData[];
  isActive?: boolean;
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

const buildQueryParams = (filters: ServiceFilters & { page: number }): string => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
};

export const useCreateProviderService = () => {
  return useMutation({
    mutationFn: async (data: CreateProviderServiceData) => {
      const response = await api.post(API_ROUTES.PROVIDER_SERVICE.CREATE, data);
      return response.data;
    },
  });
};

export const useMyServices = (filters: ServiceFilters = {}) => {
  return useInfiniteQuery<PaginatedResponse<ProviderService>>({
    queryKey: ['my-services', filters],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const params = buildQueryParams({ ...filters, page: pageParam as number });
      const response = await api.get<ApiResponse<PaginatedResponse<ProviderService>>>(
        `${API_ROUTES.PROVIDER_SERVICE.MY_SERVICES}?${params}`,
      );
      return response.data.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
};

export const useAdminServices = (filters: ServiceFilters = {}) => {
  return useInfiniteQuery<PaginatedResponse<ProviderService>>({
    queryKey: ['admin-services', filters],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const params = buildQueryParams({ ...filters, page: pageParam as number });
      const response = await api.get<ApiResponse<PaginatedResponse<ProviderService>>>(
        `${API_ROUTES.PROVIDER_SERVICE.ADMIN_SERVICES}?${params}`,
      );
      return response.data.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
};

export const useBrowseServices = (filters: ServiceFilters = {}) => {
  return useInfiniteQuery<PaginatedResponse<ProviderService>>({
    queryKey: ['browse-services', filters],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const params = buildQueryParams({ ...filters, page: pageParam as number });
      const response = await api.get<ApiResponse<PaginatedResponse<ProviderService>>>(
        `${API_ROUTES.PROVIDER_SERVICE.BROWSE}?${params}`,
      );
      return response.data.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
};

export const useGetServiceById = (id: string) => {
  return useQuery<ProviderService>({
    queryKey: ['provider-service', id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ProviderService>>(
        API_ROUTES.PROVIDER_SERVICE.GET_ONE(id),
      );
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useGetBrowseServiceById = (id: string) => {
  return useQuery<ProviderService>({
    queryKey: ['browse-service', id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ProviderService>>(
        API_ROUTES.PROVIDER_SERVICE.BROWSE_ONE(id),
      );
      return response.data.data;
    },
    enabled: !!id,
  });
};

export interface UpdateProviderServiceData {
  title?: string;
  category?: string;
  pricePerDay?: number;
  description?: string;
  location?: LocationData;
  contact?: string;
  availability?: AvailabilityData[];
  isActive?: boolean;
}

export const useUpdateProviderService = (id: string) => {
  return useMutation({
    mutationFn: async (data: UpdateProviderServiceData) => {
      const response = await api.patch<ApiResponse<ProviderService>>(
        API_ROUTES.PROVIDER_SERVICE.UPDATE(id),
        data,
      );
      return response.data.data;
    },
  });
};
