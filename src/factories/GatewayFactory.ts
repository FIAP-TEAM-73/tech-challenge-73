import type IConnection from '../interfaces/IConnection'
import type IGatewayFactory from '../interfaces/IGatewayFactory'
import type IOrderGateway from '../interfaces/IOrderGateway'
import CustomerGateway from '../gateways/CustomerGateway'
import ItemGateway from '../gateways/ItemGateway'
import { OrderGateway } from '../gateways/OrderGateway'
import type IItemGateway from '../interfaces/IItemGateway'
import { type ICustomerGateway } from '../interfaces/ICustomerGateway'
import { type IPaymentGateway } from '../interfaces/IPaymentGateway'
import { type IPaymentIntegrationGateway } from '../interfaces/IPaymentIntegrationGateway'
import PaymentGateway from '../gateways/PaymentGateway'
import PaymentIntegrationInMemoryGateway from '../gateways/PaymentIntegrationInMemoryGateway'

export default class GatewayFactory implements IGatewayFactory {
  constructor (private readonly connection: IConnection) {}

  createOrderGateway (): IOrderGateway {
    return new OrderGateway(this.connection)
  }

  createCustomerGateway (): ICustomerGateway {
    return new CustomerGateway(this.connection)
  }

  createItemGateway (): IItemGateway {
    return new ItemGateway(this.connection)
  }

  createPaymentGateway (): IPaymentGateway {
    return new PaymentGateway(this.connection)
  }

  createPaymentIntegrationGateway (): IPaymentIntegrationGateway {
    return new PaymentIntegrationInMemoryGateway()
  }
}
