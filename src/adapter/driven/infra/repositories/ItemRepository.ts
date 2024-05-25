import type IConnection from '../../../../core/domain/database/IConnection'
import Item from '../../../../core/domain/entities/Item'
import { type ItemCategory } from '../../../../core/domain/entities/Item'
import ItemImage from '../../../../core/domain/entities/ItemImage'
import type IItemRepository from '../../../../core/domain/repositories/IItemRepository'
import { type ItemParams } from '../../../../core/domain/repositories/IItemRepository'

interface ItemRow {
  id: string
  name: string
  category: ItemCategory
  price: number
  description: string
  item_image_id: string
  base64: string
  storage_path: string
}

interface ItemImageRow {
  id: string
  item_id: string
  base64: string
  storage_path: string
}

export default class ItemRepository implements IItemRepository {
  constructor (private readonly connection: IConnection) {}

  async save (item: Item): Promise<string> {
    const query = 'INSERT INTO "item"(id, name, category, price, description) VALUES($1, $2, $3, $4, $5) ON CONFLICT (id) DO UPDATE SET name=$2, category=$3, price=$4, description=$5 RETURNING *'
    const { id, name, category, price, description, pathImages } = item
    const values = [id, name, category, price, description]
    const result = await this.connection.query(query, values)
    const itemId: string = result.rows[0].id
    await this.saveItemImage(itemId, pathImages)
    return itemId
  }

  private async saveItemImage (itemId: string, pathImages: ItemImage[]): Promise<void> {
    const query = 'INSERT INTO item_image(id, item_id, base64, storage_path) VALUES($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET base64=$3, storage_path=$4 RETURNING *'
    await Promise.all(pathImages.map(async ({ id, base64, storagePath }) => {
      const values = [id, itemId, base64, storagePath]
      await this.connection.query(query, values)
    }))
  }

  async findById (id: string): Promise<Item | undefined> {
    const query = `
    SELECT * FROM "item" i
    JOIN item_image ii ON ii.item_id = i.id
    WHERE i.id = $1
    `
    const result = await this.connection.query(query, [id])
    if (result.rows.length === 0) return undefined
    return result.rows.reduce((acc: Item | undefined, row: ItemRow) => {
      const { id, name, category, description, price, item_image_id: itemImageId, base64, storage_path: storagePath } = row
      const itemImage = new ItemImage(itemImageId, id, base64, storagePath)
      if (acc === undefined) {
        return new Item(id, name, category, price, description, [itemImage])
      }
      return new Item(acc.id, acc.name, acc.category, acc.price, acc.description, [...acc.pathImages, itemImage])
    }, undefined)
  }

  async find (params: ItemParams): Promise<Item[]> {
    const query = `
    SELECT * FROM "item" 
    WHERE 1 = 1
    AND (id = $1 OR null = $1)
    AND (name = $2 OR null = $2)
    AND (category = $3 OR null = $3)
    AND (price = $4 OR null = $4)
    LIMIT $5
    OFFSET $6
    `
    const { page, size, category, id, name, price } = params
    const result = await this.connection.query(query, [id, name, category, price, size, (size * page)])
    if (result.rows.length === 0) return []
    return await Promise.all(result.rows.map(async (row: ItemRow) => {
      const { id, name, category, description, price } = row
      const pathImages = await this.findItemImageByItemId(id)
      return new Item(id, name, category, price, description, pathImages)
    }))
  }

  private async findItemImageByItemId (itemId: string): Promise<ItemImage[]> {
    const query = `
    SELECT * FROM item_image
    WHERE item_id = $1
    LIMIT 5
    OFFSET 0
    `
    const result = await this.connection.query(query, [itemId])
    if (result.rows.length === 0) return []
    return result.rows.map((row: ItemImageRow) => {
      const { id, base64, storage_path: storagePath } = row
      return new ItemImage(id, itemId, base64, storagePath)
    })
  }
}
