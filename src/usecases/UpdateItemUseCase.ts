import Item, { type ItemCategory } from '../entities/Item'
import ItemImage from '../entities/ItemImage'
import { type HttpResponse, ok, notFoundError } from '../presenters/HttpResponses'
import { v4 as uuidv4 } from 'uuid'
import type IItemGateway from '../interfaces/IItemGateway'
export interface UpdateItemCommand {
  name: string | undefined
  category: ItemCategory | undefined
  description: string | undefined
  price: number | undefined
  base64: string | undefined
}

export default class UpdateItemUseCase {
  constructor (private readonly itemGateway: IItemGateway) {}

  async execute (itemId: string, command: UpdateItemCommand): Promise<HttpResponse> {
    const item = await this.itemGateway.findById(itemId)
    if (item === undefined) return notFoundError(`Item with ID ${itemId} does not exist`)
    const { name = item.name, category = item.category, description = item.description, price = item.price, base64 } = command
    if (base64 === undefined) {
      const updatedItem = new Item(itemId, name, category, price, description, item.pathImages)
      const result = await this.itemGateway.save(updatedItem)
      return ok({ itemId: result })
    }
    const itemImageId = uuidv4()
    const itemImage = new ItemImage(itemImageId, itemId, command.base64, undefined)
    const updatedItem = new Item(itemId, name, category, price, description, [...item.pathImages, itemImage])
    const result = await this.itemGateway.save(updatedItem)
    return ok({ itemId: result })
  }
}
