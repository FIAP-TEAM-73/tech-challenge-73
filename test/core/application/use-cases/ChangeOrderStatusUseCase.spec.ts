import { notFoundError } from '../../../../src/core/application/api/HttpResponses'
import ChangeOrderStatusUseCase, { type ChangeOrderStatusCommand } from '../../../../src/core/application/use-cases/ChangeOrderStatusUseCase'
import Order from '../../../../src/core/domain/entities/Order'
import OrderItem from '../../../../src/core/domain/entities/OrderItem'
import type IOrderRepository from '../../../../src/core/domain/repositories/IOrderRepository'

const mockUpdateOrderStatusCommand: ChangeOrderStatusCommand = {
  status: 'CANCELED'
}
const orderItems: OrderItem[] = [
  new OrderItem('1', '1', 30, 2),
  new OrderItem('2', '1', 10, 2),
  new OrderItem('3', '1', 25, 2),
  new OrderItem('4', '1', 25, 1)
]

const mockOrder = new Order('any_id', 2, 'CREATED', orderItems)
describe('Update Order status use case', () => {
  const mockOrderRepository: IOrderRepository = {
    save: jest.fn(async (order) => await Promise.resolve(order.id)),
    findById: jest.fn(async (_id: string) => await Promise.resolve(mockOrder)),
    findAllOrdersByCpf: jest.fn(async (_cpf: string) => await Promise.resolve(mockOrder))
  }
  it('Should update Order status with success when Order exists', async () => {
    const orderId = 'any_id'
    const sut = new ChangeOrderStatusUseCase(mockOrderRepository)
    await sut.execute(orderId, mockUpdateOrderStatusCommand)
    expect(mockOrderRepository.findById).toHaveBeenCalledWith(orderId)
    expect(mockOrderRepository.save).toHaveBeenCalledWith(mockOrder.updateStatus('CANCELED'))
  })
  it('Should return not found when Order does not exist', async () => {
    const mockOrderRepositoryNotFound: IOrderRepository = {
      ...mockOrderRepository,
      findById: jest.fn(async (_id: string) => { return undefined })
    }
    const orderId = 'any_id'
    const sut = new ChangeOrderStatusUseCase(mockOrderRepositoryNotFound)
    const result = await sut.execute(orderId, mockUpdateOrderStatusCommand)
    expect(result).toEqual(notFoundError(`Order ${orderId} does not exist!`))
  })
})
