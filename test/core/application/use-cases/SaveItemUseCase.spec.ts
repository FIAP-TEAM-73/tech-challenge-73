import { ok } from '../../../../src/core/application/api/HttpResponses'
import SaveItemUseCase, { type SaveItemCommand } from '../../../../src/core/application/use-cases/SaveItemUseCase'
import type IItemRepository from '../../../../src/core/domain/repositories/IItemRepository'
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
  const mockItemRepository: IItemRepository = {
    save: jest.fn().mockResolvedValueOnce('item_id'),
    findById: jest.fn().mockResolvedValueOnce(undefined),
    find: jest.fn().mockResolvedValueOnce([]),
    count: jest.fn().mockResolvedValueOnce(0)
  }
  it('Should save an Item when the command is right', async () => {
    const sut = new SaveItemUseCase(mockItemRepository)
    const result = await sut.execute(mockItemCommand)
    expect(result).toEqual(ok({ itemId: 'item_id' }))
  })
})