import PaymentStatus, { type PaymentStatuses } from '../entities/PaymentStatus'
import { type IPaymentGateway } from '../interfaces/IPaymentGateway'
import { type HttpResponse, noContent, notFoundError } from '../presenters/HttpResponses'
import { v4 as uuidv4 } from 'uuid'

export interface ChangePaymentStatusCommand {
  issueId: string
  status: 'approved' | 'rejected' | string
}

const statusMapper: Record<'approved' | 'rejected' | string, PaymentStatuses> = {
  approved: 'PAYMENT_ACCEPTED',
  rejected: 'PAYMENT_REFUSED'
}

export class ChangePaymentStatusUseCase {
  constructor (private readonly paymentGateway: IPaymentGateway) { }

  async execute (command: ChangePaymentStatusCommand): Promise<HttpResponse> {
    const payment = await this.paymentGateway.findById(command.issueId)
    if (payment === undefined) return notFoundError(`Payment with ID ${command.issueId} does not exist`)
    const paymentStatus = new PaymentStatus(uuidv4(), statusMapper[command.status])
    await this.paymentGateway.save({ ...payment, statuses: [...payment.statuses, paymentStatus] })
    return noContent()
  }
}
