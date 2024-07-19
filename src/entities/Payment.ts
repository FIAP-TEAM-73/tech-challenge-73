import { assertArgumentMin } from './base/AssertionConcerns'
import type PaymentStatus from './PaymentStatus'

export default class Payment {
  constructor (
    readonly id: string,
    readonly orderId: string,
    readonly value: number,
    readonly statuses: PaymentStatus[],
    readonly qrCode: string,
    readonly integrationId: string
  ) {
    assertArgumentMin(value, 0, 'Value must be greater than 0')
  }

  isApproved (): boolean {
    return this.statuses.some(status => status.status === 'PAYMENT_ACCEPTED')
  }
}
