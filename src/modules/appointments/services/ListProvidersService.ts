import { inject, injectable } from 'tsyringe'
import { classToClass } from 'class-transformer'

import User from '@modules/users/infra/typeorm/entities/User'

import IUsersRepository from '@modules/users/interfaces/IUsersRepository'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

interface IRequest {
  user_id: string
}

@injectable()
class ListProvidersService {
  private usersRepository: IUsersRepository

  private cacheProvider: ICacheProvider

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,

    @inject('CacheProvider')
    cacheProvider: ICacheProvider,
  ) {
    this.usersRepository = usersRepository
    this.cacheProvider = cacheProvider
  }

  public async execute({ user_id }: IRequest): Promise<User[]> {
    let providers = await this.cacheProvider.recover<User[]>(
      `providers-list:${user_id}`,
    )

    if (!providers) {
      providers = await this.usersRepository.findAllProviders({
        except_user_id: user_id,
      })
    }

    await this.cacheProvider.save<User[]>(
      `providers-list:${user_id}`,
      classToClass(providers),
    )

    return providers
  }
}

export default ListProvidersService
