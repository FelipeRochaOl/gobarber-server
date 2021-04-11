import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import User from '@modules/users/infra/typeorm/entities/User'
import authConfig from '@config/auth'

import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'
import IUsersRepository from '../interfaces/IUsersRepository'

interface IRequest {
  email: string
  password: string
}

interface IResponse {
  user: User
  token: string
}

@injectable()
class AuthenticateUserService {
  private usersRepository: IUsersRepository

  constructor(@inject('UsersRepository') usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository
  }

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError('Incorrect email or password', 401)
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new AppError('Incorrect email or password', 401)
    }

    const { secret, expiresIn } = authConfig.jwt
    const token = sign({}, secret, { subject: user.id, expiresIn })
    return {
      user,
      token,
    }
  }
}

export default AuthenticateUserService
