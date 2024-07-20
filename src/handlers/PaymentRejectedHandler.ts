import type IHandler from '../interfaces/IHandler'
import type DomainEvent from '../events/DomainEvent'
import type IGatewayFactory from '../interfaces/IGatewayFactory'
import type IOrderGateway from '../interfaces/IOrderGateway'
import PaymentRejected from '../events/PaymentRejected'

export default class PaymentRejectedHanlder implements IHandler {
  name: string = 'paymentRejected'
  orderGateway: IOrderGateway
  constructor (factory: IGatewayFactory) {
    this.orderGateway = factory.createOrderGateway()
  }

  async handle<T> (event: DomainEvent<T>): Promise<void> {
    if (event instanceof PaymentRejected) {
      const order = await this.orderGateway.findById(event.value)
      if (order === undefined) throw new Error(`Order with id ${event.value} does not exists`)
      await this.orderGateway.save(order.updateStatus('PAYMENT_REFUSED'))
    }
  }
}
