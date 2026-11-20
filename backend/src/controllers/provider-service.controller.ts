import { Request, Response, NextFunction } from 'express'
import { IProviderServiceService } from '../interfaces/services/IProviderServiceService'
import { sendResponse } from '../helpers/response.helper'
import { RESPONSE_MESSAGES } from '../constants/response-messages.constant'
import { HTTP_STATUS } from '../constants/http-status.constant'
import {
  createProviderServiceSchema,
  updateProviderServiceSchema,
  listServicesQuerySchema,
} from '../validators/provider-service.validator'

export class ProviderServiceController {
  constructor(private readonly service: IProviderServiceService) {}

  createService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedDto = createProviderServiceSchema.parse(req.body)
      const data = await this.service.createService(validatedDto, req.user!.sub)
      sendResponse(res, HTTP_STATUS.CREATED, RESPONSE_MESSAGES.PROVIDER_SERVICE.CREATE_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  }

  getMyServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedQuery = listServicesQuerySchema.parse(req.query)
      const data = await this.service.getMyServices(req.user!.sub, validatedQuery)
      sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGES.PROVIDER_SERVICE.MY_LIST_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  }

  getAllServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedQuery = listServicesQuerySchema.parse(req.query)
      const data = await this.service.getAllServices(validatedQuery)
      sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGES.PROVIDER_SERVICE.ADMIN_LIST_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  }

  browseServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedQuery = listServicesQuerySchema.parse(req.query)
      const data = await this.service.browseServices(validatedQuery)
      sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGES.PROVIDER_SERVICE.BROWSE_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  }

  getBrowseServiceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string }
      const data = await this.service.getBrowseServiceById(id)
      sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGES.PROVIDER_SERVICE.GET_ONE_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  }

  getServiceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string }
      const data = await this.service.getServiceById(id, req.user!.sub)
      sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGES.PROVIDER_SERVICE.GET_ONE_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  }

  updateService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params as { id: string }
      const validatedDto = updateProviderServiceSchema.parse(req.body)
      const data = await this.service.updateService(id, req.user!.sub, validatedDto)
      sendResponse(res, HTTP_STATUS.OK, RESPONSE_MESSAGES.PROVIDER_SERVICE.UPDATE_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  }
}
