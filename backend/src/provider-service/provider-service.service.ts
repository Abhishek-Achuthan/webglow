import { Types } from 'mongoose'
import { ProviderServiceRepository } from './repository/provider-service.repository'
import { IProviderService } from './schema/provider-service.schema'
import { createProviderServiceSchema } from './dto/create-provider-service.dto'
import { updateProviderServiceSchema } from './dto/update-provider-service.dto'
import { ListServicesQueryDto } from './dto/list-services-query.dto'
import { AppError } from '../common/errors/AppError'
import { ERRORS } from '../common/constants/errors.constant'
import type { PaginatedResult, ServiceFilterOptions } from '../common/interfaces/pagination.interface'

export class ProviderServiceService {
  constructor(private readonly _providerServiceRepo: ProviderServiceRepository) {}

  async createService(dto: unknown, providerId: string): Promise<IProviderService> {
    // Let ZodError bubble up to the global error handler (returns 400 with field details).
    // Only catch unexpected persistence errors here.
    const parsed = createProviderServiceSchema.parse(dto)
    const { availability, ...rest } = parsed

    try {
      return await this._providerServiceRepo.create({
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
    } catch (error) {
      throw new AppError(400, `${ERRORS.PROVIDER_SERVICE.CREATE_FAILED}: ${(error as Error).message}`)
    }
  }

  async getServiceById(id: string, providerId: string): Promise<IProviderService> {
    const service = await this._providerServiceRepo.findById(id)

    if (!service) {
      throw new AppError(404, ERRORS.PROVIDER_SERVICE.NOT_FOUND)
    }

    if (service.providerId.toString() !== providerId) {
      throw new AppError(403, ERRORS.PROVIDER_SERVICE.NOT_FOUND)
    }

    return service
  }

  async updateService(id: string, providerId: string, dto: unknown): Promise<IProviderService> {
    // Let ZodError bubble to global error handler
    const parsed = updateProviderServiceSchema.parse(dto)

    // Let AppError (403/404) bubble from ownership check
    await this.getServiceById(id, providerId)

    const { availability, ...rest } = parsed
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
      return updated
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(400, `${ERRORS.PROVIDER_SERVICE.UPDATE_FAILED}: ${(error as Error).message}`)
    }
  }

  async getMyServices(
    providerId: string,
    query: ListServicesQueryDto,
  ): Promise<PaginatedResult<IProviderService>> {
    try {
      return await this._providerServiceRepo.findServices(
        this._buildFilters(query, { providerId }),
      )
    } catch (error) {
      throw new AppError(400, `${ERRORS.PROVIDER_SERVICE.LIST_FAILED}: ${(error as Error).message}`)
    }
  }

  async getAllServices(query: ListServicesQueryDto): Promise<PaginatedResult<IProviderService>> {
    try {
      return await this._providerServiceRepo.findServices(this._buildFilters(query))
    } catch (error) {
      throw new AppError(400, `${ERRORS.PROVIDER_SERVICE.LIST_FAILED}: ${(error as Error).message}`)
    }
  }

  async browseServices(query: ListServicesQueryDto): Promise<PaginatedResult<IProviderService>> {
    try {
      return await this._providerServiceRepo.findServices(
        this._buildFilters(query, { isActive: true }),
      )
    } catch (error) {
      throw new AppError(400, `${ERRORS.PROVIDER_SERVICE.LIST_FAILED}: ${(error as Error).message}`)
    }
  }

  async getBrowseServiceById(id: string): Promise<IProviderService> {
    const service = await this._providerServiceRepo.findById(id)

    if (!service || !service.isActive) {
      throw new AppError(404, ERRORS.PROVIDER_SERVICE.NOT_FOUND)
    }

    return service
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
