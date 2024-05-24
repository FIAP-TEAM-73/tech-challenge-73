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
})
