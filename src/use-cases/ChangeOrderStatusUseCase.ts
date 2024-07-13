import { type OrderStatus } from '../entities/Order'
import type IOrderGateway from '../interfaces/IOrderGateway'
import { type HttpResponse, noContent, notFoundError } from '../presenter/HttpResponses'

export interface ChangeOrderStatusCommand {
  status: OrderStatus
}
export default class ChangeOrderStatusUseCase {
  constructor (private readonly orderRepository: IOrderGateway) {}

  async execute (orderId: string, command: ChangeOrderStatusCommand): Promise<HttpResponse> {
    const order = await this.orderRepository.findById(orderId)
    if (order === undefined) return notFoundError(`Order ${orderId} does not exist!`)
    await this.orderRepository.save(order.updateStatus(command.status))
    return noContent()
  }
}
