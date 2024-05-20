import { OrderRepository } from '../../../../../src/adapter/driven/infra/repositories/OrderRepository'
import type IConnection from '../../../../../src/core/domain/database/IConnection'
import Order from '../../../../../src/core/domain/entities/Order'
import OrderItem from '../../../../../src/core/domain/entities/OrderItem'

const orderItems: OrderItem[] = [
  new OrderItem('1', '1', 30, 2),
  new OrderItem('2', '1', 10, 2),
  new OrderItem('3', '1', 25, 2),
  new OrderItem('4', '1', 25, 1)
]

describe('Order Repository', () => {
  const mockConnection: IConnection = {
    isAlive: async () => await Promise.resolve(true),
    close: async () => { },
    connect: async () => { },
    query: jest.fn(async (stmt: string, params: any[]) => {
      console.log({ stmt, params })
      return await Promise.resolve({ rows: [{ id: '1', tableNumber: 2, status: 'CREATED', orderItems, cpf: undefined }] })
    })
  }
  describe('Create an Order', () => {
    it('Should save an Order when every data was correct provided', async () => {
      const order = new Order('1', 2, 'CREATED', orderItems)
      const sut = new OrderRepository(mockConnection)
      const result = await sut.save(order)
      expect(result).toEqual('1')
      expect(mockConnection.query).toHaveBeenCalledTimes(5)
    })
  })
})
