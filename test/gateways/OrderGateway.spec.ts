import { OrderGateway } from '../../src/gateways/OrderGateway'
import type IConnection from '../../src/interfaces/IConnection'
import Order from '../../src/entities/Order'
import OrderItem from '../../src/entities/OrderItem'

const orderItems: OrderItem[] = [
  new OrderItem('1', '1', 30, 2),
  new OrderItem('2', '1', 10, 2),
  new OrderItem('3', '1', 25, 2),
  new OrderItem('4', '1', 25, 1)
]

describe('Order Gateway', () => {
  const mockConnection: IConnection = {
    isAlive: async () => await Promise.resolve(true),
    close: async () => { },
    connect: async () => { },
    query: jest.fn(async (stmt: string, params: any[]) => {
      console.log({ stmt, params })
      return await Promise.resolve({
        rows: [{
          id: '1',
          table_number: 2,
          status: 'CREATED',
          cpf: null,
          order_id: '1',
          item_id: '1',
          price: 30,
          quantity: 2
        },
        {
          id: '1',
          table_number: 2,
          status: 'CREATED',
          cpf: null,
          order_id: '1',
          item_id: '2',
          price: 10,
          quantity: 2
        },
        {
          id: '1',
          table_number: 2,
          status: 'CREATED',
          cpf: null,
          order_id: '1',
          item_id: '3',
          price: 25,
          quantity: 2
        },
        {
          id: '1',
          table_number: 2,
          status: 'CREATED',
          cpf: null,
          order_id: '1',
          item_id: '4',
          price: 25,
          quantity: 1
        }
        ]
      })
    })
  }
  describe('Create an Order', () => {
    it('Should save an Order when every data was correct provided', async () => {
      const orderQuery = 'INSERT INTO "order"(id, table_number, status, cpf) VALUES($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET table_number=$2, status=$3 RETURNING *'
      const orderItemsQuery = 'INSERT INTO order_item(item_id, order_id, price, quantity) VALUES($1, $2, $3, $4) ON CONFLICT (item_id, order_id) DO NOTHING RETURNING *'
      const order = new Order('1', 2, 'CREATED', orderItems)
      const sut = new OrderGateway(mockConnection)
      const result = await sut.save(order)
      expect(result).toEqual('1')
      expect(mockConnection.query).toHaveBeenCalledTimes(5)
      expect(mockConnection.query).toHaveBeenNthCalledWith(1, orderQuery, [order.id, order.tableNumber, order.status, order.cpf])
      expect(mockConnection.query).toHaveBeenNthCalledWith(2, orderItemsQuery, Object.values(orderItems[0]))
      expect(mockConnection.query).toHaveBeenNthCalledWith(5, orderItemsQuery, Object.values(orderItems[3]))
    })
    it('Should throw an error when Connection throws', async () => {
      const mockConnectionReject = {
        ...mockConnection,
        query: jest.fn(async (stmt: string, params: any[]) => {
          console.log({ stmt, params })
          return await Promise.reject(new Error('Generec gateway erro!'))
        })
      }
      const order = new Order('1', 2, 'CREATED', orderItems)
      const sut = new OrderGateway(mockConnectionReject)
      const result = sut.save(order)
      await expect(result).rejects.toEqual(new Error('Generec gateway erro!'))
    })
  })
  describe('Find an Order by ID', () => {
    it('Should find an Order by ID when its exists', async () => {
      const orderId = '1'
      const sut = new OrderGateway(mockConnection)
      const result = await sut.findById(orderId)
      expect(result).toEqual(new Order('1', 2, 'CREATED', orderItems))
    })
    it('Should throw when Connection throws', async () => {
      const mockConnectionReject = {
        ...mockConnection,
        query: jest.fn(async (stmt: string, params: any[]) => {
          console.log({ stmt, params })
          return await Promise.reject(new Error('Generec gateway erro!'))
        })
      }
      const orderId = '1'
      const sut = new OrderGateway(mockConnectionReject)
      const result = sut.findById(orderId)
      await expect(result).rejects.toEqual(new Error('Generec gateway erro!'))
    })
    it('Should return undefined when Order does not exist', async () => {
      const mockConnectionEmpty = {
        ...mockConnection,
        query: jest.fn(async (stmt: string, params: any[]) => {
          console.log({ stmt, params })
          return await Promise.resolve({ rows: [] })
        })
      }
      const wrongId = 'missingID'
      const sut = new OrderGateway(mockConnectionEmpty)
      const result = await sut.findById(wrongId)
      expect(result).toBeUndefined()
    })
  })
})
