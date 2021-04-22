import FakeAppointmentsRepository from '@modules/appointments/tests/fakes/FakeAppointmentsRepository'
import AppError from '@shared/errors/AppError'
import { uuid } from 'uuidv4'
import CreateAppointmentService from './CreateAppointmentService'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let createAppointment: CreateAppointmentService

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    createAppointment = new CreateAppointmentService(fakeAppointmentsRepository)
  })

  it('should be able to create a new appointment', async () => {
    const provider_id = uuid()
    const user_id = uuid()

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 12).getTime()
    })

    const appointment = await createAppointment.execute({
      provider_id,
      user_id,
      date: new Date(2021, 4, 10, 13),
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe(provider_id)
  })

  it('should not be able to create two appointments on the same time', async () => {
    const provider_id = uuid()
    const user_id = uuid()

    const appointmentDate = new Date(2021, 4, 10, 12)

    await createAppointment.execute({
      provider_id,
      user_id,
      date: appointmentDate,
    })

    await expect(
      createAppointment.execute({
        provider_id,
        user_id,
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment on the past date', async () => {
    const provider_id = uuid()
    const user_id = uuid()

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 12).getTime()
    })

    await expect(
      createAppointment.execute({
        date: new Date(2021, 4, 10, 11),
        user_id,
        provider_id,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment with same user as provider', async () => {
    const provider_id = uuid()
    const user_id = provider_id

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 12).getTime()
    })

    await expect(
      createAppointment.execute({
        date: new Date(2021, 4, 10, 13),
        user_id,
        provider_id,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    const provider_id = uuid()
    const user_id = uuid()

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 12).getTime()
    })

    await expect(
      createAppointment.execute({
        date: new Date(2021, 4, 10, 7),
        user_id,
        provider_id,
      }),
    ).rejects.toBeInstanceOf(AppError)

    await expect(
      createAppointment.execute({
        date: new Date(2021, 4, 10, 18),
        user_id,
        provider_id,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
