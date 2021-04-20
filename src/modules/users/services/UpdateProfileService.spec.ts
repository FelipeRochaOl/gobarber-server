import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '@modules/users/tests/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProviders'
import UpdateProfileService from './UpdateProfileService'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let updateProfileService: UpdateProfileService

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()

    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    )
  })

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Felipe Rocha',
      email: 'feliperochaoliveira@gobarber.com',
      password: '123456',
    })

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Felipe Rocha Oliveira',
      email: 'feliperocha@gobarber.com',
    })

    expect(updatedUser.name).toBe('Felipe Rocha Oliveira')
    expect(updatedUser.email).toBe('feliperocha@gobarber.com')
  })

  it('should not be able udpate the profile from non-existing user ', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'non-existing-user-id',
        name: 'Felipe Rocha',
        email: 'feliperocha@gobarber.com',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Felipe Rocha',
      email: 'feliperochaoliveira@gobarber.com',
      password: '123456',
    })

    const user = await fakeUsersRepository.create({
      name: 'Felipe Rocha',
      email: 'feliperochaoliveira1@gobarber.com',
      password: '123456',
    })

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Felipe Rocha',
        email: 'feliperochaoliveira@gobarber.com',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Felipe Rocha',
      email: 'feliperochaoliveira@gobarber.com',
      password: '123456',
    })

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Felipe Rocha Oliveira',
      email: 'feliperocha@gobarber.com',
      old_password: '123456',
      password: '123123',
    })

    expect(updatedUser.password).toBe('123123')
  })

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Felipe Rocha',
      email: 'feliperochaoliveira@gobarber.com',
      password: '123456',
    })

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Felipe Rocha Oliveira',
        email: 'feliperocha@gobarber.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Felipe Rocha',
      email: 'feliperochaoliveira@gobarber.com',
      password: '123456',
    })

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: user.name,
        email: user.email,
        old_password: 'wrong old password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
