import Item, { type ItemCategory } from '../../domain/entities/Item'
import ItemImage from '../../domain/entities/ItemImage'
import type IItemRepository from '../../domain/repositories/IItemRepository'
import { type HttpResponse, ok } from '../api/HttpResponses'
import { v4 as uuidv4 } from 'uuid'
export interface SaveItemCommand {
  name: string
  category: ItemCategory
  description: string
  price: number
  base64: string
}

export default class SaveItemUseCase {
  constructor (private readonly itemRepository: IItemRepository) {}

  async execute (command: SaveItemCommand): Promise<HttpResponse> {
    const itemId = uuidv4()
    const itemImageId = uuidv4()
    const itemImage = new ItemImage(itemImageId, itemId, command.base64, undefined)
    const item = new Item(itemId, command.name, command.category, command.price, command.description, [itemImage])
    const result = await this.itemRepository.save(item)
    return ok({ itemId: result })
  }
}
