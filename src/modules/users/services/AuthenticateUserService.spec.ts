import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '@modules/users/tests/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProviders'
import AuthenticateUserService from './AuthenticateUserService'
import CreateUserService from './CreateUserService'

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )

    const user = await createUser.execute({
      name: 'Felipe Rocha Oliveira',
      email: 'feliperochaoliveira@gobarber.com',
      password: '123456',
    })

    const response = await authenticateUser.execute({
      email: 'feliperochaoliveira@gobarber.com',
      password: '123456',
    })

    expect(response).toHaveProperty('token')
    expect(response.user).toEqual(user)
  })

  it('should not be able to authenticate with non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )

    await expect(
      authenticateUser.execute({
        email: 'feliperochaoliveira@gobarber.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to authenticate witn wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository()
    const fakeHashProvider = new FakeHashProvider()

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )
    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )

    await createUser.execute({
      name: 'Felipe Rocha Oliveira',
      email: 'feliperochaoliveira@gobarber.com',
      password: '123456',
    })

    await expect(
      authenticateUser.execute({
        email: 'feliperochaoliveira@gobarber.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
