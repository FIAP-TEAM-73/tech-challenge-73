import type Payment from '../../src/entities/Payment'
import type PaymentStatus from '../../src/entities/PaymentStatus'
import { type IPaymentGateway } from '../../src/interfaces/IPaymentGateway'
import { ok } from '../../src/presenters/HttpResponses'
import { FindPaymentByIdUseCase } from '../../src/usecases/FindPaymentByIdUseCase'

const mockPaymentStatus: PaymentStatus[] = [
  {
    id: 'any_status_id',
    status: 'AWAITING_PAYMENT'
  }
]

const mockPayment: Payment = {
  id: 'any_payment_id',
  orderId: 'any_order_id',
  value: 85.99,
  statuses: mockPaymentStatus,
  integrationId: 'any_integration_id',
  qrCode: '0001'
}

describe('Find a payment by id use case', () => {
  const mockPaymentGateway: IPaymentGateway = {
    save: jest.fn().mockResolvedValueOnce('payment_id'),
    findById: jest.fn().mockResolvedValueOnce(mockPayment)
  }
  it('Should return a payment when it exists', async () => {
    const sut = new FindPaymentByIdUseCase(mockPaymentGateway)
    const result = await sut.execute('any_payment_id')
    expect(result).toEqual(ok(
      {
        id: 'any_payment_id',
        value: 85.99,
        status: 'AWAITING_PAYMENT'
      }
    ))
  })
})
