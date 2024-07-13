import type DomainEvent from '../event/DomainEvent'

export default interface IHandler {
  name: string
  handle: <T>(event: DomainEvent<T>) => Promise<void>
}
