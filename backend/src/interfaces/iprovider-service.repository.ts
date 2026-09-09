import { BaseRepository } from './ibase.repository'
import { IProviderService } from '../models/provider-service.model'
import type { PaginatedResult, ServiceFilterOptions } from './ipagination'

export abstract class ProviderServiceRepository extends BaseRepository<IProviderService> {
  abstract findServices(filters: ServiceFilterOptions): Promise<PaginatedResult<IProviderService>>
}
