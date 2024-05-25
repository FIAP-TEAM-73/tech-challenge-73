import type Item from '../entities/Item'

export default interface IItemRepository {
  save: (item: Item) => Promise<string>
  findById: (id: string) => Promise<Item | undefined>
}
