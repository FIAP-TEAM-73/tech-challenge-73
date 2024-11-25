import EventHandler from '../../src/handlers/EventHandler'
import PlaceOrderUseCase from '../../src/usecases/PlaceOrderUseCase'
import type IOrderGateway from '../../src/interfaces/IOrderGateway'

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
  cpf: null
}

describe('Place an Order use case', () => {
  const mockOrderGateway: IOrderGateway = {
    save: jest.fn(async (order) => await Promise.resolve(order.id)),
    findById: jest.fn(async (_id: string) => await Promise.reject(new Error())),
    find: jest.fn(async (_params: any) => await Promise.reject(new Error())),
    count: jest.fn(async (_params: any) => await Promise.reject(new Error()))
  }
  it('Should place an Order with success when every information is received correctly', async () => {
    const sut = new PlaceOrderUseCase(mockOrderGateway, new EventHandler([]))
    const result = await sut.execute(mockPlaceOrderCommand)
    expect(result.statusCode).toEqual(200)
  })
})
