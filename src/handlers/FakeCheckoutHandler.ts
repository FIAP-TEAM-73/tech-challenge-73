import type IHandler from '../interfaces/IHandler'
import type DomainEvent from '../events/DomainEvent'
import OrderPlaced from '../events/OrderPlaced'
import type IGatewayFactory from '../interfaces/IGatewayFactory'
import type IOrderGateway from '../interfaces/IOrderGateway'
import { type IPaymentGateway } from '../interfaces/IPaymentGateway'
import { type IPaymentIntegrationGateway } from '../interfaces/IPaymentIntegrationGateway'
import type Order from '../entities/Order'
import PaymentStatus from '../entities/PaymentStatus'
import Payment from '../entities/Payment'
import { v4 as uuidv4 } from 'uuid'
import OrderUpdated from '../events/OrderUpdated'

export default class FakeCheckoutHandler implements IHandler {
  orderGateway: IOrderGateway
  paymentGateway: IPaymentGateway
  paymentIntegrationGateway: IPaymentIntegrationGateway
  constructor (factory: IGatewayFactory) {
    this.orderGateway = factory.createOrderGateway()
    this.paymentGateway = factory.createPaymentGateway()
    this.paymentIntegrationGateway = factory.createPaymentIntegrationGateway()
  }

  async handle<T> (event: DomainEvent<T>): Promise<void> {
    if (event instanceof OrderPlaced || event instanceof OrderUpdated) {
      const order = await this.orderGateway.findById(event.value)
      if (order === undefined) throw new Error(`Order with id ${event.value} does not exists`)
      if (event instanceof OrderUpdated) await this.paymentGateway.cancelPaymentByOrderId(event.value)
      await this.createPayment(order)
      await this.orderGateway.save(order.updateStatus('AWAITING_PAYMENT'))
    }
  }

  private async createPayment (order: Order): Promise<void> {
    const response = await this.paymentIntegrationGateway.createPayment(order)
    const paymentStatus = new PaymentStatus(uuidv4(), 'AWAITING_PAYMENT')
    const payment = new Payment(uuidv4(), order.id, order.getTotal(), [paymentStatus], response.qrCode, response.integrationId)
    await this.paymentGateway.save(payment)
  }
}
