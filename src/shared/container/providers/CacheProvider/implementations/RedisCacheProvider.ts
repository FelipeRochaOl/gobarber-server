import Redis, { Redis as RedisClient } from 'ioredis'
import cacheConfig from '@config/cache'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

export default class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient

  constructor() {
    this.client = new Redis(cacheConfig.config.redis)
  }

  public async save<Interface>(key: string, value: Interface): Promise<void> {
    await this.client.set(key, JSON.stringify(value))
  }

  public async recover<Interface>(key: string): Promise<Interface | null> {
    const data = await this.client.get(key)

    if (!data) {
      return null
    }

    const parsedDate = JSON.parse(data) as Interface

    return parsedDate
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key)
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`)

    const pipeline = this.client.pipeline()

    keys.forEach(key => pipeline.del(key))

    await pipeline.exec()
  }
}
