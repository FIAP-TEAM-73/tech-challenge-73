import { assertArgumentMinArrayLength } from '../base/AssertionConcerns'
import { type CPF } from '../value-objects/Cpf'
import type OrderItem from './OrderItem'

export default class Order {
  constructor (
    readonly id: string,
    readonly tableNumber: number,
    readonly status: string,
    readonly orderItems: OrderItem[],
    readonly cpf: CPF | undefined
  ) {
    assertArgumentMinArrayLength(orderItems, 1, 'Order must have at least 1 item')
  }

  getTotal (): number {
    return this.orderItems.reduce((acc: number, curr: OrderItem): number => {
      return acc + curr.calculateTotal()
    }, 0)
  }

  updateStatus (status: string): Order {
    return {
      ...this,
      status
    }
  }
}
