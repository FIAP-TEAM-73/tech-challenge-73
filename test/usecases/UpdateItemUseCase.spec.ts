import { notFoundError, ok } from '../../src/presenters/HttpResponses'
import UpdateItemUseCase, { type UpdateItemCommand } from '../../src/usecases/UpdateItemUseCase'
import Item from '../../src/entities/Item'
import ItemImage from '../../src/entities/ItemImage'
import * as uuid from 'uuid'
import type IItemGateway from '../../src/interfaces/IItemGateway'

jest.mock('uuid')

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
  jest.spyOn(uuid, 'v4')
    .mockReturnValueOnce('item_image_id')
  const mockItemGateway: IItemGateway = {
    save: jest.fn().mockResolvedValueOnce('item_id'),
    findById: jest.fn().mockResolvedValueOnce(mockItem),
    find: jest.fn().mockResolvedValueOnce([]),
    count: jest.fn().mockResolvedValueOnce(0)
  }
  it('Should update an Item when Item exists', async () => {
    const sut = new UpdateItemUseCase(mockItemGateway)
    const result = await sut.execute('item_id', mockItemCommand)
    expect(result).toEqual(ok({ itemId: 'item_id' }))
  })
  it('Should not update an Item when Item does not exist', async () => {
    const mockConnectionNotFound: IItemGateway = {
      ...mockItemGateway,
      findById: jest.fn().mockResolvedValueOnce(undefined)
    }
    const sut = new UpdateItemUseCase(mockConnectionNotFound)
    const result = await sut.execute('item_id', mockItemCommand)
    expect(result).toEqual(notFoundError('Item with ID item_id does not exist'))
  })
})
