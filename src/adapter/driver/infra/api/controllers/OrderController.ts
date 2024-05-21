import { type HttpResponse } from '../../../../../core/application/api/HttpResponses'
import type EventHandler from '../../../../../core/application/handlers/EventHandler'
import PlaceOrderUseCase, { type PlaceOrderCommand } from '../../../../../core/application/use-cases/PlaceOrderUseCase'
import type IRepositoryFactory from '../../../../../core/domain/factories/IRepositoryFactory'

export default class OrderController {
  private readonly placeOrderUseCase: PlaceOrderUseCase
  constructor (factory: IRepositoryFactory, eventHandler: EventHandler) {
    this.placeOrderUseCase = new PlaceOrderUseCase(factory.createOrderRepository(), eventHandler)
  }

  async placeOrder (command: PlaceOrderCommand): Promise<HttpResponse> {
    return await this.placeOrderUseCase.execute(command)
  }
}
