import { inject, injectable } from 'tsyringe'
import IUsersRepository from '@modules/users/interfaces/IUsersRepository'
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'
import AppError from '@shared/errors/AppError'
import IUserTokensRepository from '@modules/users/interfaces/IUserTokensRepository'

interface IRequest {
  email: string
}

@injectable()
class SendForgotPasswordEmailService {
  private usersRepository: IUsersRepository

  private mailProvider: IMailProvider

  private userTokensRepository: IUserTokensRepository

  constructor(
    @inject('UsersRepository')
    usersRepository: IUsersRepository,

    @inject('MailProvider')
    mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    userTokensRepository: IUserTokensRepository,
  ) {
    this.usersRepository = usersRepository
    this.mailProvider = mailProvider
    this.userTokensRepository = userTokensRepository
  }

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError('User does not exists.')
    }

    const { token } = await this.userTokensRepository.generate(user.id)

    await this.mailProvider.sendMail(
      email,
      `Pedido de recuperação de senha recebido, ${token}`,
    )
  }
}

export default SendForgotPasswordEmailService
