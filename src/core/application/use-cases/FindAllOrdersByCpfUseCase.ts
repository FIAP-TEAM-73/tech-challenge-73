import type IOrderRepository from '../../domain/repositories/IOrderRepository'
import { type HttpResponse, internalServerError, ok } from '../api/HttpResponses'
export class FindAllOrdersByCpfUseCase {
  constructor (private readonly orderRepository: IOrderRepository) { }

  async execute (cpf: string): Promise<HttpResponse> {
    try {
      const orders = await this.orderRepository.findAllOrdersByCpf(cpf)
      return ok({ isOrders: orders !== undefined })
    } catch (error) {
      return internalServerError('Fail while fetching Orders.', error)
    }
  }
}
