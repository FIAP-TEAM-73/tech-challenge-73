import type EventHandler from '../handlers/EventHandler'
import type IGatewayFactory from '../interfaces/IGatewayFactory'
import { type HttpResponse } from '../presenters/HttpResponses'
import { type ChangePaymentStatusCommand, ChangePaymentStatusUseCase } from '../usecases/ChangePaymentStatusUseCase'

export default class PaymentController {
  private readonly changePaymentStatusUseCase: ChangePaymentStatusUseCase

  constructor (factory: IGatewayFactory, eventHandler: EventHandler) {
    const paymentGateway = factory.createPaymentGateway()
    this.changePaymentStatusUseCase = new ChangePaymentStatusUseCase(paymentGateway, eventHandler)
  }

  async save (command: ChangePaymentStatusCommand): Promise<HttpResponse> {
    return await this.changePaymentStatusUseCase.execute(command)
  }
}
