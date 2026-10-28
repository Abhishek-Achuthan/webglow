import { Request, Response, NextFunction } from 'express'
import { ProviderServiceService } from '../services/provider-service.service'
import { sendResponse } from '../helpers/response.helper'
import { RESPONSE_MESSAGES } from '../constants/response-messages.constant'
import { ListServicesQueryDto } from '../dtos/provider-service/list-services-query.dto'

export class ProviderServiceController {
  constructor(private readonly service: ProviderServiceService) {}

  createService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.createService(req.body, req.user!.sub)
      sendResponse(res, 201, RESPONSE_MESSAGES.PROVIDER_SERVICE.CREATE_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  }

  getMyServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getMyServices(req.user!.sub, req.query as unknown as ListServicesQueryDto)
      sendResponse(res, 200, RESPONSE_MESSAGES.PROVIDER_SERVICE.MY_LIST_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  }

  getAllServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.getAllServices(req.query as unknown as ListServicesQueryDto)
      sendResponse(res, 200, RESPONSE_MESSAGES.PROVIDER_SERVICE.ADMIN_LIST_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  }

  browseServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.browseServices(req.query as unknown as ListServicesQueryDto)
      sendResponse(res, 200, RESPONSE_MESSAGES.PROVIDER_SERVICE.BROWSE_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  }

  getBrowseServiceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string }
      const data = await this.service.getBrowseServiceById(id)
      sendResponse(res, 200, RESPONSE_MESSAGES.PROVIDER_SERVICE.GET_ONE_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  }

  getServiceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string }
      const data = await this.service.getServiceById(id, req.user!.sub)
      sendResponse(res, 200, RESPONSE_MESSAGES.PROVIDER_SERVICE.GET_ONE_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  }

  updateService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string }
      const data = await this.service.updateService(id, req.user!.sub, req.body)
      sendResponse(res, 200, RESPONSE_MESSAGES.PROVIDER_SERVICE.UPDATE_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  }
}
