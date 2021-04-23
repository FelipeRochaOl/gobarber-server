export default interface ICacheProvider {
  save<Interface>(key: string, value: Interface): Promise<void>
  recover<Interface>(key: string): Promise<Interface | null>
  invalidate(key: string): Promise<void>
  invalidatePrefix(key: string): Promise<void>
}
