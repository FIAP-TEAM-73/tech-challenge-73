import CustomerInMemoryGateway from '../../src/gateways/CustomerInMemoryGateway'
import { Customer } from '../../src/entities/Customer'
import { CPF } from '../../src/entities/value-objects/Cpf'
import { Phone } from '../../src/entities/value-objects/Phone'

const mockCustomer = new Customer('any_id', 'Any Name', new Phone('35999111115'), new CPF('12559757610'))

describe('Customer In Memory Gateway', () => {
  describe('Create a customer', () => {
    it('Should save a customer in memory with success when every data was correct provided', async () => {
      const sut = new CustomerInMemoryGateway()
      const result = await sut.save(mockCustomer)
      expect(result).toBe('any_id')
    })
  })
  describe('Find a customer by CPF', () => {
    it('Should find a customer by CPF when it exists', async () => {
      const sut = new CustomerInMemoryGateway()
      await sut.save(mockCustomer)
      const customer = await sut.findByCpf('12559757610')
      expect(customer).toEqual(mockCustomer)
    })
    it('Should not find a customer by CPF when it does not exist', async () => {
      const sut = new CustomerInMemoryGateway()
      await sut.save(mockCustomer)
      const customer = await sut.findByCpf('wrong_cpf')
      expect(customer).toBeUndefined()
    })
  })
})
