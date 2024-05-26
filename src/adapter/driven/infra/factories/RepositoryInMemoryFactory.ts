import type IRepositoryFactory from '../../../../core/domain/factories/IRepositoryFactory'
import { type ICustomerRepository } from '../../../../core/domain/repositories/ICustomerRepository'
import type IItemRepository from '../../../../core/domain/repositories/IItemRepository'
import type IOrderRepository from '../../../../core/domain/repositories/IOrderRepository'
import CustomerInMemoryRepository from '../repositories/CustomerInMemoryRepository'

export default class RepositoryInMemoryFactory implements IRepositoryFactory {
  private readonly customerInMemoryRepository = new CustomerInMemoryRepository()
  createCustomerRepository (): ICustomerRepository {
    return this.customerInMemoryRepository
  }

  createItemRepository!: () => IItemRepository
  createOrderRepository!: () => IOrderRepository
}
