import { uuid } from 'uuidv4'

import FakeAppointmentsRepository from '@modules/appointments/tests/fakes/FakeAppointmentsRepository'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'
import ListProviderAppointmentsService from './ListProviderAppointmentsService'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let fakeCacheProvider: FakeCacheProvider
let listProviderAppointmentsService: ListProviderAppointmentsService

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    fakeCacheProvider = new FakeCacheProvider()

    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    )
  })

  it('should be able to list the appointments on a specific day', async () => {
    const provider_id = uuid()
    const user_id = uuid()

    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2021, 4, 20, 14, 0, 0),
    })

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2021, 4, 20, 15, 0, 0),
    })

    const appointments = await listProviderAppointmentsService.execute({
      provider_id,
      day: 20,
      month: 5,
      year: 2021,
    })

    expect(appointments).toEqual([appointment1, appointment2])
  })
})
