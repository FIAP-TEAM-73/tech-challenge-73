import Order from '../../domain/entities/Order'
import OrderItem from '../../domain/entities/OrderItem'
import type IOrderRepository from '../../domain/repositories/IOrderRepository'
import { CPF } from '../../domain/value-objects/Cpf'
import { ok, type HttpResponse } from '../api/HttpResponses'

interface OrderItemCommand {
  idItem: string
  price: number
  quantity: number
}
interface PlaceOrderCommand {
  tableNumber: number
  orderItems: OrderItemCommand[]
  cpf: string | undefined
}

export default class PlaceOrderUseCase {
  constructor (private readonly repository: IOrderRepository) {}

  async execute (orderCommand: PlaceOrderCommand): Promise<HttpResponse> {
    const { tableNumber, orderItems, cpf } = orderCommand
    const orderId = 'any_id'
    const order = new Order(orderId, tableNumber, 'CREATED', this.mapOrderItems(orderId, orderItems), cpf !== undefined ? new CPF(cpf) : undefined)
    const result = await this.repository.save(order)
    return ok({ orderId: result })
  }

  private mapOrderItems (orderId: string, orderItemsCommand: OrderItemCommand[]): OrderItem[] {
    return orderItemsCommand.map(({ idItem, price, quantity }) => new OrderItem(idItem, orderId, price, quantity))
  }
}
