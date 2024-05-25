import { ok } from '../../../../src/core/application/api/HttpResponses'
import FindItemUseCase from '../../../../src/core/application/use-cases/FindItemUseCase'
import Item from '../../../../src/core/domain/entities/Item'
import ItemImage from '../../../../src/core/domain/entities/ItemImage'
import type IItemRepository from '../../../../src/core/domain/repositories/IItemRepository'
import { type ItemPageParams } from '../../../../src/core/domain/repositories/IItemRepository'

const params: ItemPageParams = {
  page: 1,
  size: 10,
  category: 'BURGERS'
}

const mockItemImage = [
  new ItemImage('any_item_image_id', 'item_id', 'any_base_64', undefined),
  new ItemImage('another_item_image_id', 'item_id', 'any_base_64', undefined)
]
const mockItem = new Item('item_id', 'any item name', 'BURGERS', 35.0, 'any item description', mockItemImage)

describe('Find an Item use case', () => {
  const mockItemRepository: IItemRepository = {
    save: jest.fn().mockResolvedValueOnce('item_id'),
    findById: jest.fn().mockResolvedValueOnce(mockItem),
    find: jest.fn().mockResolvedValueOnce([mockItem]),
    count: jest.fn().mockResolvedValueOnce(1)
  }
  it('Should return a list of items when the params match', async () => {
    const sut = new FindItemUseCase(mockItemRepository)
    const result = await sut.execute(params)
    expect(result).toEqual(ok({
      isFirstPage: true,
      isLastPage: true,
      totalPages: 1,
      pageSize: 10,
      page: 1,
      content: [mockItem]
    }))
  })
})
