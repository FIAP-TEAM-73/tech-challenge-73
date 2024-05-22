import { type HttpResponse } from '../../../../../core/application/api/HttpResponses'
import type EventHandler from '../../../../../core/application/handlers/EventHandler'
import ChangeOrderStatusUseCase, { type ChangeOrderStatusCommand } from '../../../../../core/application/use-cases/ChangeOrderStatusUseCase'
import PlaceOrderUseCase, { type PlaceOrderCommand } from '../../../../../core/application/use-cases/PlaceOrderUseCase'
import type IRepositoryFactory from '../../../../../core/domain/factories/IRepositoryFactory'

export default class OrderController {
  private readonly placeOrderUseCase: PlaceOrderUseCase
  private readonly changeOrderStatusUseCase: ChangeOrderStatusUseCase
  constructor (factory: IRepositoryFactory, eventHandler: EventHandler) {
    const orderRepository = factory.createOrderRepository()
    this.placeOrderUseCase = new PlaceOrderUseCase(orderRepository, eventHandler)
    this.changeOrderStatusUseCase = new ChangeOrderStatusUseCase(orderRepository)
  }

  async placeOrder (command: PlaceOrderCommand): Promise<HttpResponse> {
    return await this.placeOrderUseCase.execute(command)
  }

  async changeOrderStatus (orderId: string, command: ChangeOrderStatusCommand): Promise<HttpResponse> {
    return await this.changeOrderStatusUseCase.execute(orderId, command)
  }
}
