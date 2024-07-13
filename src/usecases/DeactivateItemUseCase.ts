import { type HttpResponse, notFoundError, noContent } from '../presenters/HttpResponses'
import type IItemGateway from '../interfaces/IItemGateway'

export default class DeactivateItemUseCase {
  constructor (private readonly itemGateway: IItemGateway) {}

  async execute (itemId: string): Promise<HttpResponse> {
    const item = await this.itemGateway.findById(itemId)
    if (item === undefined) return notFoundError(`Item with ID ${itemId} does not exist`)
    await this.itemGateway.save(item.deactivate())
    return noContent()
  }
}
