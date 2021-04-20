import { Router } from 'express'
import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes'
import usersRouter from '@modules/users/infra/http/routes/users.routes'
import sessionRouter from '@modules/users/infra/http/routes/session.routes'
import passwordRoutes from '@modules/users/infra/http/routes/password.routes'
import profileRouter from '@modules/users/infra/http/routes/profile.routes'
import providersRouter from '@modules/appointments/infra/http/routes/providers.routes'

const routes = Router()

routes.use('/appointments', appointmentsRouter)
routes.use('/users', usersRouter)
routes.use('/session', sessionRouter)
routes.use('/password', passwordRoutes)
routes.use('/profile', profileRouter)
routes.use('/providers', providersRouter)

export default routes
