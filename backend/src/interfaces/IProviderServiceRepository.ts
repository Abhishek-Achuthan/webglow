import { IBaseRepository } from './IBaseRepository'
import { IProviderService } from '../models/provider-service.model'
import type { PaginatedResult, ServiceFilterOptions } from './IPagination'

export interface IProviderServiceRepository extends IBaseRepository<IProviderService> {
  findServices(filters: ServiceFilterOptions): Promise<PaginatedResult<IProviderService>>
}

export type ProviderServiceRepository = IProviderServiceRepository
