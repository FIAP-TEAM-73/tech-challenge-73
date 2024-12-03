import { type OrderStatus } from '../entities/Order'
import type IOrderGateway from '../interfaces/IOrderGateway'
import { type HttpResponse, noContent } from '../presenters/HttpResponses'

export interface ChangeOrderStatusCommand {
  status: OrderStatus
}
export default class ChangeOrderStatusUseCase {
  constructor (private readonly orderGateway: IOrderGateway) {}

  async execute (orderId: string, command: ChangeOrderStatusCommand): Promise<HttpResponse> {
    await this.orderGateway.updateStatus(orderId, command.status)
    return noContent()
  }
}
