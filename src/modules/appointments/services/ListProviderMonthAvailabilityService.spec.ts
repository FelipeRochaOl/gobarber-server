import { uuid } from 'uuidv4'

import FakeAppointmentsRepository from '@modules/appointments/tests/fakes/FakeAppointmentsRepository'
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    listProviderMonthAvailabilityService =
      new ListProviderMonthAvailabilityService(fakeAppointmentsRepository)
  })

  it('should be able to list the month availability from provider', async () => {
    const provider_id = uuid()
    const user_id = uuid()

    await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2021, 4, 20, 8, 0, 0),
    })

    await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2021, 4, 20, 9, 0, 0),
    })

    await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2021, 4, 20, 10, 0, 0),
    })

    await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2021, 4, 20, 11, 0, 0),
    })

    await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2021, 4, 20, 12, 0, 0),
    })

    await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2021, 4, 20, 13, 0, 0),
    })

    await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2021, 4, 20, 14, 0, 0),
    })

    await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2021, 4, 20, 15, 0, 0),
    })

    await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2021, 4, 20, 16, 0, 0),
    })

    await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2021, 4, 20, 17, 0, 0),
    })

    await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2021, 4, 21, 8, 0, 0),
    })

    const availability = await listProviderMonthAvailabilityService.execute({
      provider_id,
      year: 2021,
      month: 5,
    })

    expect(availability).toEqual(
      expect.arrayContaining([
        { available: false, day: 1 },
        { available: false, day: 2 },
        { available: false, day: 3 },
        { available: false, day: 4 },
        { available: false, day: 5 },
        { available: false, day: 6 },
        { available: false, day: 7 },
        { available: false, day: 8 },
        { available: false, day: 9 },
        { available: false, day: 10 },
        { available: false, day: 11 },
        { available: false, day: 12 },
        { available: false, day: 13 },
        { available: false, day: 14 },
        { available: false, day: 15 },
        { available: false, day: 16 },
        { available: false, day: 17 },
        { available: false, day: 18 },
        { available: false, day: 19 },
        { available: false, day: 20 },
        { available: true, day: 21 },
        { available: true, day: 22 },
        { available: true, day: 23 },
        { available: true, day: 24 },
        { available: true, day: 25 },
        { available: true, day: 26 },
        { available: true, day: 27 },
        { available: true, day: 28 },
        { available: true, day: 29 },
        { available: true, day: 30 },
        { available: true, day: 31 },
      ]),
    )
  })
})
