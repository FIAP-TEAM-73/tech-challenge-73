import { type IPaymentGateway } from '../interfaces/IPaymentGateway'
import { notFoundError, ok, type HttpResponse } from '../presenters/HttpResponses'

export class FindPaymentByIdUseCase {
  constructor (private readonly paymentGateway: IPaymentGateway) {}
  async execute (id: string): Promise<HttpResponse> {
    const payment = await this.paymentGateway.findById(id)
    if (payment === undefined) return notFoundError(`Payment with ID ${id} does not exist`)
    return ok(
      {
        id: payment.id,
        value: payment.value,
        status: payment.statuses[0].status
      }
    )
  }
}
