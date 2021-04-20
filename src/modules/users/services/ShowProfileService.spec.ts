import FakeUsersRepository from '@modules/users/tests/fakes/FakeUsersRepository'
import AppError from '@shared/errors/AppError'
import ShowProfileService from './ShowProfileService'

let fakeUsersRepository: FakeUsersRepository
let showProfileService: ShowProfileService

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    showProfileService = new ShowProfileService(fakeUsersRepository)
  })

  it('should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Felipe Rocha',
      email: 'feliperocha@gobarber.com',
      password: '123456',
    })

    const profile = await showProfileService.execute({
      user_id: user.id,
    })

    expect(profile.name).toBe('Felipe Rocha')
    expect(profile.email).toBe('feliperocha@gobarber.com')
  })

  it('should not be able show the profile from non-existing user ', async () => {
    await expect(
      showProfileService.execute({
        user_id: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
