import ItemRepository from '../../../../../src/adapter/driven/infra/repositories/ItemRepository'
import type IConnection from '../../../../../src/core/domain/database/IConnection'
import Item from '../../../../../src/core/domain/entities/Item'
import ItemImage from '../../../../../src/core/domain/entities/ItemImage'
import { type ItemParams, type ItemPageParams } from '../../../../../src/core/domain/repositories/IItemRepository'

const mockItemImage = [
  new ItemImage('any_item_image_id', 'item_id', 'YW55X2Jhc2VfNjQ=', undefined),
  new ItemImage('another_item_image_id', 'item_id', 'YW55X2Jhc2VfNjQ=', undefined)
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
          { id: 'item_id', name: 'any item name', category: 'BURGERS', price: 35.0, description: 'any item description', is_active: false, item_image_id: 'any_item_image_id', item_id: 'item_id', base64: 'any_base_64', storage_path: undefined },
          { id: 'item_id', name: 'any item name', category: 'BURGERS', price: 35.0, description: 'any item description', is_active: true, item_image_id: 'another_item_image_id', item_id: 'item_id', base64: 'any_base_64', storage_path: undefined }
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
    it('Should not find an Item by ID when it not exists', async () => {
      const mockConnectionReturnUndefined: IConnection = {
        ...mockConnection,
        query: async (stmt: string, params: any[]) => {
          console.log({ stmt, params })
          return await Promise.resolve({
            rows: []
          })
        }
      }
      const sut = new ItemRepository(mockConnectionReturnUndefined)
      const result = await sut.findById('wrong_id')
      expect(result).toBeUndefined()
    })
  })
  describe('Find all Items', () => {
    const mockConnection: IConnection = {
      isAlive: async () => await Promise.resolve(true),
      close: async () => { },
      connect: async () => { },
      query: jest.fn()
        .mockResolvedValueOnce({
          rows: [
            { id: 'item_id', name: 'any item name', category: 'BURGERS', price: 35.0, description: 'any item description', is_active: true }
          ]
        })
        .mockResolvedValueOnce({
          rows: [
            { id: 'any_item_image_id', item_id: 'item_id', base64: 'any_base_64', storage_path: undefined },
            { id: 'another_item_image_id', item_id: 'item_id', base64: 'any_base_64', storage_path: undefined }
          ]
        })
    }
    it('Should return a paged list of items', async () => {
      const params: ItemPageParams = {
        category: 'BURGERS',
        page: 0,
        size: 1
      }
      const sut = new ItemRepository(mockConnection)
      const result = await sut.find(params)
      expect(result).toEqual([mockItem])
    })
    it('Should return empty when no Items match with the params', async () => {
      const mockConnectionEmpty: IConnection = {
        ...mockConnection,
        query: jest.fn().mockResolvedValueOnce({ rows: [] })
      }
      const params: ItemPageParams = {
        category: 'WRONG_CATEGORY',
        page: 0,
        size: 1
      }
      const sut = new ItemRepository(mockConnectionEmpty)
      const result = await sut.find(params)
      expect(result).toEqual([])
    })
  })
  describe('Count total items', () => {
    it('Should get the total number of items from the database', async () => {
      const mockConnectionEmpty: IConnection = {
        ...mockConnection,
        query: jest.fn().mockResolvedValueOnce({ rows: [{ total: 10 }] })
      }
      const params: ItemParams = {
        category: 'SIDES'
      }
      const sut = new ItemRepository(mockConnectionEmpty)
      const result = await sut.count(params)
      expect(result).toBe(10)
    })
  })
})
