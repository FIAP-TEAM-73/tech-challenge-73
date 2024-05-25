import { ok } from '../../../../src/core/application/api/HttpResponses'
import SaveItemUseCase, { type SaveItemCommand } from '../../../../src/core/application/use-cases/SaveItemUseCase'
import type IItemRepository from '../../../../src/core/domain/repositories/IItemRepository'

const mockItemCommand: SaveItemCommand = {
  name: 'any_item_name',
  category: 'DESSERTS',
  price: 35.9,
  description: 'any item description',
  base64: 'any image base64'
}

describe('Save an Item use case', () => {
  const mockItemRepository: IItemRepository = {
    save: jest.fn().mockResolvedValueOnce('item_id'),
    findById: jest.fn().mockResolvedValueOnce(undefined),
    find: jest.fn().mockResolvedValueOnce([])
  }
  it('Should save an Item when the command is right', async () => {
    const sut = new SaveItemUseCase(mockItemRepository)
    const result = await sut.execute(mockItemCommand)
    expect(result).toEqual(ok({ itemId: 'item_id' }))
  })
})
