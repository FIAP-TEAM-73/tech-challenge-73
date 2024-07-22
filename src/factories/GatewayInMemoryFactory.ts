import type IGatewayFactory from '../interfaces/IGatewayFactory'
import type IOrderGateway from '../interfaces/IOrderGateway'
import CustomerInMemoryGateway from '../gateways/CustomerInMemoryGateway'
import { type ICustomerGateway } from '../interfaces/ICustomerGateway'
import type IItemGateway from '../interfaces/IItemGateway'
import { type IPaymentGateway } from '../interfaces/IPaymentGateway'
import { type IPaymentIntegrationGateway } from '../interfaces/IPaymentIntegrationGateway'

export default class GatewayInMemoryFactory implements IGatewayFactory {
  private readonly customerInMemoryGateway = new CustomerInMemoryGateway()
  createCustomerGateway (): ICustomerGateway {
    return this.customerInMemoryGateway
  }

  createItemGateway!: () => IItemGateway
  createOrderGateway!: () => IOrderGateway
  createPaymentGateway!: () => IPaymentGateway
  createPaymentIntegrationGateway!: () => IPaymentIntegrationGateway
}
