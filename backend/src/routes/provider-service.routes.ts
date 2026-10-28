import { Router } from 'express'
import { ProviderServiceController } from '../controllers/provider-service.controller'
import { ROUTES } from '../constants/routes.constant'
import { jwtAuthMiddleware } from '../middlewares/jwtAuth.middleware'
import { rolesMiddleware } from '../middlewares/roles.middleware'
import { ROLES } from '../constants/roles.constant'

export function createProviderServiceRouter(controller: ProviderServiceController): Router {
  const router = Router()

  router.post(
    `/${ROUTES.PROVIDER_SERVICE.CREATE}`,
    jwtAuthMiddleware,
    rolesMiddleware(ROLES.PROVIDER),
    controller.createService,
  )

  router.get(
    `/${ROUTES.PROVIDER_SERVICE.MY_SERVICES}`,
    jwtAuthMiddleware,
    rolesMiddleware(ROLES.PROVIDER),
    controller.getMyServices,
  )

  router.get(
    `/${ROUTES.PROVIDER_SERVICE.ADMIN}`,
    jwtAuthMiddleware,
    rolesMiddleware(ROLES.ADMIN),
    controller.getAllServices,
  )

  router.get(`/${ROUTES.PROVIDER_SERVICE.BROWSE}`, controller.browseServices)
  router.get(`/${ROUTES.PROVIDER_SERVICE.BROWSE_ONE}`, controller.getBrowseServiceById)

  router.get(
    `/${ROUTES.PROVIDER_SERVICE.GET_ONE}`,
    jwtAuthMiddleware,
    rolesMiddleware(ROLES.PROVIDER),
    controller.getServiceById,
  )

  router.patch(
    `/${ROUTES.PROVIDER_SERVICE.UPDATE}`,
    jwtAuthMiddleware,
    rolesMiddleware(ROLES.PROVIDER),
    controller.updateService,
  )

  return router
}
