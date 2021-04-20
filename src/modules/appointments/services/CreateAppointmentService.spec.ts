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
    const providerId = uuid()
    const appointment = await createAppointment.execute({
      provider_id: providerId,
      date: new Date(),
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe(providerId)
  })

  it('should not be able to create two appointments on the same time', async () => {
    const providerId = uuid()
    const appointmentDate = new Date(2020, 3, 11, 11)

    await createAppointment.execute({
      provider_id: providerId,
      date: appointmentDate,
    })

    await expect(
      createAppointment.execute({
        provider_id: providerId,
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
