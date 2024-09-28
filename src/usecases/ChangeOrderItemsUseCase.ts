import OrderItem from '../entities/OrderItem'
import type IOrderGateway from '../interfaces/IOrderGateway'
import { type HttpResponse, noContent, notFoundError } from '../presenters/HttpResponses'

interface OrderItemCommand {
  idItem: string
  price: number
  quantity: number
}

export interface ChangeOrderItemsCommand {
  orderItems: OrderItemCommand[]
}

export default class ChangeOrderItemsUseCase {
  constructor (private readonly orderGateway: IOrderGateway) {}

  async execute (orderId: string, command: ChangeOrderItemsCommand): Promise<HttpResponse> {
    const { orderItems } = command
    const order = await this.orderGateway.checkOrderItemsIfExists(orderId)
    if (order === undefined || !order) return notFoundError(`Order ${orderId} does not exist!`)
    await this.orderGateway.removeAndInsertAllOrderItems(orderId, this.mapOrderItems(orderId, orderItems))
    return noContent()
  }

  private mapOrderItems (orderId: string, orderItemCommand: OrderItemCommand[]): OrderItem[] {
    return orderItemCommand.map(({ idItem, price, quantity }) => new OrderItem(idItem, orderId, price, quantity))
  }
}
