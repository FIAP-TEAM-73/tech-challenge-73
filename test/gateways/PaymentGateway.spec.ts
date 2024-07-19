import { type IPaymentGateway } from '../../src/interfaces/IPaymentGateway'
import type IConnection from '../../src/interfaces/IConnection'
import type PaymentStatus from '../../src/entities/PaymentStatus'
import Payment from '../../src/entities/Payment'
import PaymentGateway from '../../src/gateways/PaymentGateway'

const mockPaymentStatus: PaymentStatus[] = [
  {
    id: 'any_status_id',
    status: 'AWAITING_PAYMENT'
  }
]

const mockPayment = new Payment('any_payment_id', 'any_order_id', 85.99, mockPaymentStatus, '0001', 'any_integration_id')

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
  describe('Save a payment', () => {
    it('Should save and Payment with success', async () => {
      const sut: IPaymentGateway = new PaymentGateway(mockConnection)
      const result = await sut.save(mockPayment)
      expect(result).toBe('any_payment_id')
    })
    it('Should throw an error when Connection throws', async () => {
      const mockConnectionReject = {
        ...mockConnection,
        query: jest.fn(async (stmt: string, params: any[]) => {
          console.log({ stmt, params })
          return await Promise.reject(new Error('Generec gateway erro!'))
        })
      }
      const sut: IPaymentGateway = new PaymentGateway(mockConnectionReject)
      const result = sut.save(mockPayment)
      await expect(result).rejects.toEqual(new Error('Generec gateway erro!'))
    })
  })
  describe('Find a payment', () => {
    it('Should return a Payment by id when it exists', async () => {
      const sut = new PaymentGateway(mockConnection)
      const result = await sut.findById('any_payment_id')
      expect(result).toEqual(mockPayment)
    })
    it('Should return undefined when it does not exist', async () => {
      const notFoundConnection: IConnection = {
        ...mockConnection,
        query: async (stmt: string, params: any[]) => {
          console.log({ stmt, params })
          return await Promise.resolve({
            rows: []
          })
        }
      }
      const sut = new PaymentGateway(notFoundConnection)
      const result = await sut.findById('any_payment_id')
      expect(result).toBeUndefined()
    })
    it('Should throw an error when Connection throws', async () => {
      const mockConnectionReject = {
        ...mockConnection,
        query: jest.fn(async (stmt: string, params: any[]) => {
          console.log({ stmt, params })
          return await Promise.reject(new Error('Generec gateway erro!'))
        })
      }
      const sut: IPaymentGateway = new PaymentGateway(mockConnectionReject)
      const result = sut.findById('any_payment_id')
      await expect(result).rejects.toEqual(new Error('Generec gateway erro!'))
    })
  })
})
