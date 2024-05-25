import type IItemRepository from '../../domain/repositories/IItemRepository'
import { type HttpResponse, notFoundError, noContent } from '../api/HttpResponses'

export default class DeactivateItemUseCase {
  constructor (private readonly itemRepository: IItemRepository) {}

  async execute (itemId: string): Promise<HttpResponse> {
    const item = await this.itemRepository.findById(itemId)
    if (item === undefined) return notFoundError(`Item with ID ${itemId} does not exist`)
    await this.itemRepository.save(item.deactivate())
    return noContent()
  }
}
