import { DomainError } from '../../src/base/DomainError'
import { Customer } from '../../src/entities/Customer'
import { CPF } from '../../src/value-objects/Cpf'
import { Phone } from '../../src/value-objects/Phone'

const mockCustomer = {
  id: 'any_id',
  name: 'Customer Name',
  phone: new Phone('35999111115'),
  cpf: new CPF('12559757680')
}

describe('Create a Customer', () => {
  it('Should create a Customer with success when all attributes are correct', () => {
    const sut = new Customer(mockCustomer.id, mockCustomer.name, mockCustomer.phone, mockCustomer.cpf)
    expect(sut.name).toBe(mockCustomer.name)
    expect(sut.phone).toBe(mockCustomer.phone)
    expect(sut.cpf).toBe(mockCustomer.cpf)
  })
  it('Should create a Customer with error when name is not provided', () => {
    expect(() => new Customer(mockCustomer.id, '', mockCustomer.phone, mockCustomer.cpf))
      .toThrow(new DomainError('Name must be greater than 3 and less than 100!'))
  })
  it('Should create a Customer with error when name is bigger than 100', () => {
    const wrongName = 'Barnaby Marmaduke Aloysius Benjy Cobweb Dartagnan Egbert Felix Gaspar Humbert Ignatius Jayden Kasper Leroy'
    expect(() => new Customer(mockCustomer.id, wrongName, mockCustomer.phone, mockCustomer.cpf))
      .toThrow(new DomainError('Name must be greater than 3 and less than 100!'))
  })
})
