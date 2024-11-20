import ChangeOrderStatusUseCase, { type ChangeOrderStatusCommand } from '../../src/usecases/ChangeOrderStatusUseCase'
import Order from '../../src/entities/Order'
import OrderItem from '../../src/entities/OrderItem'
import type IOrderGateway from '../../src/interfaces/IOrderGateway'

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
  const mockOrderGateway: IOrderGateway = {
    updateStatus: jest.fn().mockResolvedValueOnce(undefined),
    find: jest.fn().mockRejectedValueOnce(new Error())
  }
  it('Should update Order status with success when Order exists', async () => {
    const orderId = 'any_id'
    const sut = new ChangeOrderStatusUseCase(mockOrderGateway)
    await sut.execute(orderId, mockUpdateOrderStatusCommand)
    expect(mockOrderGateway.updateStatus).toHaveBeenCalledWith(mockOrder.id, 'CANCELED')
  })
  it('Should throw when OrderGateway Throws', async () => {
    const mockOrderGatewayNotFound: IOrderGateway = {
      ...mockOrderGateway,
      updateStatus: jest.fn().mockRejectedValueOnce(new Error())
    }
    const orderId = 'any_id'
    const sut = new ChangeOrderStatusUseCase(mockOrderGatewayNotFound)
    const result = sut.execute(orderId, mockUpdateOrderStatusCommand)
    await expect(result).rejects.toThrow(new Error())
  })
})
