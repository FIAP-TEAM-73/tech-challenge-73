import { noContent, notFoundError } from '../../src/presenter/HttpResponses'
import DeactivateItemUseCase from '../../src/use-cases/DeactivateItemUseCase'
import Item from '../../src/entities/Item'
import ItemImage from '../../src/entities/ItemImage'
import type IItemGateway from '../../src/interfaces/IItemGateway'

const mockItemImage = [
  new ItemImage('any_item_image_id', 'item_id', 'any_base_64', undefined),
  new ItemImage('another_item_image_id', 'item_id', 'any_base_64', undefined)
]
const mockItem = new Item('item_id', 'any item name', 'BURGERS', 35.0, 'any item description', mockItemImage)

describe('Deactivate an Item use case', () => {
  const mockItemRepository: IItemGateway = {
    save: jest.fn().mockResolvedValueOnce('item_id'),
    findById: jest.fn().mockResolvedValueOnce(mockItem),
    find: jest.fn().mockResolvedValueOnce([]),
    count: jest.fn().mockResolvedValueOnce(0)
  }
  it('Should deactivate an Item when Item exists', async () => {
    const sut = new DeactivateItemUseCase(mockItemRepository)
    const result = await sut.execute('item_id')
    expect(result).toEqual(noContent())
  })
  it('Should not deactivate an Item when Item does not exist', async () => {
    const mockConnectionNotFound: IItemGateway = {
      ...mockItemRepository,
      findById: jest.fn().mockResolvedValueOnce(undefined)
    }
    const sut = new DeactivateItemUseCase(mockConnectionNotFound)
    const result = await sut.execute('item_id')
    expect(result).toEqual(notFoundError('Item with ID item_id does not exist'))
  })
})
