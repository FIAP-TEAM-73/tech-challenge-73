import type DomainEvent from '../events/DomainEvent'

export default interface IHandler {
  handle: <T>(event: DomainEvent<T>) => Promise<void>
}
