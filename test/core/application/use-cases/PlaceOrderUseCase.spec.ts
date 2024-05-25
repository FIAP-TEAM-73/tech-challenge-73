import { ok } from '../../../../src/core/application/api/HttpResponses'
import EventHandler from '../../../../src/core/application/handlers/EventHandler'
import PlaceOrderUseCase from '../../../../src/core/application/use-cases/PlaceOrderUseCase'
import type IOrderRepository from '../../../../src/core/domain/repositories/IOrderRepository'
import * as uuid from 'uuid'

jest.mock('uuid')

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
  jest.spyOn(uuid, 'v4').mockReturnValueOnce('mocked_id')
  const mockOrderRepository: IOrderRepository = {
    save: jest.fn(async (order) => await Promise.resolve(order.id)),
    findById: jest.fn(async (_id: string) => await Promise.reject(new Error())),
    findAllOrdersByCpf: jest.fn(async (_cpf: string) => await Promise.reject(new Error()))
  }
  it('Should place an Order with success when every information is received correctly', async () => {
    const sut = new PlaceOrderUseCase(mockOrderRepository, new EventHandler([]))
    const result = await sut.execute(mockPlaceOrderCommand)
    expect(result).toEqual(ok({ orderId: 'mocked_id' }))
  })
})
