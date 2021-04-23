import User from '@modules/users/infra/typeorm/entities/User'

import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

import IUsersRepository from '@modules/users/interfaces/IUsersRepository'
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

interface IRequest {
  name: string
  email: string
  password: string
}

@injectable()
class CreateUserService {
  private usersRepository: IUsersRepository

  private hashProvider: IHashProvider

  private cacheProvider: ICacheProvider

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,

    @inject('HashProvider')
    hashProvider: IHashProvider,

    @inject('CacheProvider')
    cacheProvider: ICacheProvider,
  ) {
    this.usersRepository = usersRepository
    this.hashProvider = hashProvider
    this.cacheProvider = cacheProvider
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

    await this.cacheProvider.invalidatePrefix('providers-list')

    return newUser
  }
}

export default CreateUserService
