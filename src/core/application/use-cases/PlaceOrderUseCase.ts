import Order from '../../domain/entities/Order'
import OrderItem from '../../domain/entities/OrderItem'
import type IOrderRepository from '../../domain/repositories/IOrderRepository'
import { CPF } from '../../domain/value-objects/Cpf'
import { ok, type HttpResponse } from '../api/HttpResponses'
import { v4 as uuidv4 } from 'uuid'
import type EventHandler from '../handlers/EventHandler'
import OrderPlaced from '../../domain/event/OrderPlaced'

interface OrderItemCommand {
  idItem: string
  price: number
  quantity: number
}
export interface PlaceOrderCommand {
  tableNumber: number
  orderItems: OrderItemCommand[]
  cpf: string | null
}

export default class PlaceOrderUseCase {
  constructor (private readonly repository: IOrderRepository, private readonly eventHandler: EventHandler) {}

  async execute (orderCommand: PlaceOrderCommand): Promise<HttpResponse> {
    const { tableNumber, orderItems, cpf } = orderCommand
    const orderId = uuidv4()
    const order = new Order(orderId, tableNumber, 'CREATED', this.mapOrderItems(orderId, orderItems), cpf !== null ? new CPF(cpf) : undefined)
    const result = await this.repository.save(order)
    await this.eventHandler.publish(new OrderPlaced(result))
    return ok({ orderId: result })
  }

  private mapOrderItems (orderId: string, orderItemsCommand: OrderItemCommand[]): OrderItem[] {
    return orderItemsCommand.map(({ idItem, price, quantity }) => new OrderItem(idItem, orderId, price, quantity))
  }
}
