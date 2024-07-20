import type EventHandler from '../handlers/EventHandler'
import type IGatewayFactory from '../interfaces/IGatewayFactory'
import { type HttpResponse } from '../presenters/HttpResponses'
import { type ChangePaymentStatusCommand, ChangePaymentStatusUseCase } from '../usecases/ChangePaymentStatusUseCase'
import { FindPaymentByIdUseCase } from '../usecases/FindPaymentByIdUseCase'

export default class PaymentController {
  private readonly changePaymentStatusUseCase: ChangePaymentStatusUseCase
  private readonly findPaymentByIdUseCase: FindPaymentByIdUseCase

  constructor (factory: IGatewayFactory, eventHandler: EventHandler) {
    const paymentGateway = factory.createPaymentGateway()
    this.changePaymentStatusUseCase = new ChangePaymentStatusUseCase(paymentGateway, eventHandler)
    this.findPaymentByIdUseCase = new FindPaymentByIdUseCase(paymentGateway)
  }

  async save (command: ChangePaymentStatusCommand): Promise<HttpResponse> {
    return await this.changePaymentStatusUseCase.execute(command)
  }

  async findById (id: string): Promise<HttpResponse> {
    return await this.findPaymentByIdUseCase.execute(id)
  }
}
