import { type ICustomerRepository } from '../repositories/ICustomerRepository'
import type IOrderRepository from '../repositories/IOrderRepository'

export default interface IRepositoryFactory {
  createCustomerRepository: () => ICustomerRepository
  createOrderRepository: () => IOrderRepository
}
