import type DomainEvent from './DomainEvent'

export default class OrderPlaced implements DomainEvent<string> {
  name: string = 'OrderPlaced'
  constructor (readonly value: string) {}
}
