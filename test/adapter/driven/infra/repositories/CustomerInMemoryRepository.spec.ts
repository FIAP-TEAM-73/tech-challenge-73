import CustomerInMemoryRepository from '../../../../../src/adapter/driven/infra/repositories/CustomerInMemoryRepository'
import { Customer } from '../../../../../src/core/domain/entities/Customer'
import { CPF } from '../../../../../src/core/domain/value-objects/Cpf'
import { Phone } from '../../../../../src/core/domain/value-objects/Phone'

describe('Create Customer in memory', () => {
  it('Should save a user in memory with success when every data was correct provided', async () => {
    const sut = new CustomerInMemoryRepository()
    const customer = new Customer('any_id', 'Any Name', new Phone('35999111115'), new CPF('12559757610'))
    const result = await sut.save(customer)
    expect(result).toBe('any_id')
  })
})
