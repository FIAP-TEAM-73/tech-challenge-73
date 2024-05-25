import ItemRepository from '../../../../../src/adapter/driven/infra/repositories/ItemRepository'
import type IConnection from '../../../../../src/core/domain/database/IConnection'
import Item from '../../../../../src/core/domain/entities/Item'
import ItemImage from '../../../../../src/core/domain/entities/ItemImage'

const mockItemImage = [
  new ItemImage('any_item_image_id', 'item_id', 'any_base_64', undefined),
  new ItemImage('another_item_image_id', 'item_id', 'any_base_64', undefined)
]
const mockItem = new Item('item_id', 'any item name', 'BURGERS', 35.0, 'any item description', mockItemImage)

describe('Item Repository', () => {
  const mockConnection: IConnection = {
    isAlive: async () => await Promise.resolve(true),
    close: async () => { },
    connect: async () => { },
    query: async (stmt: string, params: any[]) => {
      console.log({ stmt, params })
      return await Promise.resolve({
        rows: [
          { id: 'item_id', name: 'any item name', category: 'BURGERS', price: 35.0, description: 'any item description', item_image_id: 'any_item_image_id', item_id: 'item_id', base64: 'any_base_64', storage_path: undefined },
          { id: 'item_id', name: 'any item name', category: 'BURGERS', price: 35.0, description: 'any item description', item_image_id: 'another_item_image_id', item_id: 'item_id', base64: 'any_base_64', storage_path: undefined }
        ]
      })
    }
  }
  describe('Create an Item', () => {
    it('Should create a item with sucess when all attributes are correct', async () => {
      const sut = new ItemRepository(mockConnection)
      const result = await sut.save(mockItem)
      expect(result).toBe('item_id')
    })
  })
  describe('Find an Item by ID', () => {
    it('Should find an Item by ID when it exists', async () => {
      const sut = new ItemRepository(mockConnection)
      const result = await sut.findById('item_id')
      expect(result).toEqual(mockItem)
    })
  })
})
