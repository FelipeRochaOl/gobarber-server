import { Router } from 'express'

import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated'
import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController'

const providersRouter = Router()
const providersController = new ProvidersController()

providersRouter.use(ensureAuthenticated)

providersRouter.get('/', providersController.index)

export default providersRouter
