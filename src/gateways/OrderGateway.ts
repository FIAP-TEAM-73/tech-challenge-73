import type Order from '../entities/Order'
import type IOrderGateway from '../interfaces/IOrderGateway'
import { type PageableResponse, type OrderPageParams } from '../interfaces/IOrderGateway'
import { type IIntegration } from '../interfaces/IIntegration'
import { type OrderStatus } from '../entities/Order'

export class OrderGateway implements IOrderGateway {
  constructor (private readonly integration: IIntegration) { }

  async updateStatus (id: string, status: OrderStatus): Promise<void> {
    await this.integration.put(`/order/${id}`, { status }, {})
  }

  async find (params: OrderPageParams): Promise<PageableResponse<Order>> {
    console.log('[OrderGateway] - ', { params })
    const page = await this.integration.get('/order', { params })
    if (this.isOrderPaginator(page)) return page
    throw new Error(`Unkown Failure. Reason: ${JSON.stringify(page)}`)
  }

  private isOrderPaginator (value: unknown): value is PageableResponse<Order> {
    if (this.isPaginator(value)) {
      return Array.isArray(value.content) &&
        value.content.every(item => item && typeof item === 'object' && 'id' in item && 'tableNumber' in item && 'status' in item)
    }
    return false
  }

  private isPaginator<T>(value: unknown): value is PageableResponse<T> {
    if (!value) return false
    if (typeof value !== 'object') return false
    return 'content' in value && Array.isArray(value.content) &&
      'pageSize' in value && 'page' in value && 'totalPages' in value
  }
}
