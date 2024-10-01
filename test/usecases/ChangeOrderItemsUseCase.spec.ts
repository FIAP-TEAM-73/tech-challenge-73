import { notFoundError } from '../../src/presenters/HttpResponses'
import Order from '../../src/entities/Order'
import OrderItem from '../../src/entities/OrderItem'
import type IOrderGateway from '../../src/interfaces/IOrderGateway'
import ChangeOrderItemsUseCase, { type ChangeOrderItemsCommand } from '../../src/usecases/ChangeOrderItemsUseCase'
import EventHandler from '../../src/handlers/EventHandler'

const mockOrderItems: OrderItem[] =
 [new OrderItem('any_id', 'any_id', 30, 2)]

const mockUpdateOrderItemsCommand: ChangeOrderItemsCommand = {
  orderItems: []
}

const mockOrder = new Order('any_id', 2, 'IN_PROGRESS', mockOrderItems)
describe('Update Order items use case', () => {
  const mockOrderGateway: IOrderGateway = {
    save: jest.fn(async (order) => await Promise.resolve(order.id)),
    findById: jest.fn(async (_id: string) => await Promise.resolve(mockOrder)),
    find: jest.fn(async (_params: any) => await Promise.reject(new Error())),
    count: jest.fn(async (_params: any) => await Promise.reject(new Error())),
    removeAndInsertAllOrderItems: jest.fn(async (_orderId: string, _orderItems: OrderItem[]) => await Promise.resolve(_orderId)),
    checkOrderItemsIfValid: jest.fn(async (_id: string) => await Promise.resolve(true))
  }
  it('Should update Order items with success when Order exists', async () => {
    const orderId = 'any_id'
    const sut = new ChangeOrderItemsUseCase(mockOrderGateway, new EventHandler([]))
    await sut.execute(orderId, mockUpdateOrderItemsCommand)
    expect(mockOrderGateway.checkOrderItemsIfValid).toHaveBeenCalledWith(orderId)
    expect(mockOrderGateway.removeAndInsertAllOrderItems).toHaveReturned()
  })
  it('Should return not found when Order does not exist', async () => {
    const mockOrderGatewayNotFound: IOrderGateway = {
      ...mockOrderGateway,
      checkOrderItemsIfValid: jest.fn(async (_id: string) => { return undefined })
    }
    const orderId = 'any_id'
    const sut = new ChangeOrderItemsUseCase(mockOrderGatewayNotFound, new EventHandler([]))
    const result = await sut.execute(orderId, mockUpdateOrderItemsCommand)
    expect(result).toEqual(notFoundError(`Order ${orderId} does not exist!`))
  })
})
