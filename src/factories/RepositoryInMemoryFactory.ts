import type IGatewayFactory from '../interfaces/IGatewayFactory'
import type IOrderGateway from '../interfaces/IOrderGateway'
import CustomerInMemoryGateway from '../gateways/CustomerInMemoryRepository'
import { type ICustomerGateway } from '../interfaces/ICustomerGateway'
import type IItemGateway from '../interfaces/IItemGateway'

export default class RepositoryInMemoryFactory implements IGatewayFactory {
  private readonly customerInMemoryRepository = new CustomerInMemoryGateway()
  createCustomerGateway (): ICustomerGateway {
    return this.customerInMemoryRepository
  }

  createItemGateway!: () => IItemGateway
  createOrderGateway!: () => IOrderGateway
}
