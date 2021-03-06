import FakeUsersRepository from '@modules/users/tests/fakes/FakeUsersRepository'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

import ListProvidersService from './ListProvidersService'

let fakeUsersRepository: FakeUsersRepository
let fakeCacheProvider: FakeCacheProvider
let listProvidersService: ListProvidersService

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeCacheProvider = new FakeCacheProvider()

    listProvidersService = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    )
  })

  it('should be able to list the providers', async () => {
    const provider1 = await fakeUsersRepository.create({
      name: 'Felipe Rocha1',
      email: 'feliperocha1@gobarber.com',
      password: '123456',
    })

    const provider2 = await fakeUsersRepository.create({
      name: 'Felipe Rocha 2',
      email: 'feliperocha2@gobarber.com',
      password: '123456',
    })

    const loggedUser = await fakeUsersRepository.create({
      name: 'Felipe Rocha',
      email: 'feliperocha@gobarber.com',
      password: '123456',
    })

    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    })

    expect(providers).toEqual([provider1, provider2])
  })
})
