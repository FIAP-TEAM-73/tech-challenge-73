import CustomerInMemoryGateway from '../../src/gateways/CustomerInMemoryGateway'
import FakeCheckoutHandler from '../../src/handlers/FakeCheckoutHandler'
import Order from '../../src/entities/Order'
import OrderItem from '../../src/entities/OrderItem'
import OrderPlaced from '../../src/events/OrderPlaced'
import type IGatewayFactory from '../../src/interfaces/IGatewayFactory'
import type IOrderGateway from '../../src/interfaces/IOrderGateway'
import { type IPaymentGateway } from '../../src/interfaces/IPaymentGateway'
import { type IPaymentIntegrationGateway } from '../../src/interfaces/IPaymentIntegrationGateway'

const orderItems: OrderItem[] = [
  new OrderItem('1', '1', 30, 2),
  new OrderItem('2', '1', 10, 2),
  new OrderItem('3', '1', 25, 2),
  new OrderItem('4', '1', 25, 1)
]

const mockOrder = new Order('1', 2, 'CREATED', orderItems)

describe('Fake checkout handler', () => {
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
  const mockPaymentIntegrationGateway: IPaymentIntegrationGateway = {
    createPayment: jest.fn().mockReturnValueOnce({ integrationId: 'any_integration_id', qrCode: '00020101021243650016COM' })
  }
  const mockFactory: IGatewayFactory = {
    createCustomerGateway: () => new CustomerInMemoryGateway(),
    createOrderGateway: () => mockOrderGateway,
    createItemGateway: () => { throw new Error('') },
    createPaymentGateway: () => mockPaymentGateway,
    createPaymentIntegrationGateway: () => mockPaymentIntegrationGateway
  }
  it('Should skip payment step when order is created', async () => {
    const sut = new FakeCheckoutHandler(mockFactory)
    await sut.handle(new OrderPlaced(mockOrder.id))
    expect(mockOrderGateway.findById).toHaveBeenCalledWith('1')
    expect(mockOrderGateway.save).toHaveBeenCalledWith(mockOrder.updateStatus('AWAITING_PAYMENT'))
    expect(mockPaymentGateway.save).toHaveReturned()
  })
  it('Should fail when order does not exist', async () => {
    const mockOrderGatewayNotFound: IOrderGateway = {
      ...mockOrderGateway,
      findById: jest.fn(async (_id: string) => { return undefined })
    }
    const sut = new FakeCheckoutHandler({ ...mockFactory, createOrderGateway: () => mockOrderGatewayNotFound })
    const result = sut.handle(new OrderPlaced(mockOrder.id))
    await expect(result).rejects.toEqual(new Error(`Order with id ${mockOrder.id} does not exists`))
  })
})
