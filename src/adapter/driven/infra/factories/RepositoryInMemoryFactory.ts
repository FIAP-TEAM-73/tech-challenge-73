import type IRepositoryFactory from '../../../../core/domain/factories/IRepositoryFactory'
import { type ICustomerRepository } from '../../../../core/domain/repositories/ICustomerRepository'
import type IOrderRepository from '../../../../core/domain/repositories/IOrderRepository'
import CustomerInMemoryRepository from '../repositories/CustomerInMemoryRepository'

export default class RepositoryInMemoryFactory implements IRepositoryFactory {
  createOrderRepository!: () => IOrderRepository
  private readonly customerInMemoryRepository = new CustomerInMemoryRepository()
  createCustomerRepository (): ICustomerRepository {
    return this.customerInMemoryRepository
  }
}
