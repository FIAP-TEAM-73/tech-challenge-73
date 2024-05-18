import type IConnection from '../../../../core/domain/database/IConnection'
import type IRepositoryFactory from '../../../../core/domain/factories/IRepositoryFactory'
import { type ICustomerRepository } from '../../../../core/domain/repositories/ICustomerRepository'
import CustomerRepository from '../repositories/CustomerRepository'

export default class RepositoryFactory implements IRepositoryFactory {
  constructor (private readonly connection: IConnection) {}
  createCustomerRepository (): ICustomerRepository {
    return new CustomerRepository(this.connection)
  }
}
