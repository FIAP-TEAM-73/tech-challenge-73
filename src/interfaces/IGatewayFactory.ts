import { type ICustomerGateway } from './ICustomerGateway'
import type IItemGateway from './IItemGateway'
import type IOrderGateway from './IOrderGateway'

export default interface IGatewayFactory {
  createCustomerRepository: () => ICustomerGateway
  createOrderRepository: () => IOrderGateway
  createItemRepository: () => IItemGateway
}
