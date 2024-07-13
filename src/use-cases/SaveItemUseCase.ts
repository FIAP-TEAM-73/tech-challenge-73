import Item, { type ItemCategory } from '../entities/Item'
import ItemImage from '../entities/ItemImage'
import { type HttpResponse, ok } from '../presenter/HttpResponses'
import { v4 as uuidv4 } from 'uuid'
import type IItemGateway from '../interfaces/IItemGateway'
export interface SaveItemCommand {
  name: string
  category: ItemCategory
  description: string
  price: number
  base64: string
}

export default class SaveItemUseCase {
  constructor (private readonly itemGateway: IItemGateway) {}

  async execute (command: SaveItemCommand): Promise<HttpResponse> {
    const itemId = uuidv4()
    const itemImageId = uuidv4()
    const itemImage = new ItemImage(itemImageId, itemId, command.base64, undefined)
    const item = new Item(itemId, command.name, command.category, command.price, command.description, [itemImage])
    const result = await this.itemGateway.save(item)
    return ok({ itemId: result })
  }
}
