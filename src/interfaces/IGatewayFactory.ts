import { type ICustomerGateway } from './ICustomerGateway'
import type IItemGateway from './IItemGateway'
import type IOrderGateway from './IOrderGateway'
import { type IPaymentGateway } from './IPaymentGateway'
import { type IPaymentIntegrationGateway } from './IPaymentIntegrationGateway'

export default interface IGatewayFactory {
  createCustomerGateway: () => ICustomerGateway
  createOrderGateway: () => IOrderGateway
  createItemGateway: () => IItemGateway
  createPaymentGateway: () => IPaymentGateway
  createPaymentIntegrationGateway: () => IPaymentIntegrationGateway
}
