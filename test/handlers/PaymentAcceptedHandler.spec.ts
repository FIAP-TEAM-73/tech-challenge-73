import Order from '../../src/entities/Order'
import OrderItem from '../../src/entities/OrderItem'
import PaymentAccepted from '../../src/events/PaymentAccepted'
import CustomerInMemoryGateway from '../../src/gateways/CustomerInMemoryGateway'
import PaymentIntegrationInMemoryGateway from '../../src/gateways/PaymentIntegrationInMemoryGateway'
import PaymentAcceptedHandler from '../../src/handlers/PaymentAcceptedHandler'
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

describe('Payment accepted handler', () => {
  const mockOrderGateway: IOrderGateway = {
    save: jest.fn(async (order) => await Promise.resolve(order.id)),
    findById: jest.fn(async (_id: string) => await Promise.resolve(mockOrder)),
    find: jest.fn(async (_params: any) => await Promise.resolve([])),
    count: jest.fn(async (_params: any) => await Promise.resolve(0)),
    removeAndInsertAllOrderItems: jest.fn(async (_orderId: string, _orderItems: OrderItem[]) => await Promise.resolve('')),
    checkOrderItemsIfValid: jest.fn(async (_id: string) => await Promise.resolve(true))
  }
  const mockPaymentGateway: IPaymentGateway = {
    save: jest.fn().mockReturnValueOnce('any_payment_id'),
    findPaymentByOrderId: jest.fn().mockReturnValueOnce(undefined),
    cancelPaymentByOrderId: jest.fn().mockReturnValueOnce(undefined)
  }
  const mockFactory: IGatewayFactory = {
    createCustomerGateway: () => new CustomerInMemoryGateway(),
    createOrderGateway: () => mockOrderGateway,
    createItemGateway: () => { throw new Error('') },
    createPaymentGateway: () => mockPaymentGateway,
    createPaymentIntegrationGateway: () => new PaymentIntegrationInMemoryGateway()
  }
  it('Should skip to RECEIVED step when order payment was accepted', async () => {
    const sut = new PaymentAcceptedHandler(mockFactory)
    await sut.handle(new PaymentAccepted(mockOrder.id))
    expect(mockOrderGateway.findById).toHaveBeenCalledWith('1')
    expect(mockOrderGateway.save).toHaveBeenCalledWith(mockOrder.updateStatus('RECEIVED'))
  })
  it('Should fail when order does not exist', async () => {
    const mockOrderGatewayNotFound: IOrderGateway = {
      ...mockOrderGateway,
      findById: jest.fn(async (_id: string) => { return undefined })
    }
    const sut = new PaymentAcceptedHandler({ ...mockFactory, createOrderGateway: () => mockOrderGatewayNotFound })
    const result = sut.handle(new PaymentAccepted(mockOrder.id))
    await expect(result).rejects.toEqual(new Error(`Order with id ${mockOrder.id} does not exists`))
  })
})
