import CustomerInMemoryRepository from '../../../../../src/adapter/driven/infra/repositories/CustomerInMemoryRepository'
import FakeCheckoutHandler from '../../../../../src/adapter/driver/infra/handlers/FakeCheckoutHandler'
import Order from '../../../../../src/core/domain/entities/Order'
import OrderItem from '../../../../../src/core/domain/entities/OrderItem'
import OrderPlaced from '../../../../../src/core/domain/event/OrderPlaced'
import type IRepositoryFactory from '../../../../../src/core/domain/factories/IRepositoryFactory'
import type IOrderRepository from '../../../../../src/core/domain/repositories/IOrderRepository'

const orderItems: OrderItem[] = [
  new OrderItem('1', '1', 30, 2),
  new OrderItem('2', '1', 10, 2),
  new OrderItem('3', '1', 25, 2),
  new OrderItem('4', '1', 25, 1)
]

const mockOrder = new Order('1', 2, 'CREATED', orderItems)
describe('Fake checkout handler', () => {
  const mockOrderRepository: IOrderRepository = {
    save: jest.fn(async (order) => await Promise.resolve(order.id)),
    findById: jest.fn(async (_id: string) => await Promise.resolve(mockOrder))
  }
  const mockFactory: IRepositoryFactory = {
    createCustomerRepository: () => new CustomerInMemoryRepository(),
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
    const mockOrderRepositoryNotFound: IOrderRepository = {
      ...mockOrderRepository,
      findById: jest.fn(async (_id: string) => { return undefined })
    }
    const sut = new FakeCheckoutHandler({ ...mockFactory, createOrderRepository: () => mockOrderRepositoryNotFound })
    const result = sut.handle(new OrderPlaced(mockOrder.id))
    await expect(result).rejects.toEqual(new Error(`Order with id ${mockOrder.id} does not exists`))
  })
})
