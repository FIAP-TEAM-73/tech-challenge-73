import { DomainError } from '../../../../src/core/domain/base/DomainError'
import { CPF } from '../../../../src/core/domain/value-objects/Cpf'

describe('Create a CPF', () => {
  it('Should create a CPF when its value is valid', () => {
    const sut = new CPF('48720041241')
    expect(sut.value).toBe('48720041241')
  })
  it('Should not create a CPF when its value is invalid', () => {
    expect(() => new CPF('')).toThrow(new DomainError('Cpf must have only numbers and 11 characteres!'))
  })
})
