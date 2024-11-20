import { type OrderPageParams } from '../interfaces/IOrderGateway'
import type IGatewayFactory from '../interfaces/IGatewayFactory'
import { type HttpResponse } from '../presenters/HttpResponses'
import ChangeOrderStatusUseCase, { type ChangeOrderStatusCommand } from '../usecases/ChangeOrderStatusUseCase'
import { FindOrderUseCase } from '../usecases/FindOrderUseCase'

export default class OrderController {
  private readonly changeOrderStatusUseCase: ChangeOrderStatusUseCase
  private readonly findOrderUseCase: FindOrderUseCase

  constructor (factory: IGatewayFactory) {
    const orderGateway = factory.createOrderGateway()
    this.changeOrderStatusUseCase = new ChangeOrderStatusUseCase(orderGateway)
    this.findOrderUseCase = new FindOrderUseCase(orderGateway)
  }

  async changeOrderStatus (orderId: string, command: ChangeOrderStatusCommand): Promise<HttpResponse> {
    return await this.changeOrderStatusUseCase.execute(orderId, command)
  }

  async findOrder (params: OrderPageParams): Promise<HttpResponse> {
    return await this.findOrderUseCase.execute(params)
  }
}
