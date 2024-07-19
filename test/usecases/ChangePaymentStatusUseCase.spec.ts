import type Payment from '../../src/entities/Payment'
import type PaymentStatus from '../../src/entities/PaymentStatus'
import { type IPaymentGateway } from '../../src/interfaces/IPaymentGateway'
import { noContent, notFoundError } from '../../src/presenters/HttpResponses'
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
  let mockPaymentGateway: IPaymentGateway
  beforeEach(() => {
    mockPaymentGateway = {
      save: jest.fn().mockResolvedValueOnce('payment_id'),
      findById: jest.fn().mockResolvedValueOnce(mockPayment)
    }
  })
  it('Should save a payment when the information is correct', async () => {
    const sut = new ChangePaymentStatusUseCase(mockPaymentGateway)
    const result = await sut.execute({ issueId: 'any_payment_id', status: 'approved' })
    expect(result).toEqual(noContent())
  })
  it('Should not save when payment does not exist', async () => {
    const mockNotFound: IPaymentGateway = {
      ...mockPaymentGateway,
      findById: jest.fn().mockResolvedValueOnce(undefined)
    }
    const sut = new ChangePaymentStatusUseCase(mockNotFound)
    const result = await sut.execute({ issueId: 'wrong_id', status: 'approved' })
    expect(result).toEqual(notFoundError('Payment with ID wrong_id does not exist'))
  })
  it('Should throws when status is not mapped', async () => {
    const sut = new ChangePaymentStatusUseCase(mockPaymentGateway)
    const result = sut.execute({ issueId: 'any_payment_id', status: 'not_mapped' })
    await expect(result).rejects.toEqual(new Error('Status \'undefined\' does not exist'))
  })
})
