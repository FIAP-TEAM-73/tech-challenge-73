import type Handler from '../../../../core/application/handlers/Handler'
import type DomainEvent from '../../../../core/domain/event/DomainEvent'
import OrderPlaced from '../../../../core/domain/event/OrderPlaced'
import type IRepositoryFactory from '../../../../core/domain/factories/IRepositoryFactory'
import type IOrderRepository from '../../../../core/domain/repositories/IOrderRepository'

export default class FakeCheckoutHandler implements Handler {
  name: string = 'orderPlaced'
  orderRepository: IOrderRepository
  constructor (factory: IRepositoryFactory) {
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
