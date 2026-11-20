import { ProviderServiceModel } from '../models/provider-service.model'
import { ProviderServiceRepository } from '../interfaces/iprovider-service.repository'
import { MongooseProviderServiceRepository } from '../repositories/provider-service.repository'
import { IProviderServiceService } from '../interfaces/services/IProviderServiceService'
import { ProviderServiceService } from '../services/provider-service.service'
import { ProviderServiceController } from '../controllers/provider-service.controller'

export interface ProviderServiceDependencies {
  providerServiceRepository: ProviderServiceRepository
  providerServiceService: IProviderServiceService
  providerServiceController: ProviderServiceController
}

export function createProviderServiceContainer(): ProviderServiceDependencies {
  const providerServiceRepository: ProviderServiceRepository =
    new MongooseProviderServiceRepository(ProviderServiceModel)
  const providerServiceService: IProviderServiceService =
    new ProviderServiceService(providerServiceRepository)
  const providerServiceController = new ProviderServiceController(
    providerServiceService,
  )

  return {
    providerServiceRepository,
    providerServiceService,
    providerServiceController,
  }
}
