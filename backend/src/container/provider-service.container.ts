import { ProviderServiceModel } from '../models/provider-service.model'
import { IProviderServiceRepository } from '../interfaces/IProviderServiceRepository'
import { MongooseProviderServiceRepository } from '../repositories/provider-service.repository'
import { IProviderServiceService } from '../interfaces/services/IProviderServiceService'
import { ProviderServiceService } from '../services/provider-service.service'
import { ProviderServiceController } from '../controllers/provider-service.controller'

export interface ProviderServiceDependencies {
  providerServiceRepository: IProviderServiceRepository
  providerServiceService: IProviderServiceService
  providerServiceController: ProviderServiceController
}

export function createProviderServiceContainer(): ProviderServiceDependencies {
  const providerServiceRepository: IProviderServiceRepository =
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
