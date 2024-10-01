import type DomainEvent from './DomainEvent'

export default class OrderUpdated implements DomainEvent<string> {
  name: string = 'orderUpdated'
  constructor (readonly value: string) {}
}
