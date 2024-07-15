import ItemImage from '../../src/entities/ItemImage'

describe('Create Item image', () => {
  it('Should create Item Image with success when all attributes are valid', () => {
    const sut = new ItemImage('any_item_image_id', 'any_item_id', 'any_base64', 'any_storage_path')
    expect(sut.id).toBe('any_item_image_id')
    expect(sut.itemId).toBe('any_item_id')
    expect(sut.base64).toBe('any_base64')
    expect(sut.storagePath).toBe('any_storage_path')
  })
  it('Should not create an item when storagePath and base64 are invalids', () => {
    expect(() => new ItemImage('any_item_image_id', 'any_item_id', undefined, undefined))
      .toThrow('One of the following values must be valid. [\'base64\', \'storagePath\']')
  })
  it('Should create an item when base64 is valid', () => {
    const sut = new ItemImage('any_item_image_id', 'any_item_id', 'any_base64', undefined)
    expect(sut.id).toBe('any_item_image_id')
    expect(sut.itemId).toBe('any_item_id')
    expect(sut.base64).toBe('any_base64')
    expect(sut.storagePath).toBeUndefined()
  })
  it('Should create an item when base64 is valid', () => {
    const sut = new ItemImage('any_item_image_id', 'any_item_id', undefined, 'any_storage_path')
    expect(sut.id).toBe('any_item_image_id')
    expect(sut.itemId).toBe('any_item_id')
    expect(sut.storagePath).toBe('any_storage_path')
    expect(sut.base64).toBeUndefined()
  })
})
