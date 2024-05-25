import { notFoundError, ok } from '../../../../src/core/application/api/HttpResponses'
import UpdateItemUseCase, { type UpdateItemCommand } from '../../../../src/core/application/use-cases/UpdateItemUseCase'
import Item from '../../../../src/core/domain/entities/Item'
import ItemImage from '../../../../src/core/domain/entities/ItemImage'
import type IItemRepository from '../../../../src/core/domain/repositories/IItemRepository'

const mockItemCommand: UpdateItemCommand = {
  name: 'any_item_name',
  category: 'DESSERTS',
  price: 35.9,
  description: 'any item description',
  base64: 'any image base64'
}

const mockItemImage = [
  new ItemImage('any_item_image_id', 'item_id', 'any_base_64', undefined),
  new ItemImage('another_item_image_id', 'item_id', 'any_base_64', undefined)
]
const mockItem = new Item('item_id', 'any item name', 'BURGERS', 35.0, 'any item description', mockItemImage)

describe('Update an Item use case', () => {
  const mockItemRepository: IItemRepository = {
    save: jest.fn().mockResolvedValueOnce('item_id'),
    findById: jest.fn().mockResolvedValueOnce(mockItem),
    find: jest.fn().mockResolvedValueOnce([])
  }
  it('Should update an Item when Item exists', async () => {
    const sut = new UpdateItemUseCase(mockItemRepository)
    const result = await sut.execute('item_id', mockItemCommand)
    expect(result).toEqual(ok({ itemId: 'item_id' }))
  })
  it('Should not update an Item when Item does not exist', async () => {
    const mockConnectionNotFound: IItemRepository = {
      ...mockItemRepository,
      findById: jest.fn().mockResolvedValueOnce(undefined)
    }
    const sut = new UpdateItemUseCase(mockConnectionNotFound)
    const result = await sut.execute('item_id', mockItemCommand)
    expect(result).toEqual(notFoundError('Item with ID item_id does not exist'))
  })
})
