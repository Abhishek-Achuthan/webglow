import { ProviderServiceDocument, IProviderService } from '../models/provider-service.model'
import {
  ProviderServiceResponseDto,
  ServiceLocationDto,
  ServiceAvailabilityDto,
} from '../dtos/provider-service/provider-service-response.dto'
import { PaginatedResult } from '../interfaces/ipagination'

export class ProviderServiceMapper {
  static toDto(doc: ProviderServiceDocument | IProviderService | any): ProviderServiceResponseDto {
    const obj = typeof doc?.toJSON === 'function' ? doc.toJSON() : doc

    const location: ServiceLocationDto = {
      type: obj.location?.type ?? 'Point',
      coordinates: Array.isArray(obj.location?.coordinates) ? obj.location.coordinates : [],
      address: obj.location?.address,
      city: obj.location?.city,
      state: obj.location?.state,
      zipCode: obj.location?.zipCode,
    }

    const availability: ServiceAvailabilityDto[] = Array.isArray(obj.availability)
      ? obj.availability.map((item: any) => ({
          startDate:
            item.startDate instanceof Date
              ? item.startDate.toISOString()
              : new Date(item.startDate).toISOString(),
          endDate:
            item.endDate instanceof Date
              ? item.endDate.toISOString()
              : new Date(item.endDate).toISOString(),
        }))
      : []

    return {
      _id: obj._id?.toString() ?? '',
      title: obj.title ?? '',
      providerId: obj.providerId?.toString() ?? '',
      category: obj.category ?? '',
      pricePerDay: obj.pricePerDay ?? 0,
      description: obj.description ?? '',
      location,
      contact: obj.contact,
      availability,
      isActive: Boolean(obj.isActive),
      createdAt:
        obj.createdAt instanceof Date
          ? obj.createdAt.toISOString()
          : obj.createdAt
            ? new Date(obj.createdAt).toISOString()
            : '',
      updatedAt:
        obj.updatedAt instanceof Date
          ? obj.updatedAt.toISOString()
          : obj.updatedAt
            ? new Date(obj.updatedAt).toISOString()
            : '',
    }
  }

  static toDtoList(
    docs: (ProviderServiceDocument | IProviderService | any)[],
  ): ProviderServiceResponseDto[] {
    return docs.map((doc) => ProviderServiceMapper.toDto(doc))
  }

  static toPaginatedDto(
    result: PaginatedResult<ProviderServiceDocument | IProviderService | any>,
  ): PaginatedResult<ProviderServiceResponseDto> {
    return {
      data: ProviderServiceMapper.toDtoList(result.data),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    }
  }
}

export const toProviderServiceResponse = ProviderServiceMapper.toDto
export const toProviderServiceResponseList = ProviderServiceMapper.toDtoList
export const toProviderServiceResponsePaginated = ProviderServiceMapper.toPaginatedDto
