import Payment from '../entities/Payment'
import PaymentStatus, { type PaymentStatuses } from '../entities/PaymentStatus'
import type EventHandler from '../handlers/EventHandler'
import { type IPaymentGateway } from '../interfaces/IPaymentGateway'
import { badRequest, type HttpResponse, noContent, notFoundError } from '../presenters/HttpResponses'
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
  constructor (private readonly paymentGateway: IPaymentGateway, private readonly eventHandler: EventHandler) { }

  async execute ({ issueId, status }: ChangePaymentStatusCommand): Promise<HttpResponse> {
    const payment = await this.paymentGateway.findById(issueId)
    if (payment === undefined) return notFoundError(`Payment with ID ${issueId} does not exist`)
    if (payment.isApproved()) return badRequest(`Payment with ID ${issueId} is already approved`)
    const paymentStatus = new PaymentStatus(uuidv4(), statusMapper[status])
    const newPayment = new Payment(payment.id, payment.orderId, payment.value, [...payment.statuses, paymentStatus], payment.qrCode, payment.integrationId)
    await this.paymentGateway.save(newPayment)
    return noContent()
  }
}
