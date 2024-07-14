import { DomainError } from '../../src/entities/base/DomainError'
import Item from '../../src/entities/Item'
import ItemImage from '../../src/entities/ItemImage'

/* eslint-disable @typescript-eslint/no-unsafe-argument */
const mockItemImage = new ItemImage('any_item_image_id', 'any_item_id', 'any_base64', undefined)

describe('Create an Item', () => {
  it('Should create an Item when every attribute is right', () => {
    const sut = new Item('ítem_id', 'any item name', 'BURGERS', 35.0, 'any item description', [mockItemImage])
    expect(sut.id).toBe('ítem_id')
    expect(sut.name).toBe('any item name')
    expect(sut.category).toBe('BURGERS')
    expect(sut.price).toBe(35.0)
    expect(sut.description).toBe('any item description')
    expect(sut.pathImages).toEqual([mockItemImage])
  })
  it('Should not create an Item when name is invalid', () => {
    expect(() => new Item('ítem_id', '', 'BURGERS', 35.0, 'any item description', [mockItemImage]))
      .toThrow(new DomainError('Name must be greater than 3 and less than 100!'))
  })
  it('Should not create an Item when category does not exist', () => {
    expect(() => new Item('ítem_id', 'any item name', 'WRONG_MEAL' as any, 35.0, 'any item description', [mockItemImage]))
      .toThrow(new DomainError('Category \'WRONG_MEAL\' is invalid!'))
  })
  it('Should not create an Item when price is invalid', () => {
    expect(() => new Item('ítem_id', 'any item name', 'DESSERTS', -1, 'any item description', [mockItemImage]))
      .toThrow(new DomainError('Price must be greater than 0'))
  })
  it('Should not create an Item when description is invalid', () => {
    expect(() => new Item('ítem_id', 'any item name', 'DESSERTS', 36.0, '', [mockItemImage]))
      .toThrow(new DomainError('Description must be greater than 3 and less than 255!'))
  })
  it('Should deactivate an Item', () => {
    const sut = new Item('ítem_id', 'any item name', 'BURGERS', 35.0, 'any item description', [mockItemImage])
    const deactivatedItem = sut.deactivate()
    expect(deactivatedItem.isActive).toBe(false)
  })
  it('Should activate an Item', () => {
    const sut = new Item('ítem_id', 'any item name', 'BURGERS', 35.0, 'any item description', [mockItemImage], false)
    const activatedItem = sut.activate()
    expect(activatedItem.isActive).toBe(true)
  })
})
