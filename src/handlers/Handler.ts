import type DomainEvent from '../event/DomainEvent'

export default interface Handler {
  name: string
  handle: <T>(event: DomainEvent<T>) => Promise<void>
}
