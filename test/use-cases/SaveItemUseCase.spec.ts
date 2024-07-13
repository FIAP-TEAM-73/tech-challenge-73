import { ok } from '../../src/presenters/HttpResponses'
import type IItemGateway from '../../src/interfaces/IItemGateway'
import SaveItemUseCase, { type SaveItemCommand } from '../../src/use-cases/SaveItemUseCase'
import * as uuid from 'uuid'

jest.mock('uuid')

const mockItemCommand: SaveItemCommand = {
  name: 'any_item_name',
  category: 'DESSERTS',
  price: 35.9,
  description: 'any item description',
  base64: 'any image base64'
}

describe('Save an Item use case', () => {
  jest.spyOn(uuid, 'v4')
    .mockReturnValueOnce('item_id')
    .mockReturnValueOnce('item_image_id')
  const mockItemGateway: IItemGateway = {
    save: jest.fn().mockResolvedValueOnce('item_id'),
    findById: jest.fn().mockResolvedValueOnce(undefined),
    find: jest.fn().mockResolvedValueOnce([]),
    count: jest.fn().mockResolvedValueOnce(0)
  }
  it('Should save an Item when the command is right', async () => {
    const sut = new SaveItemUseCase(mockItemGateway)
    const result = await sut.execute(mockItemCommand)
    expect(result).toEqual(ok({ itemId: 'item_id' }))
  })
})
