import { type HttpResponse, ok, badRequest } from '../presenters/HttpResponses'
import { type ItemPageParams } from '../interfaces/IItemGateway'
import type IItemGateway from '../interfaces/IItemGateway'
import Paginator from '../utils/Paginator'

export default class FindItemUseCase {
  constructor (private readonly itemGateway: IItemGateway) {}

  async execute (params: ItemPageParams): Promise<HttpResponse> {
    const { page = 1, size = 10, ...rest } = params
    if (+size < 1) return badRequest('Size must be greater than 0')
    if (+page < 1) return badRequest('Page must be greater than 0')
    const total = await this.itemGateway.count(rest)
    const items = await this.itemGateway.find({ ...params, page: page - 1, size })
    const pagination = new Paginator(items, +size, +page, +total)
    return ok({
      content: pagination.content,
      pageSize: size,
      page,
      totalPages: pagination.getTotalPages(),
      isFirstPage: pagination.isFirstPage(),
      isLastPage: pagination.isLastPage()
    })
  }
}
