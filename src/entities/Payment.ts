import type PaymentStatus from './PaymentStatus'

export default class Payment {
  constructor (
    readonly id: string,
    readonly orderId: string,
    readonly value: number,
    readonly statuses: PaymentStatus[],
    readonly qrCode: string,
    readonly integrationId: string
  ) {}
}
