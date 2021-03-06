import { getRepository, Not, Repository } from 'typeorm'
import User from '@modules/users/infra/typeorm/entities/User'
import IUsersRepository from '@modules/users/interfaces/IUsersRepository'
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO'
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO'

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>

  constructor() {
    this.ormRepository = getRepository(User)
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id)

    return user
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { email } })

    return user
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(userData)
    await this.ormRepository.save(user)

    return user
  }

  public async update(user: User): Promise<User> {
    const userUpdated = await this.ormRepository.save(user)
    return userUpdated
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let users = []

    if (except_user_id) {
      users = await this.ormRepository.find({
        where: {
          id: Not(except_user_id),
        },
      })
    } else {
      users = await this.ormRepository.find()
    }

    return users
  }
}

export default UsersRepository
