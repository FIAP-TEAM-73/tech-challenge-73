import type Item from '../entities/Item'

export type ItemParams = Partial<Record<keyof Omit<Item, 'description' | 'pathImages' | 'deactivate' | 'activate'>, string>>
export type ItemPageParams = ItemParams & { page: number, size: number }
export default interface IItemGateway {
  save: (item: Item) => Promise<string>
  findById: (id: string) => Promise<Item | undefined>
  find: (params: ItemPageParams) => Promise<Item[]>
  count: (params: ItemParams) => Promise<number>
}
