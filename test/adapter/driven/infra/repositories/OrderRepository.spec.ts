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
      const orderQuery = 'INSERT INTO order(id, table_number, status, cpf) VALUES($1, $2, $3, $4) RETURNING *'
      const orderItemsQuery = 'INSERT INTO order_item(item_id, order_id, price, quantity) VALUES($1, $2, $3, $4) RETURNING *'
      const order = new Order('1', 2, 'CREATED', orderItems)
      const sut = new OrderRepository(mockConnection)
      const result = await sut.save(order)
      expect(result).toEqual('1')
      expect(mockConnection.query).toHaveBeenCalledTimes(5)
      expect(mockConnection.query).toHaveBeenNthCalledWith(1, orderQuery, [order.id, order.tableNumber, order.status, order.cpf])
      expect(mockConnection.query).toHaveBeenNthCalledWith(2, orderItemsQuery, Object.values(orderItems[0]))
      expect(mockConnection.query).toHaveBeenNthCalledWith(5, orderItemsQuery, Object.values(orderItems[3]))
    })
  })
})
