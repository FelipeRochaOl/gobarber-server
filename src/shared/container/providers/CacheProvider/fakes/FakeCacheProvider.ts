import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

interface ICacheData {
  [key: string]: string
}

export default class FakeCacheProvider implements ICacheProvider {
  private cache: ICacheData = {}

  public async save<Interface>(key: string, value: Interface): Promise<void> {
    this.cache[key] = JSON.stringify(value)
  }

  public async recover<Interface>(key: string): Promise<Interface | null> {
    const data = this.cache[key]

    if (!data) {
      return null
    }

    const parsedDate = JSON.parse(data) as Interface

    return parsedDate
  }

  public async invalidate(key: string): Promise<void> {
    delete this.cache[key]
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = Object.keys(this.cache).filter(key =>
      key.startsWith(`${prefix}:`),
    )

    keys.forEach(key => delete this.cache[key])
  }
}
