import type EventHandler from '../handlers/EventHandler'
import { type OrderPageParams } from '../interfaces/IOrderGateway'
import type IGatewayFactory from '../interfaces/IGatewayFactory'
import { type HttpResponse } from '../presenter/HttpResponses'
import ChangeOrderStatusUseCase, { type ChangeOrderStatusCommand } from '../use-cases/ChangeOrderStatusUseCase'
import { FindOrderUseCase } from '../use-cases/FindOrderUseCase'
import PlaceOrderUseCase, { type PlaceOrderCommand } from '../use-cases/PlaceOrderUseCase'

export default class OrderController {
  private readonly placeOrderUseCase: PlaceOrderUseCase
  private readonly changeOrderStatusUseCase: ChangeOrderStatusUseCase
  private readonly findOrderUseCase: FindOrderUseCase

  constructor (factory: IGatewayFactory, eventHandler: EventHandler) {
    const orderRepository = factory.createOrderRepository()
    this.placeOrderUseCase = new PlaceOrderUseCase(orderRepository, eventHandler)
    this.changeOrderStatusUseCase = new ChangeOrderStatusUseCase(orderRepository)
    this.findOrderUseCase = new FindOrderUseCase(orderRepository)
  }

  async placeOrder (command: PlaceOrderCommand): Promise<HttpResponse> {
    return await this.placeOrderUseCase.execute(command)
  }

  async changeOrderStatus (orderId: string, command: ChangeOrderStatusCommand): Promise<HttpResponse> {
    return await this.changeOrderStatusUseCase.execute(orderId, command)
  }

  async findOrder (params: OrderPageParams): Promise<HttpResponse> {
    return await this.findOrderUseCase.execute(params)
  }
}
