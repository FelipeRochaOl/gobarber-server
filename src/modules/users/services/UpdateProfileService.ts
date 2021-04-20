import { inject, injectable } from 'tsyringe'

import User from '@modules/users/infra/typeorm/entities/User'

import AppError from '@shared/errors/AppError'
import IUsersRepository from '@modules/users/interfaces/IUsersRepository'
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider'

interface IRequest {
  user_id: string
  name: string
  email: string
  old_password?: string
  password?: string
}

@injectable()
class UpdateProfileService {
  private usersRepository: IUsersRepository

  private hashProvider: IHashProvider

  constructor(
    @inject('UsersRepository') usersRepository: IUsersRepository,
    @inject('HashProvider') hashProvider: IHashProvider,
  ) {
    this.usersRepository = usersRepository
    this.hashProvider = hashProvider
  }

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('User not found')
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email)

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('E-mail already in use.')
    }

    user.name = name
    user.email = email

    if (password && !old_password) {
      throw new AppError(
        'You need to inform the old password to set a new password.',
      )
    }

    if (password && old_password) {
      const checkOldPassword = this.hashProvider.compareHash(
        old_password,
        user.password,
      )

      if (!checkOldPassword) {
        throw new AppError('Old password does not match')
      }
    }

    if (password) {
      user.password = await this.hashProvider.generateHash(password)
    }

    return this.usersRepository.update(user)
  }
}

export default UpdateProfileService
