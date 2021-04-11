import FakeAppointmentsRepository from '@modules/appointments/tests/fakes/FakeAppointmentsRepository'
import AppError from '@shared/errors/AppError'
import { uuid } from 'uuidv4'
import CreateAppointmentService from './CreateAppointmentService'

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository()
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    )

    const providerId = uuid()
    const appointment = await createAppointment.execute({
      provider_id: providerId,
      date: new Date(),
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe(providerId)
  })

  it('should not be able to create two appointments on the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository()
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    )

    const providerId = uuid()
    const appointmentDate = new Date(2020, 3, 11, 11)

    await createAppointment.execute({
      provider_id: providerId,
      date: appointmentDate,
    })

    expect(
      createAppointment.execute({
        provider_id: providerId,
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
