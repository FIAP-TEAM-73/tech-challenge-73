import type DomainEvent from '../../domain/event/DomainEvent'

export default interface Handler {
  name: string
  handle: <T>(event: DomainEvent<T>) => Promise<void>
}
