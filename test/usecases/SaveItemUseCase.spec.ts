import { ok } from '../../src/presenters/HttpResponses'
import type IItemGateway from '../../src/interfaces/IItemGateway'
import SaveItemUseCase, { type SaveItemCommand } from '../../src/usecases/SaveItemUseCase'

const mockItemCommand: SaveItemCommand = {
  name: 'any_item_name',
  category: 'DESSERTS',
  price: 35.9,
  description: 'any item description',
  base64: 'any image base64'
}

beforeAll(() => {
  jest.mock('uuid')
})

describe('Save an Item use case', () => {
  const mockItemGateway: IItemGateway = {
    save: jest.fn().mockResolvedValue('uuid'),
    findById: jest.fn().mockResolvedValueOnce(undefined),
    find: jest.fn().mockResolvedValueOnce([]),
    count: jest.fn().mockResolvedValueOnce(0)
  }
  it('Should save an Item when the command is right', async () => {
    const sut = new SaveItemUseCase(mockItemGateway)
    const result = await sut.execute(mockItemCommand)
    expect(result).toEqual(ok({ itemId: 'uuid' }))
  })
})
