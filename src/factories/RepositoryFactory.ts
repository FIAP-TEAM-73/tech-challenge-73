import type IConnection from '../interfaces/IConnection'
import type IGatewayFactory from '../interfaces/IGatewayFactory'
import type IOrderGateway from '../interfaces/IOrderGateway'
import CustomerGateway from '../gateways/CustomerGateway'
import ItemGateway from '../gateways/ItemGateway'
import { OrderGateway } from '../gateways/OrderGateway'
import type IItemGateway from '../interfaces/IItemGateway'
import { type ICustomerGateway } from '../interfaces/ICustomerGateway'

export default class RepositoryFactory implements IGatewayFactory {
  constructor (private readonly connection: IConnection) {}
  createOrderRepository (): IOrderGateway {
    return new OrderGateway(this.connection)
  }

  createCustomerRepository (): ICustomerGateway {
    return new CustomerGateway(this.connection)
  }

  createItemRepository (): IItemGateway {
    return new ItemGateway(this.connection)
  }
}
