import { uuid } from 'uuidv4'

import FakeAppointmentsRepository from '@modules/appointments/tests/fakes/FakeAppointmentsRepository'
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    )
  })

  it('should be able to list the day availability from provider', async () => {
    const user_id = uuid()
    const provider_id = uuid()

    await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2021, 4, 21, 14, 0, 0),
    })

    await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2021, 4, 21, 15, 0, 0),
    })

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 21, 11, 0, 0).getTime()
    })

    const availability = await listProviderDayAvailabilityService.execute({
      provider_id,
      day: 21,
      year: 2021,
      month: 5,
    })

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
      ]),
    )
  })
})
