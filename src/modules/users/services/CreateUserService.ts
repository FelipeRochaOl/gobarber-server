import User from '@modules/users/infra/typeorm/entities/User'

import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import IUsersRepository from '../interfaces/IUsersRepository'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'

interface IRequest {
  name: string
  email: string
  password: string
}

@injectable()
class CreateUserService {
  private usersRepository: IUsersRepository

  private hashProvider: IHashProvider

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,
    hashProvider: IHashProvider,
  ) {
    this.usersRepository = usersRepository
    this.hashProvider = hashProvider
  }

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email)

    if (checkUserExists) {
      throw new AppError('Email address alread used.')
    }

    const hashedPassword = await this.hashProvider.generateHash(password)
    const newUser = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    })

    return newUser
  }
}

export default CreateUserService
