import { BaseRepository } from './IBaseRepository'
import { IProviderService } from '../models/provider-service.model'
import type { PaginatedResult, ServiceFilterOptions } from './IPagination'

export abstract class ProviderServiceRepository extends BaseRepository<IProviderService> {
  abstract findServices(filters: ServiceFilterOptions): Promise<PaginatedResult<IProviderService>>
}
