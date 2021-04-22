import { getHours, isBefore, startOfHour } from 'date-fns'
import { inject, injectable } from 'tsyringe'
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'

import AppError from '@shared/errors/AppError'
import IAppointmentsRepository from '../interfaces/IAppointmentsRepository'

interface IRequest {
  provider_id: string
  user_id: string
  date: Date
}

@injectable()
class CreateAppointmentService {
  private appointmentsRepository: IAppointmentsRepository

  constructor(
    @inject('AppointmentsRepository')
    appointmentsRepository: IAppointmentsRepository,
  ) {
    this.appointmentsRepository = appointmentsRepository
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

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    )

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked')
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    })

    return appointment
  }
}

export default CreateAppointmentService
