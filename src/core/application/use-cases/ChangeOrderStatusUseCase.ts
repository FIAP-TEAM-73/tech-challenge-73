import { type OrderStatus } from '../../domain/entities/Order'
import type IOrderRepository from '../../domain/repositories/IOrderRepository'
import { type HttpResponse, noContent, notFoundError } from '../api/HttpResponses'

export interface ChangeOrderStatusCommand {
  status: OrderStatus
}
export default class ChangeOrderStatusUseCase {
  constructor (private readonly orderRepository: IOrderRepository) {}

  async execute (orderId: string, command: ChangeOrderStatusCommand): Promise<HttpResponse> {
    const order = await this.orderRepository.findById(orderId)
    if (order === undefined) return notFoundError(`Order ${orderId} does not exist!`)
    await this.orderRepository.save(order.updateStatus(command.status))
    return noContent()
  }
}
