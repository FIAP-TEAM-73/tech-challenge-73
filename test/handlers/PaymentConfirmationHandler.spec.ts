import Order from '../../src/entities/Order'
import OrderItem from '../../src/entities/OrderItem'
import PaymentAccepted from '../../src/events/PaymentAccepted'
import CustomerInMemoryGateway from '../../src/gateways/CustomerInMemoryGateway'
import PaymentConfirmationHanlder from '../../src/handlers/PaymentConfirmationHanlder'
import type IGatewayFactory from '../../src/interfaces/IGatewayFactory'
import type IOrderGateway from '../../src/interfaces/IOrderGateway'

const orderItems: OrderItem[] = [
  new OrderItem('1', '1', 30, 2),
  new OrderItem('2', '1', 10, 2),
  new OrderItem('3', '1', 25, 2),
  new OrderItem('4', '1', 25, 1)
]

const mockOrder = new Order('1', 2, 'CREATED', orderItems)

describe('Payment confirmation handler', () => {
  const mockOrderGateway: IOrderGateway = {
    save: jest.fn(async (order) => await Promise.resolve(order.id)),
    findById: jest.fn(async (_id: string) => await Promise.resolve(mockOrder)),
    find: jest.fn(async (_params: any) => await Promise.resolve([])),
    count: jest.fn(async (_params: any) => await Promise.resolve(0))
  }
  const mockFactory: IGatewayFactory = {
    createCustomerGateway: () => new CustomerInMemoryGateway(),
    createOrderGateway: () => mockOrderGateway,
    createItemGateway: () => { throw new Error('') }
  }
  it('Should skip to received step when order payment was accepted', async () => {
    const sut = new PaymentConfirmationHanlder(mockFactory)
    await sut.handle(new PaymentAccepted(mockOrder.id))
    expect(mockOrderGateway.findById).toHaveBeenCalledWith('1')
    expect(mockOrderGateway.save).toHaveBeenCalledWith(mockOrder.updateStatus('RECEIVED'))
  })
})
