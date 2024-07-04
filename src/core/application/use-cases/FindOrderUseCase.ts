import type IOrderRepository from '../../domain/repositories/IOrderRepository'
import { type OrderPageParams } from '../../domain/repositories/IOrderRepository'
import { type HttpResponse, ok, badRequest } from '../api/HttpResponses'
import Paginator from '../utils/Paginator'
export class FindOrderUseCase {
  constructor (private readonly orderRepository: IOrderRepository) { }

  async execute (params: OrderPageParams): Promise<HttpResponse> {
    const { page = 1, size = 10, ...rest } = params
    if (+size < 1) return badRequest('Size must be greater than 0')
    if (+page < 1) return badRequest('Page must be greater than 0')
    const total = await this.orderRepository.count(rest)
    const items = await this.orderRepository.find({ ...params, page: page - 1, size })
    const pagination = new Paginator(items, +size, +page, +total)
    return ok({
      content: pagination.content.map((order) => ({ ...order, total: order.getTotal() })),
      pageSize: size,
      page,
      totalPages: pagination.getTotalPages(),
      isFirstPage: pagination.isFirstPage(),
      isLastPage: pagination.isLastPage()
    })
  }
}
