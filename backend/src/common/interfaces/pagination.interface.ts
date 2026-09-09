export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ServiceFilterOptions {
  providerId?: string;
  isActive?: boolean;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  availableFrom?: Date;
  availableTo?: Date;
  page?: number;
  limit?: number;
  search?: string;
}
