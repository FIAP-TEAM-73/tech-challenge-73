import type IItemRepository from '../../domain/repositories/IItemRepository'
import { type ItemPageParams } from '../../domain/repositories/IItemRepository'
import { type HttpResponse, ok } from '../api/HttpResponses'
import Paginator from '../utils/Paginator'

export default class FindItemUseCase {
  constructor (private readonly itemRepository: IItemRepository) {}

  async execute (params: ItemPageParams): Promise<HttpResponse> {
    const { page, size, ...rest } = params
    const total = await this.itemRepository.count(rest)
    const items = await this.itemRepository.find(params)
    const pagination = new Paginator(items, size, page, total)
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
