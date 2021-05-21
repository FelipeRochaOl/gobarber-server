import { uuid } from 'uuidv4'
import AppError from '@shared/errors/AppError'

import FakeAppointmentsRepository from '@modules/appointments/tests/fakes/FakeAppointmentsRepository'
import FakeNotificationRepository from '@modules/notifications/interfaces/fakes/FakeNotificationRepository'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

import CreateAppointmentService from './CreateAppointmentService'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let fakeNotificationRepository: FakeNotificationRepository
let fakeCacheProvider: FakeCacheProvider
let createAppointment: CreateAppointmentService

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    fakeNotificationRepository = new FakeNotificationRepository()
    fakeCacheProvider = new FakeCacheProvider()

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationRepository,
      fakeCacheProvider,
    )
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

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(8, 0, 0, 0)

    const appointmentDate = new Date(tomorrow)

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
