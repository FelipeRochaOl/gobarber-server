import { getHours, isBefore, startOfHour, format } from 'date-fns'
import { inject, injectable } from 'tsyringe'

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import IAppointmentsRepository from '@modules/appointments/interfaces/IAppointmentsRepository'
import INotificationsRepository from '@modules/notifications/interfaces/INotificationsRepository'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

import AppError from '@shared/errors/AppError'

interface IRequest {
  provider_id: string
  user_id: string
  date: Date
}

@injectable()
class CreateAppointmentService {
  private appointmentsRepository: IAppointmentsRepository

  private notificationsRepository: INotificationsRepository

  private cacheProvider: ICacheProvider

  constructor(
    @inject('AppointmentsRepository')
    appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    cacheProvider: ICacheProvider,
  ) {
    this.appointmentsRepository = appointmentsRepository
    this.notificationsRepository = notificationsRepository
    this.cacheProvider = cacheProvider
  }

  public async execute({
    provider_id,
    date,
    user_id,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date)

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError(`You can't create an appointment on a past date.`)
    }

    if (user_id === provider_id) {
      throw new AppError(`You can't create an appointment with yourself.`)
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError('You can only create appointments between 8am and 5pm')
    }

    const findAppointmentInSameDate =
      await this.appointmentsRepository.findByDate(appointmentDate, provider_id)

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked')
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    })

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'")

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormatted}`,
    })

    const formatDateKey = format(appointmentDate, 'yyyy-M-d')
    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${formatDateKey}`,
    )

    return appointment
  }
}

export default CreateAppointmentService
