import Order from '../../src/entities/Order'
import OrderItem from '../../src/entities/OrderItem'
import PaymentRejected from '../../src/events/PaymentRejected'
import CustomerInMemoryGateway from '../../src/gateways/CustomerInMemoryGateway'
import PaymentIntegrationInMemoryGateway from '../../src/gateways/PaymentIntegrationInMemoryGateway'
import PaymentRejectedHandler from '../../src/handlers/PaymentRejectedHandler'
import type IGatewayFactory from '../../src/interfaces/IGatewayFactory'
import type IOrderGateway from '../../src/interfaces/IOrderGateway'
import { type IPaymentGateway } from '../../src/interfaces/IPaymentGateway'

const orderItems: OrderItem[] = [
  new OrderItem('1', '1', 30, 2),
  new OrderItem('2', '1', 10, 2),
  new OrderItem('3', '1', 25, 2),
  new OrderItem('4', '1', 25, 1)
]

const mockOrder = new Order('1', 2, 'CREATED', orderItems)

describe('Payment rejected handler', () => {
  const mockOrderGateway: IOrderGateway = {
    save: jest.fn(async (order) => await Promise.resolve(order.id)),
    findById: jest.fn(async (_id: string) => await Promise.resolve(mockOrder)),
    find: jest.fn(async (_params: any) => await Promise.resolve([])),
    count: jest.fn(async (_params: any) => await Promise.resolve(0))
  }
  const mockPaymentGateway: IPaymentGateway = {
    save: jest.fn().mockReturnValueOnce('any_payment_id'),
    findById: jest.fn().mockReturnValueOnce(undefined)
  }
  const mockFactory: IGatewayFactory = {
    createCustomerGateway: () => new CustomerInMemoryGateway(),
    createOrderGateway: () => mockOrderGateway,
    createItemGateway: () => { throw new Error('') },
    createPaymentGateway: () => mockPaymentGateway,
    createPaymentIntegrationGateway: () => new PaymentIntegrationInMemoryGateway()
  }
  it('Should skip to PAYMENT_REFUSED step when order payment was rejected', async () => {
    const sut = new PaymentRejectedHandler(mockFactory)
    await sut.handle(new PaymentRejected(mockOrder.id))
    expect(mockOrderGateway.findById).toHaveBeenCalledWith('1')
    expect(mockOrderGateway.save).toHaveBeenCalledWith(mockOrder.updateStatus('PAYMENT_REFUSED'))
  })
  it('Should fail when order does not exist', async () => {
    const mockOrderGatewayNotFound: IOrderGateway = {
      ...mockOrderGateway,
      findById: jest.fn(async (_id: string) => { return undefined })
    }
    const sut = new PaymentRejectedHandler({ ...mockFactory, createOrderGateway: () => mockOrderGatewayNotFound })
    const result = sut.handle(new PaymentRejected(mockOrder.id))
    await expect(result).rejects.toEqual(new Error(`Order with id ${mockOrder.id} does not exists`))
  })
})