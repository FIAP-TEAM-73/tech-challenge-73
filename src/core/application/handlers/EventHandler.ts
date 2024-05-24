import type DomainEvent from '../../domain/event/DomainEvent'
import type Handler from './Handler'

export default class EventHandler {
  constructor (private readonly handlers: Handler[]) {}

  async publish<T> (event: DomainEvent<T>): Promise<void> {
    await Promise.all(this.handlers.map(async (handler) => {
      if (handler.name === event.name) {
        await handler.handle(event)
      }
    }))
  }
}
