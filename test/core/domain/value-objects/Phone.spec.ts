import { Phone } from '../../../../src/core/domain/value-objects/Phone'

describe('Create a phone', () => {
  it('Should create a phone with success when its value is correct', () => {
    const sut = new Phone('any')
    expect(sut.value).toBe('any')
  })
})
