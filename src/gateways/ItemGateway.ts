import type IConnection from '../interfaces/IConnection'
import Item from '../entities/Item'
import { type ItemCategory } from '../entities/Item'
import ItemImage from '../entities/ItemImage'
import { type ItemPageParams, type ItemParams } from '../interfaces/IItemGateway'
import type IItemGateway from '../interfaces/IItemGateway'

interface ItemRow {
  id: string
  name: string
  category: ItemCategory
  price: number
  description: string
  is_active: boolean
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

export default class ItemGateway implements IItemGateway {
  constructor (private readonly connection: IConnection) {}

  async save (item: Item): Promise<string> {
    const query = 'INSERT INTO "item"(id, name, category, price, description, is_active) VALUES($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO UPDATE SET name=$2, category=$3, price=$4, description=$5, is_active=$6 RETURNING *'
    const { id, name, category, price, description, pathImages, isActive } = item
    const values = [id, name, category, price, description, isActive ? 1 : 0]
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
    SELECT i.*, ii.id as item_image_id, ii.base64, ii.storage_path FROM "item" i
    JOIN item_image ii ON ii.item_id = i.id
    WHERE i.id = $1
    `
    const result = await this.connection.query(query, [id])
    if (result.rows.length === 0) return undefined
    return result.rows.reduce((acc: Item | undefined, row: ItemRow) => {
      const { id, name, category, description, is_active: isActive, price, item_image_id: itemImageId, base64, storage_path: storagePath } = row
      const itemImage = new ItemImage(itemImageId, id, Buffer.from(base64).toString('base64'), storagePath)
      if (acc === undefined) {
        return new Item(id, name, category, price, description, [itemImage], isActive)
      }
      return new Item(acc.id, acc.name, acc.category, acc.price, acc.description, [...acc.pathImages, itemImage], isActive)
    }, undefined)
  }

  async find (params: ItemPageParams): Promise<Item[]> {
    const query = `
    SELECT * FROM "item" 
    WHERE 1 = 1
    AND (id = $1 OR $1 is null)
    AND (name = $2 OR $2 is null)
    AND (category = $3 OR $3 is null)
    AND (price = $4 OR $4 is null)
    AND is_active = $5
    LIMIT $6
    OFFSET $7
    `
    const { page, size, category, id, name, price, isActive = true } = params
    const result = await this.connection.query(query, [id, name, category, price, isActive, size, (size * page)])
    if (result.rows.length === 0) return []
    return await Promise.all(result.rows.map(async (row: ItemRow) => {
      const { id, name, category, description, price, is_active: isActive } = row
      const pathImages = await this.findItemImageByItemId(id)
      return new Item(id, name, category, price, description, pathImages, isActive)
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
      return new ItemImage(id, itemId, Buffer.from(base64).toString('base64'), storagePath)
    })
  }

  async count (params: ItemParams): Promise<number> {
    const query = `
    SELECT COUNT(*) as "total" FROM "item" 
    WHERE 1 = 1
    AND (id = $1 OR $1 is null)
    AND (name = $2 OR $2 is null)
    AND (category = $3 OR $3 is null)
    AND (price = $4 OR $4 is null)
    AND is_active = $5
    `
    const { category, id, name, price, isActive = true } = params
    const result = await this.connection.query(query, [id, name, category, price, isActive])
    if (result.rows.length === 0) return 0
    return result.rows[0].total
  }
}
