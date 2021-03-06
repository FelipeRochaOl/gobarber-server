import { inject, injectable } from 'tsyringe'
import IAppointmentsRepository from '@modules/appointments/interfaces/IAppointmentsRepository'
import { getHours, isAfter, isWeekend } from 'date-fns'

interface IRequest {
  provider_id: string
  day: number
  month: number
  year: number
}

type IResponse = Array<{
  hour: number
  available: boolean
}>

@injectable()
class ListProviderDayAvailabilityService {
  private appointmentsRepository: IAppointmentsRepository

  constructor(
    @inject('AppointmentsRepository')
    appointmentsRepository: IAppointmentsRepository,
  ) {
    this.appointmentsRepository = appointmentsRepository
  }

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments =
      await this.appointmentsRepository.findAllInDayFromProvider({
        provider_id,
        day,
        month,
        year,
      })

    const hourStart = 8

    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    )

    const currentDate = new Date(Date.now())

    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointments.find(appointment => {
        return getHours(appointment.date) === hour
      })

      const compareDate = new Date(year, month - 1, day, hour)

      return {
        hour,
        available:
          !hasAppointmentInHour &&
          isAfter(compareDate, currentDate) &&
          !isWeekend(new Date(year, month - 1, day)),
      }
    })

    return availability
  }
}

export default ListProviderDayAvailabilityService
