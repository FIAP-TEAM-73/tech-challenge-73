import type Item from '../entities/Item'

export type ItemParams = Partial<Record<keyof Omit<Item, 'description' | 'pathImages'>, string>> & { page: number, size: number }
export default interface IItemRepository {
  save: (item: Item) => Promise<string>
  findById: (id: string) => Promise<Item | undefined>
  find: (params: ItemParams) => Promise<Item[]>
}
