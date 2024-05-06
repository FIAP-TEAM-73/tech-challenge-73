import { DomainError } from '../../../../src/core/domain/base/DomainError'
import { Phone } from '../../../../src/core/domain/value-objects/Phone'

describe('Create a phone', () => {
  it('Should create a phone with success when its value is correct', () => {
    const sut = new Phone('35999111115')
    expect(sut.value).toBe('35999111115')
  })
  it('Should not create a phone with success when its value is incorrect', () => {
    expect(() => new Phone('')).toThrow(new DomainError('Phone must have only numbers and 11 characteres!'))
  })
})
