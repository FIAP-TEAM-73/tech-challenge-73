import { ok } from '../../../../src/core/application/api/HttpResponses'
import PlaceOrderUseCase from '../../../../src/core/application/use-cases/PlaceOrderUseCase'
import type IOrderRepository from '../../../../src/core/domain/repositories/IOrderRepository'

const mockPlaceOrderItems = [
  {
    idItem: '1',
    price: 30.0,
    quantity: 2
  },
  {
    idItem: '2',
    price: 15.0,
    quantity: 1
  },
  {
    idItem: '3',
    price: 7.5,
    quantity: 2
  },
  {
    idItem: '4',
    price: 18.50,
    quantity: 1
  }
]

const mockPlaceOrderCommand = {
  tableNumber: 24,
  orderItems: mockPlaceOrderItems,
  cpf: undefined
}

describe('Place an Order use case', () => {
  const mockOrderRepository: IOrderRepository = {
    save: jest.fn(async (order) => await Promise.resolve(order.id))
  }
  it('Should place an Order with success when every information is received correctly', async () => {
    const sut = new PlaceOrderUseCase(mockOrderRepository)
    const result = await sut.execute(mockPlaceOrderCommand)
    expect(result).toEqual(ok({ orderId: 'any_id' }))
  })
})
