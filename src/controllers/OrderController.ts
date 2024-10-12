import type EventHandler from '../handlers/EventHandler'
import { type OrderPageParams } from '../interfaces/IOrderGateway'
import type IGatewayFactory from '../interfaces/IGatewayFactory'
import { type HttpResponse } from '../presenters/HttpResponses'
import { FindOrderUseCase } from '../usecases/FindOrderUseCase'
import PlaceOrderUseCase, { type PlaceOrderCommand } from '../usecases/PlaceOrderUseCase'
import { FindPaymentByOrderIdUseCase } from '../usecases/FindPaymentByOrderIdUseCase'
import ChangeOrderStatusUseCase, { type ChangeOrderStatusCommand } from '../usecases/ChangeOrderStatusUseCase'
import ChangeOrderItemsUseCase, { type ChangeOrderItemsCommand } from '../usecases/ChangeOrderItemsUseCase'

export default class OrderController {
  private readonly placeOrderUseCase: PlaceOrderUseCase
  private readonly changeOrderStatusUseCase: ChangeOrderStatusUseCase
  private readonly findOrderUseCase: FindOrderUseCase
  private readonly findPaymentByOrderIdUseCase: FindPaymentByOrderIdUseCase
  private readonly changeOrderItemsUseCase: ChangeOrderItemsUseCase

  constructor (factory: IGatewayFactory, eventHandler: EventHandler) {
    const orderGateway = factory.createOrderGateway()
    const paymentGateway = factory.createPaymentGateway()
    this.placeOrderUseCase = new PlaceOrderUseCase(orderGateway, eventHandler)
    this.changeOrderStatusUseCase = new ChangeOrderStatusUseCase(orderGateway)
    this.findOrderUseCase = new FindOrderUseCase(orderGateway)
    this.findPaymentByOrderIdUseCase = new FindPaymentByOrderIdUseCase(paymentGateway)
    this.changeOrderItemsUseCase = new ChangeOrderItemsUseCase(orderGateway, eventHandler)
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

  async findPaymentByOrderId (orderId: string): Promise<HttpResponse> {
    return await this.findPaymentByOrderIdUseCase.execute(orderId)
  }

  async changeOrderItems (orderId: string, command: ChangeOrderItemsCommand): Promise<HttpResponse> {
    return await this.changeOrderItemsUseCase.execute(orderId, command)
  }
}
