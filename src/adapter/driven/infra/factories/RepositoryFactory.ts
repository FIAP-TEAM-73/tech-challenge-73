import type IConnection from '../../../../core/domain/database/IConnection'
import type IRepositoryFactory from '../../../../core/domain/factories/IRepositoryFactory'
import { type ICustomerRepository } from '../../../../core/domain/repositories/ICustomerRepository'
import type IOrderRepository from '../../../../core/domain/repositories/IOrderRepository'
import CustomerRepository from '../repositories/CustomerRepository'
import { OrderRepository } from '../repositories/OrderRepository'

export default class RepositoryFactory implements IRepositoryFactory {
  constructor (private readonly connection: IConnection) {}
  createOrderRepository (): IOrderRepository {
    return new OrderRepository(this.connection)
  }

  createCustomerRepository (): ICustomerRepository {
    return new CustomerRepository(this.connection)
  }
}
