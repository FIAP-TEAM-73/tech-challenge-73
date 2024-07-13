import CustomerInMemoryGateway from '../../src/gateways/CustomerInMemoryRepository'
import FakeCheckoutHandler from '../../src/handlers/FakeCheckoutHandler'
import Order from '../../src/entities/Order'
import OrderItem from '../../src/entities/OrderItem'
import OrderPlaced from '../../src/event/OrderPlaced'
import type IGatewayFactory from '../../src/interfaces/IGatewayFactory'
import type IOrderGateway from '../../src/interfaces/IOrderGateway'

const orderItems: OrderItem[] = [
  new OrderItem('1', '1', 30, 2),
  new OrderItem('2', '1', 10, 2),
  new OrderItem('3', '1', 25, 2),
  new OrderItem('4', '1', 25, 1)
]

const mockOrder = new Order('1', 2, 'CREATED', orderItems)
describe('Fake checkout handler', () => {
  const mockOrderRepository: IOrderGateway = {
    save: jest.fn(async (order) => await Promise.resolve(order.id)),
    findById: jest.fn(async (_id: string) => await Promise.resolve(mockOrder)),
    find: jest.fn(async (_params: any) => await Promise.resolve([])),
    count: jest.fn(async (_params: any) => await Promise.resolve(0))
  }
  const mockFactory: IGatewayFactory = {
    createCustomerRepository: () => new CustomerInMemoryGateway(),
    createOrderRepository: () => mockOrderRepository,
    createItemRepository: () => { throw new Error('') }
  }
  it('Should skip payment step when order is created', async () => {
    const sut = new FakeCheckoutHandler(mockFactory)
    await sut.handle(new OrderPlaced(mockOrder.id))
    expect(mockOrderRepository.findById).toHaveBeenCalledWith('1')
    expect(mockOrderRepository.save).toHaveBeenCalledWith(mockOrder.updateStatus('PAYMENT_ACCEPTED'))
  })
  it('Should fail when order does not exist', async () => {
    const mockOrderRepositoryNotFound: IOrderGateway = {
      ...mockOrderRepository,
      findById: jest.fn(async (_id: string) => { return undefined })
    }
    const sut = new FakeCheckoutHandler({ ...mockFactory, createOrderRepository: () => mockOrderRepositoryNotFound })
    const result = sut.handle(new OrderPlaced(mockOrder.id))
    await expect(result).rejects.toEqual(new Error(`Order with id ${mockOrder.id} does not exists`))
  })
})
