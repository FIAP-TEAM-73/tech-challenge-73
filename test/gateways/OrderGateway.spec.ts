import { OrderGateway } from '../../src/gateways/OrderGateway'
import Order from '../../src/entities/Order'
import OrderItem from '../../src/entities/OrderItem'
import { type IIntegration } from '../../src/interfaces/IIntegration'

const orderItems: OrderItem[] = [
  new OrderItem('1', '1', 30, 2),
  new OrderItem('2', '1', 10, 2),
  new OrderItem('3', '1', 25, 2),
  new OrderItem('4', '1', 25, 1)
]

const order = new Order('1', 2, 'CREATED', orderItems)

const mockPaginator = {
  content: [order],
  pageSize: 10,
  page: 1,
  totalPages: 1,
  isFirstPage: true,
  isLastPage: true
}

describe('Order Gateway', () => {
  const mockIntegration: IIntegration = {
    post: jest.fn().mockResolvedValueOnce(undefined),
    put: jest.fn().mockResolvedValueOnce(undefined),
    get: jest.fn().mockResolvedValueOnce(mockPaginator)
  }
  describe('Update Order Status', () => {
    it('Should update an Order Status when it exists', async () => {
      const sut = new OrderGateway(mockIntegration)
      await sut.updateStatus(order.id, 'IN_PROGRESS')
      expect(mockIntegration.put).toHaveBeenCalled()
      expect(mockIntegration.put).toHaveBeenCalledWith(`/order/${order.id}`, { status: 'IN_PROGRESS' }, {})
    })
    it('Should throw an error when Integration throws', async () => {
      const mockConnectionReject = {
        ...mockIntegration,
        put: jest.fn().mockRejectedValueOnce(new Error('Generec gateway error!'))
      }
      const sut = new OrderGateway(mockConnectionReject)
      const result = sut.updateStatus(order.id, 'IN_PROGRESS')
      await expect(result).rejects.toEqual(new Error('Generec gateway error!'))
    })
  })
  describe('Find Order', () => {
    it('Should return a Paginator of Orders when the filters match', async () => {
      const params = { page: 1, size: 1, id: '1' }
      const sut = new OrderGateway(mockIntegration)
      const result = await sut.find(params)
      expect(result).toEqual(mockPaginator)
      expect(mockIntegration.get).toHaveBeenCalled()
      expect(mockIntegration.get).toHaveBeenCalledWith('/order', { params })
    })
  })
})
