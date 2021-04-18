import { Router } from 'express'
import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes'
import usersRouter from '@modules/users/infra/http/routes/users.routes'
import sessionRouter from '@modules/users/infra/http/routes/session.routes'
import passwordRoutes from '@modules/users/infra/http/routes/password.routes'

const routes = Router()

routes.use('/appointments', appointmentsRouter)
routes.use('/users', usersRouter)
routes.use('/session', sessionRouter)
routes.use('/password', passwordRoutes)

export default routes
