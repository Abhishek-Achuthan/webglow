import { BaseRepository } from '../../common/repository/base.repository'
import { IProviderService } from '../schema/provider-service.schema'
import type { PaginatedResult, ServiceFilterOptions } from '../../common/interfaces/pagination.interface'

export abstract class ProviderServiceRepository extends BaseRepository<IProviderService> {
  abstract findServices(filters: ServiceFilterOptions): Promise<PaginatedResult<IProviderService>>
}
