import type IConnection from '../../../../core/domain/database/IConnection'
import type Item from '../../../../core/domain/entities/Item'
import type ItemImage from '../../../../core/domain/entities/ItemImage'
import type IItemRepository from '../../../../core/domain/repositories/IItemRepository'

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
    const query = 'INSERT INTO order_item(id, item_id, base64, storage_path) VALUES($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET base64=$3, storage_path=$4 RETURNING *'
    await Promise.all(pathImages.map(async ({ id, base64, storagePath }) => {
      const values = [id, itemId, base64, storagePath]
      await this.connection.query(query, values)
    }))
  }
}
