import OrderItem from '../entities/OrderItem'
import OrderUpdated from '../events/OrderUpdated'
import type EventHandler from '../handlers/EventHandler'
import type IOrderGateway from '../interfaces/IOrderGateway'
import { badRequest, type HttpResponse, notFoundError, ok } from '../presenters/HttpResponses'

interface OrderItemCommand {
  idItem: string
  price: number
  quantity: number
}

export interface ChangeOrderItemsCommand {
  orderItems: OrderItemCommand[]
}

export default class ChangeOrderItemsUseCase {
  constructor (private readonly orderGateway: IOrderGateway, private readonly eventHandler: EventHandler) {}

  async execute (orderId: string, command: ChangeOrderItemsCommand): Promise<HttpResponse> {
    const { orderItems } = command
    const order = await this.orderGateway.checkOrderItemsIfValid(orderId)
    if (order === undefined) return notFoundError(`Order ${orderId} does not exist!`)
    else if (!order) return badRequest(`Order ${orderId} is not valid to change! Please cancel order or contact us`)
    const result = await this.orderGateway.removeAndInsertAllOrderItems(orderId, this.mapOrderItems(orderId, orderItems))
    await this.eventHandler.publish(new OrderUpdated(result))
    return ok({ orderId: result })
  }

  private mapOrderItems (orderId: string, orderItemCommand: OrderItemCommand[]): OrderItem[] {
    return orderItemCommand.map(({ idItem, price, quantity }) => new OrderItem(idItem, orderId, price, quantity))
  }
}
