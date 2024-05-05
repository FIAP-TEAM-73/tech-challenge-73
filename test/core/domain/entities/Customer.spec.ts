import { Customer } from '../../../../src/core/domain/entities/Customer'

describe('Create a Customer', () => {
  it('Should create a Customer with success when all attributes are correct', () => {
    const sut = new Customer('first_name', 'last_name', '35999111115', '12559757680')
    expect(sut.name).toBe('first_name last_name')
    expect(sut.phone).toBe('35999111115')
    expect(sut.cpf).toBe('12559757680')
  })
})
