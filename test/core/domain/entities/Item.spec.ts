import { DomainError } from '../../../../src/core/domain/base/DomainError'
import Item from '../../../../src/core/domain/entities/Item'

describe('Create an Item', () => {
  it('Should create an Item when every attribute is right', () => {
    const sut = new Item('ítem_id', 'any item name', 'burguer', 35.0, 'any item description', ['any image path'])
    expect(sut.id).toBe('ítem_id')
    expect(sut.name).toBe('any item name')
    expect(sut.category).toBe('burguer')
    expect(sut.price).toBe(35.0)
    expect(sut.description).toBe('any item description')
    expect(sut.pathImages).toEqual(['any image path'])
  })
  it('Should not create an Item when name is invalid', () => {
    expect(() => new Item('ítem_id', '', 'burguer', 35.0, 'any item description', ['any image path']))
      .toThrow(new DomainError('Name must be greater than 3 and less than 100!'))
  })
})
