import type Payment from '../../src/entities/Payment'
import type PaymentStatus from '../../src/entities/PaymentStatus'
import { type IPaymentGateway } from '../../src/interfaces/IPaymentGateway'
import { noContent } from '../../src/presenters/HttpResponses'
import { ChangePaymentStatusUseCase } from '../../src/usecases/ChangePaymentStatusUseCase'
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
describe('Save payment use case', () => {
  const mockPaymentGateway: IPaymentGateway = {
    save: jest.fn().mockResolvedValueOnce('payment_id'),
    findById: jest.fn().mockResolvedValueOnce(mockPayment)
  }
  it('Should save a payment when the information is correct', async () => {
    const sut = new ChangePaymentStatusUseCase(mockPaymentGateway)
    const result = await sut.execute({ issueId: 'any_payment_id', status: 'approved' })
    expect(result).toEqual(noContent())
  })
})
