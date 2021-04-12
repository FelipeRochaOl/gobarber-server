import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '@modules/users/tests/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProviders'
import CreateUserService from './CreateUserService'

describe('CreateUsers', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )

    const user = await createUserService.execute({
      name: 'Felipe Rocha Oliveira',
      email: 'feliperochaoliveira@gobarber.com',
      password: '123456',
    })

    expect(user).toHaveProperty('id')
  })

  it('should not be able to create a new user with same email from another', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )

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
