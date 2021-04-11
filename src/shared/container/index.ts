import { container } from 'tsyringe'

import '@modules/users/providers'

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository'
import IAppointmentsRepository from '@modules/appointments/interfaces/IAppointmentsRepository'

import IUsersRepository from '@modules/users/interfaces/IUsersRepository'
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository'

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsRepository,
)
container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
)
