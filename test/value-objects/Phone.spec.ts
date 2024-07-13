import { DomainError } from '../../src/base/DomainError'
import { Phone } from '../../src/value-objects/Phone'

describe('Create a phone', () => {
  it('Should create a phone with success when its value is correct', () => {
    const phoneValue = '35999111115'
    const sut = new Phone(phoneValue)
    expect(sut.value).toBe(phoneValue)
  })
  it('Should not create a phone with success when its value is incorrect', () => {
    expect(() => new Phone('')).toThrow(new DomainError('Phone must have only numbers and 11 characteres!'))
  })
})
