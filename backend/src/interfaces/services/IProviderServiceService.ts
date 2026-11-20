import type { ProviderServiceResponseDto } from '../../dtos/provider-service/provider-service-response.dto'
import type { CreateProviderServiceDto } from '../../dtos/provider-service/create-provider-service.dto'
import type { UpdateProviderServiceDto } from '../../dtos/provider-service/update-provider-service.dto'
import type { ListServicesQueryDto } from '../../dtos/provider-service/list-services-query.dto'
import type { PaginatedResult } from '../ipagination'

export interface IProviderServiceService {
  createService(
    dto: CreateProviderServiceDto,
    providerId: string,
  ): Promise<ProviderServiceResponseDto>

  getServiceById(id: string, providerId: string): Promise<ProviderServiceResponseDto>

  updateService(
    id: string,
    providerId: string,
    dto: UpdateProviderServiceDto,
  ): Promise<ProviderServiceResponseDto>

  getMyServices(
    providerId: string,
    query: ListServicesQueryDto,
  ): Promise<PaginatedResult<ProviderServiceResponseDto>>

  getAllServices(
    query: ListServicesQueryDto,
  ): Promise<PaginatedResult<ProviderServiceResponseDto>>

  browseServices(
    query: ListServicesQueryDto,
  ): Promise<PaginatedResult<ProviderServiceResponseDto>>

  getBrowseServiceById(id: string): Promise<ProviderServiceResponseDto>
}
