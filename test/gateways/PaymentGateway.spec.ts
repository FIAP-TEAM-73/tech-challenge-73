import { type IPaymentGateway } from '../../src/interfaces/IPaymentGateway'
import type IConnection from '../../src/interfaces/IConnection'
import type PaymentStatus from '../../src/entities/PaymentStatus'
import type Payment from '../../src/entities/Payment'
import PaymentGateway from '../../src/gateways/PaymentGateway'

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

describe('PaymentGateway', () => {
  const mockConnection: IConnection = {
    isAlive: async () => await Promise.resolve(true),
    close: async () => { },
    connect: async () => { },
    query: async (stmt: string, params: any[]) => {
      console.log({ stmt, params })
      return await Promise.resolve({
        rows: [
          {
            id: 'any_payment_id',
            order_id: 'any_order_id',
            value: 85.99,
            payment_status_id: 'any_status_id',
            status: 'AWAITING_PAYMENT',
            integration_id: 'any_integration_id',
            qr_code: '0001'
          }
        ]
      })
    }
  }
  it('Should save and Payment with success', async () => {
    const sut: IPaymentGateway = new PaymentGateway(mockConnection)
    const result = await sut.save(mockPayment)
    expect(result).toBe('any_payment_id')
  })
})
