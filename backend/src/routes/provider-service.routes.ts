import { Router } from 'express'
import { providerServiceController } from '../container'
import { ROUTES } from '../constants/routes.constant'
import { jwtAuthMiddleware } from '../middlewares/jwtAuth.middleware'
import { rolesMiddleware } from '../middlewares/roles.middleware'
import { ROLES } from '../constants/roles.constant'

const router = Router()

router.post(
  ROUTES.PROVIDER_SERVICE.CREATE,
  jwtAuthMiddleware,
  rolesMiddleware(ROLES.PROVIDER),
  providerServiceController.createService,
)

router.get(
  ROUTES.PROVIDER_SERVICE.MY_SERVICES,
  jwtAuthMiddleware,
  rolesMiddleware(ROLES.PROVIDER),
  providerServiceController.getMyServices,
)

router.get(
  ROUTES.PROVIDER_SERVICE.ADMIN,
  jwtAuthMiddleware,
  rolesMiddleware(ROLES.ADMIN),
  providerServiceController.getAllServices,
)

router.get(ROUTES.PROVIDER_SERVICE.BROWSE, providerServiceController.browseServices)
router.get(ROUTES.PROVIDER_SERVICE.BROWSE_ONE, providerServiceController.getBrowseServiceById)

router.get(
  ROUTES.PROVIDER_SERVICE.GET_ONE,
  jwtAuthMiddleware,
  rolesMiddleware(ROLES.PROVIDER),
  providerServiceController.getServiceById,
)

router.patch(
  ROUTES.PROVIDER_SERVICE.UPDATE,
  jwtAuthMiddleware,
  rolesMiddleware(ROLES.PROVIDER),
  providerServiceController.updateService,
)

export default router
