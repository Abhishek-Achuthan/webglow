import { Router } from 'express'
import { ProviderServiceService } from './provider-service.service'
import { sendResponse } from '../common/helpers/response.helper'
import { RESPONSE_MESSAGES } from '../common/constants/response-messages.constant'
import { ROUTES } from '../common/constants/routes.constant'
import { jwtAuthMiddleware } from '../common/middleware/jwtAuth.middleware'
import { rolesMiddleware } from '../common/middleware/roles.middleware'
import { ROLES } from '../common/constants/roles.constant'
import { ListServicesQueryDto } from './dto/list-services-query.dto'

export function createProviderServiceRouter(service: ProviderServiceService): Router {
  const router = Router()

  // POST / — Create service (PROVIDER)
  router.post(
    `/${ROUTES.PROVIDER_SERVICE.CREATE}`,
    jwtAuthMiddleware,
    rolesMiddleware(ROLES.PROVIDER),
    async (req, res, next) => {
      try {
        const data = await service.createService(req.body, req.user!.sub)
        sendResponse(res, 201, RESPONSE_MESSAGES.PROVIDER_SERVICE.CREATE_SUCCESS, data)
      } catch (err) {
        next(err)
      }
    },
  )

  // GET /my — My services (PROVIDER)
  router.get(
    `/${ROUTES.PROVIDER_SERVICE.MY_SERVICES}`,
    jwtAuthMiddleware,
    rolesMiddleware(ROLES.PROVIDER),
    async (req, res, next) => {
      try {
        const data = await service.getMyServices(req.user!.sub, req.query as unknown as ListServicesQueryDto)
        sendResponse(res, 200, RESPONSE_MESSAGES.PROVIDER_SERVICE.MY_LIST_SUCCESS, data)
      } catch (err) {
        next(err)
      }
    },
  )

  // GET /admin — Admin list (ADMIN)
  router.get(
    `/${ROUTES.PROVIDER_SERVICE.ADMIN}`,
    jwtAuthMiddleware,
    rolesMiddleware(ROLES.ADMIN),
    async (req, res, next) => {
      try {
        const data = await service.getAllServices(req.query as unknown as ListServicesQueryDto)
        sendResponse(res, 200, RESPONSE_MESSAGES.PROVIDER_SERVICE.ADMIN_LIST_SUCCESS, data)
      } catch (err) {
        next(err)
      }
    },
  )

  // GET /browse — Browse public (no auth) — must be before /:id
  router.get(`/${ROUTES.PROVIDER_SERVICE.BROWSE}`, async (req, res, next) => {
    try {
      const data = await service.browseServices(req.query as unknown as ListServicesQueryDto)
      sendResponse(res, 200, RESPONSE_MESSAGES.PROVIDER_SERVICE.BROWSE_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  })

  // GET /browse/:id — Browse one public (no auth) — must be before /:id
  router.get(`/${ROUTES.PROVIDER_SERVICE.BROWSE_ONE}`, async (req, res, next) => {
    try {
      const { id } = req.params as { id: string }
      const data = await service.getBrowseServiceById(id)
      sendResponse(res, 200, RESPONSE_MESSAGES.PROVIDER_SERVICE.GET_ONE_SUCCESS, data)
    } catch (err) {
      next(err)
    }
  })

  // GET /:id — Get one (PROVIDER)
  router.get(
    `/${ROUTES.PROVIDER_SERVICE.GET_ONE}`,
    jwtAuthMiddleware,
    rolesMiddleware(ROLES.PROVIDER),
    async (req, res, next) => {
      try {
        const { id } = req.params as { id: string }
        const data = await service.getServiceById(id, req.user!.sub)
        sendResponse(res, 200, RESPONSE_MESSAGES.PROVIDER_SERVICE.GET_ONE_SUCCESS, data)
      } catch (err) {
        next(err)
      }
    },
  )

  // PATCH /:id — Update (PROVIDER)
  router.patch(
    `/${ROUTES.PROVIDER_SERVICE.UPDATE}`,
    jwtAuthMiddleware,
    rolesMiddleware(ROLES.PROVIDER),
    async (req, res, next) => {
      try {
        const { id } = req.params as { id: string }
        const data = await service.updateService(id, req.user!.sub, req.body)
        sendResponse(res, 200, RESPONSE_MESSAGES.PROVIDER_SERVICE.UPDATE_SUCCESS, data)
      } catch (err) {
        next(err)
      }
    },
  )

  return router
}
