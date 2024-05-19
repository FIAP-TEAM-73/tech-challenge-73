import { type CPF } from '../value-objects/Cpf'
import type OrderItem from './OrderItem'

export default class Order {
  constructor (
    readonly id: string,
    readonly tableNumber: number,
    readonly status: string,
    readonly orderItems: OrderItem[],
    readonly cpf: CPF | undefined
  ) {}

  getTotal (): number {
    return this.orderItems.reduce((acc: number, curr: OrderItem): number => {
      return acc + curr.calculateTotal()
    }, 0)
  }
}
