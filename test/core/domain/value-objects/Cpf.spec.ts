import { CPF } from '../../../../src/core/domain/value-objects/Cpf'

describe('Create a CPF', () => {
  it('Should create a CPF when its value is valid', () => {
    const sut = new CPF('any')
    expect(sut.value).toBe('any')
  })
})
