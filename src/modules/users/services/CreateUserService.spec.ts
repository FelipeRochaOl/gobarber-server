import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '@modules/users/tests/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProviders'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'

import CreateUserService from './CreateUserService'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let fakeCacheProvider: FakeCacheProvider
let createUserService: CreateUserService

describe('CreateUsers', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    fakeCacheProvider = new FakeCacheProvider()

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    )
  })

  it('should be able to create a new user', async () => {
    const user = await createUserService.execute({
      name: 'Felipe Rocha Oliveira',
      email: 'feliperochaoliveira@gobarber.com',
      password: '123456',
    })

    expect(user).toHaveProperty('id')
  })

  it('should not be able to create a new user with same email from another', async () => {
    await createUserService.execute({
      name: 'Felipe Rocha Oliveira',
      email: 'feliperochaoliveira@gobarber.com',
      password: '123456',
    })

    await expect(
      createUserService.execute({
        name: 'Felipe Rocha Oliveira',
        email: 'feliperochaoliveira@gobarber.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
