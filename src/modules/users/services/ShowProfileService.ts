import { inject, injectable } from 'tsyringe'

import User from '@modules/users/infra/typeorm/entities/User'

import AppError from '@shared/errors/AppError'
import IUsersRepository from '@modules/users/interfaces/IUsersRepository'

interface IRequest {
  user_id: string
}

@injectable()
class ShowProfileService {
  private usersRepository: IUsersRepository

  constructor(@inject('UsersRepository') usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository
  }

  public async execute({ user_id }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('User not found')
    }

    return user
  }
}

export default ShowProfileService
