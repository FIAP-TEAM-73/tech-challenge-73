import type Order from '../entities/Order'

export default interface IOrderRepository {
  save: (order: Order) => Promise<string>
}
