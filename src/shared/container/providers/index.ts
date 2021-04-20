import { container } from 'tsyringe'
import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider'
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'
import EtherealMailProvider from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider'

import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider'
import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider'

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
)

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider,
)

container.registerInstance<IMailProvider>(
  'MailProvider',
  container.resolve(EtherealMailProvider),
)
