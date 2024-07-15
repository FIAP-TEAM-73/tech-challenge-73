import type PaymentStatus from '../../src/entities/PaymentStatus'
import Payment from '../../src/entities/Payment'
const mockPaymentStatus: PaymentStatus[] = [
  {
    id: 'any_id',
    status: 'AWAITING_PAYMENT'
  },
  {
    id: 'any_id',
    status: 'PAYMENT_ACCEPTED'
  }
]

describe('Payment', () => {
  it('Should create a Payment when all attributes are valids', () => {
    expect(
      () => new Payment('any_id', 'any_order_id', 85.90, mockPaymentStatus, 'any_qr_code', 'any_integration_id')
    ).not.toThrow(new Error(''))
  })
})
