const status = ['AWAITING_PAYMENT', 'PAYMENT_ACCEPTED', 'PAYMENT_REFUSED'] as const
export type PaymentStatuses = (typeof status)[number]

export default class PaymentStatus {
  constructor (readonly id: string, readonly status: PaymentStatuses) {}
}
