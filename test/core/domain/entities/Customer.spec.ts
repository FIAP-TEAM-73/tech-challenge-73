import { DomainError } from '../../../../src/core/domain/base/DomainError'
import { Customer } from '../../../../src/core/domain/entities/Customer'

const mockCustomer = {
  name: 'Customer Name',
  phone: '35999111115',
  cpf: '12559757680'
}

describe('Create a Customer', () => {
  it('Should create a Customer with success when all attributes are correct', () => {
    const sut = new Customer(mockCustomer.name, mockCustomer.phone, mockCustomer.cpf)
    expect(sut.name).toBe(mockCustomer.name)
    expect(sut.phone).toBe(mockCustomer.phone)
    expect(sut.cpf).toBe(mockCustomer.cpf)
  })
  it('Should create a Customer with error when name is not provided', () => {
    expect(() => new Customer('', mockCustomer.phone, mockCustomer.cpf))
      .toThrow(new DomainError('Name must be greater than 3 and less than 100!'))
  })
})
