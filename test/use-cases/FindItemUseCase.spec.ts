import { badRequest, ok } from '../../src/presenters/HttpResponses'
import FindItemUseCase from '../../src/use-cases/FindItemUseCase'
import Item from '../../src/entities/Item'
import ItemImage from '../../src/entities/ItemImage'
import type IItemGateway from '../../src/interfaces/IItemGateway'
import { type ItemPageParams } from '../../src/interfaces/IItemGateway'

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
  const mockItemGateway: IItemGateway = {
    save: jest.fn().mockResolvedValueOnce('item_id'),
    findById: jest.fn().mockResolvedValueOnce(mockItem),
    find: jest.fn().mockResolvedValueOnce([mockItem]),
    count: jest.fn().mockResolvedValueOnce(1)
  }
  it('Should return a list of items when the params match', async () => {
    const sut = new FindItemUseCase(mockItemGateway)
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
  it('Should fail when Size is lower than 1', async () => {
    const sut = new FindItemUseCase(mockItemGateway)
    const result = await sut.execute({ ...params, size: -1 })
    expect(result).toEqual(badRequest('Size must be greater than 0'))
  })
  it('Should fail when Page is lower than 1', async () => {
    const sut = new FindItemUseCase(mockItemGateway)
    const result = await sut.execute({ ...params, page: 0 })
    expect(result).toEqual(badRequest('Page must be greater than 0'))
  })
})
