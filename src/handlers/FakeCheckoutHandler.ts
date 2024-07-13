import type Handler from './Handler'
import type DomainEvent from '../event/DomainEvent'
import OrderPlaced from '../event/OrderPlaced'
import type IGatewayFactory from '../interfaces/IGatewayFactory'
import type IOrderGateway from '../interfaces/IOrderGateway'

export default class FakeCheckoutHandler implements Handler {
  name: string = 'orderPlaced'
  orderRepository: IOrderGateway
  constructor (factory: IGatewayFactory) {
    this.orderRepository = factory.createOrderRepository()
  }

  async handle<T> (event: DomainEvent<T>): Promise<void> {
    if (event instanceof OrderPlaced) {
      const order = await this.orderRepository.findById(event.value)
      if (order === undefined) throw new Error(`Order with id ${event.value} does not exists`)
      await this.orderRepository.save(order.updateStatus('PAYMENT_ACCEPTED'))
    }
  }
}
