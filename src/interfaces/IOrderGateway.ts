import type Order from '../entities/Order'
import { type OrderStatus } from '../entities/Order'
export type OrderParams = Partial<Record<keyof Omit<Order, 'getTotal' | 'updateStatus' | 'orderItems'>, string>>
export type OrderPageParams = OrderParams & { page: number, size: number }
export interface PageableResponse<T> {
  content: T
  pageSize: number
  page: number
  isFirstPage: boolean
  isLastPage: boolean
}
export default interface IOrderGateway {
  updateStatus: (id: string, status: OrderStatus) => Promise<void>
  find: (params: OrderPageParams) => Promise<PageableResponse<Order>>
}
