export interface ServiceLocation {
  type: string;
  coordinates: number[]; // [longitude, latitude]
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface ServiceAvailability {
  startDate: string;
  endDate: string;
}

export interface ProviderService {
  _id: string;
  title: string;
  providerId: string;
  category: string;
  pricePerDay: number;
  description: string;
  location: ServiceLocation;
  contact?: string;
  availability: ServiceAvailability[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ServiceFilters {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  availableFrom?: string;
  availableTo?: string;
  search?: string;
}
