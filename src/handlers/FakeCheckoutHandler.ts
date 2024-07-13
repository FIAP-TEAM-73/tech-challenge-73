import type IHandler from '../interfaces/IHandler'
import type DomainEvent from '../event/DomainEvent'
import OrderPlaced from '../event/OrderPlaced'
import type IGatewayFactory from '../interfaces/IGatewayFactory'
import type IOrderGateway from '../interfaces/IOrderGateway'

export default class FakeCheckoutHandler implements IHandler {
  name: string = 'orderPlaced'
  orderGateway: IOrderGateway
  constructor (factory: IGatewayFactory) {
    this.orderGateway = factory.createOrderGateway()
  }

  async handle<T> (event: DomainEvent<T>): Promise<void> {
    if (event instanceof OrderPlaced) {
      const order = await this.orderGateway.findById(event.value)
      if (order === undefined) throw new Error(`Order with id ${event.value} does not exists`)
      await this.orderGateway.save(order.updateStatus('AWAITING_PAYMENT'))
    }
  }
}
