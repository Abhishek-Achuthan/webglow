import { Types } from 'mongoose'
import { IProviderServiceRepository } from '../interfaces/IProviderServiceRepository'
import { IProviderService } from '../models/provider-service.model'
import { CreateProviderServiceDto } from '../dtos/provider-service/create-provider-service.dto'
import { UpdateProviderServiceDto } from '../dtos/provider-service/update-provider-service.dto'
import { ListServicesQueryDto } from '../dtos/provider-service/list-services-query.dto'
import {
  ProviderServiceResponseDto,
  toProviderServiceResponse,
  toProviderServiceResponsePaginated,
} from '../dtos/provider-service/provider-service-response.dto'
import { AppError } from '../errors/AppError'
import { ERRORS } from '../constants/errors.constant'
import type { PaginatedResult, ServiceFilterOptions } from '../interfaces/IPagination'
import type { IProviderServiceService } from '../interfaces/services/IProviderServiceService'

export class ProviderServiceService implements IProviderServiceService {
  constructor(private readonly _providerServiceRepo: IProviderServiceRepository) {}

  async createService(
    dto: CreateProviderServiceDto,
    providerId: string,
  ): Promise<ProviderServiceResponseDto> {
    const { availability, ...rest } = dto

    try {
      const created = await this._providerServiceRepo.create({
        ...rest,
        location: { ...rest.location, type: rest.location.type ?? 'Point' },
        providerId: new Types.ObjectId(providerId),
        ...(availability && {
          availability: availability.map((a) => ({
            startDate: new Date(a.startDate),
            endDate: new Date(a.endDate),
          })),
        }),
      })
      return toProviderServiceResponse(created)
    } catch (error) {
      throw new AppError(400, `${ERRORS.PROVIDER_SERVICE.CREATE_FAILED}: ${(error as Error).message}`)
    }
  }

  async getServiceById(id: string, providerId: string): Promise<ProviderServiceResponseDto> {
    const service = await this._providerServiceRepo.findById(id)

    if (!service) {
      throw new AppError(404, ERRORS.PROVIDER_SERVICE.NOT_FOUND)
    }

    if (service.providerId.toString() !== providerId) {
      throw new AppError(403, ERRORS.PROVIDER_SERVICE.NOT_FOUND)
    }

    return toProviderServiceResponse(service)
  }

  async updateService(
    id: string,
    providerId: string,
    dto: UpdateProviderServiceDto,
  ): Promise<ProviderServiceResponseDto> {
    await this.getServiceById(id, providerId)

    const { availability, ...rest } = dto
    const updatePayload: Partial<IProviderService> = { ...rest } as Partial<IProviderService>

    if (availability !== undefined) {
      updatePayload.availability = availability.map((a) => ({
        startDate: new Date(a.startDate!),
        endDate: new Date(a.endDate!),
      }))
    }

    try {
      const updated = await this._providerServiceRepo.update(id, updatePayload)
      if (!updated) {
        throw new Error('Update returned null')
      }
      return toProviderServiceResponse(updated)
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(400, `${ERRORS.PROVIDER_SERVICE.UPDATE_FAILED}: ${(error as Error).message}`)
    }
  }

  async getMyServices(
    providerId: string,
    query: ListServicesQueryDto,
  ): Promise<PaginatedResult<ProviderServiceResponseDto>> {
    try {
      const result = await this._providerServiceRepo.findServices(
        this._buildFilters(query, { providerId }),
      )
      return toProviderServiceResponsePaginated(result)
    } catch (error) {
      throw new AppError(400, `${ERRORS.PROVIDER_SERVICE.LIST_FAILED}: ${(error as Error).message}`)
    }
  }

  async getAllServices(
    query: ListServicesQueryDto,
  ): Promise<PaginatedResult<ProviderServiceResponseDto>> {
    try {
      const result = await this._providerServiceRepo.findServices(this._buildFilters(query))
      return toProviderServiceResponsePaginated(result)
    } catch (error) {
      throw new AppError(400, `${ERRORS.PROVIDER_SERVICE.LIST_FAILED}: ${(error as Error).message}`)
    }
  }

  async browseServices(
    query: ListServicesQueryDto,
  ): Promise<PaginatedResult<ProviderServiceResponseDto>> {
    try {
      const result = await this._providerServiceRepo.findServices(
        this._buildFilters(query, { isActive: true }),
      )
      return toProviderServiceResponsePaginated(result)
    } catch (error) {
      throw new AppError(400, `${ERRORS.PROVIDER_SERVICE.LIST_FAILED}: ${(error as Error).message}`)
    }
  }

  async getBrowseServiceById(id: string): Promise<ProviderServiceResponseDto> {
    const service = await this._providerServiceRepo.findById(id)

    if (!service || !service.isActive) {
      throw new AppError(404, ERRORS.PROVIDER_SERVICE.NOT_FOUND)
    }

    return toProviderServiceResponse(service)
  }

  private _buildFilters(
    query: ListServicesQueryDto,
    overrides: Partial<ServiceFilterOptions> = {},
  ): ServiceFilterOptions {
    return {
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? parseInt(query.limit, 10) : 10,
      category: query.category,
      minPrice: query.minPrice ? parseFloat(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? parseFloat(query.maxPrice) : undefined,
      lat: query.lat ? parseFloat(query.lat) : undefined,
      lng: query.lng ? parseFloat(query.lng) : undefined,
      radiusKm: query.radiusKm ? parseFloat(query.radiusKm) : undefined,
      availableFrom: query.availableFrom ? new Date(query.availableFrom) : undefined,
      availableTo: query.availableTo ? new Date(query.availableTo) : undefined,
      search: query.search,
      ...overrides,
    }
  }
}
