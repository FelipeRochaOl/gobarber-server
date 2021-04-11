import { Router } from 'express'

import multer from 'multer'
import uploadConfig from '@config/upload'
import ensureAuthenticated from '@modules/users/infra/http/middleware/ensureAuthenticated'
import UsersController from '@modules/users/infra/http/controllers/UsersController'
import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatarController'

const usersRoutes = Router()
const upload = multer(uploadConfig)
const usersController = new UsersController()
const userAvatarController = new UserAvatarController()

usersRoutes.post('/', usersController.create)

usersRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update,
)

export default usersRoutes
