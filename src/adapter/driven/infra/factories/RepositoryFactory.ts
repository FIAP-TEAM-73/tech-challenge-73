import type IRepositoryFactory from '../../../../core/domain/factories/IRepositoryFactory'
import { type ICustomerRepository } from '../../../../core/domain/repositories/ICustomerRepository'
import CustomerInMemoryRepository from '../repositories/CustomerInMemoryRepository'

export default class RepositoryFactory implements IRepositoryFactory {
  private readonly customerInMemoryRepository = new CustomerInMemoryRepository()
  createCustomerRepository (): ICustomerRepository {
    return this.customerInMemoryRepository
  }
}
