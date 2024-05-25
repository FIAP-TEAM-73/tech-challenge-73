import type Order from '../entities/Order'

export default interface IOrderRepository {
  save: (order: Order) => Promise<string>
  findById: (id: string) => Promise<Order | undefined>
  findAllOrdersByCpf: (cpf: string) => Promise<Order | undefined>
}
