import { type ICustomerRepository } from '../repositories/ICustomerRepository'

export default interface IRepositoryFactory {
  createCustomerRepository: () => ICustomerRepository
}
