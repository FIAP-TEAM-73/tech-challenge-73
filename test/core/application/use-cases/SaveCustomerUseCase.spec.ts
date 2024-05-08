import { SaveCustomerUseCase, type CustomerRequest } from '../../../../src/core/application/use-cases/SaveCustomerUseCase'
import { DomainError } from '../../../../src/core/domain/base/DomainError'
import { type ICustomerRepository } from '../../../../src/core/domain/repositories/ICustomerRepository'

describe('Save Customer use case', () => {
  const mockCustomerRepository: ICustomerRepository = {
    save: jest.fn(async (customer) => await Promise.resolve(customer.id))
  }

  it('Should create a customer with success', async () => {
    const sut = new SaveCustomerUseCase(mockCustomerRepository)
    const customerRequest: CustomerRequest = {
      name: 'Any Customer Name',
      phone: '35999251111',
      cpf: '12559757619'
    }
    const result = await sut.execute(customerRequest)
    expect(result).toBe('1')
  })
  it('Should throw when repository throws', async () => {
    const mockCustomerRepository: ICustomerRepository = {
      save: jest.fn(async () => await Promise.reject(new DomainError('Generic repository error')))
    }
    const sut = new SaveCustomerUseCase(mockCustomerRepository)
    const customerRequest: CustomerRequest = {
      name: 'Any Customer Name',
      phone: '35999251111',
      cpf: '12559757619'
    }
    const result = sut.execute(customerRequest)
    await expect(result).rejects.toEqual(new Error('Fail while saving a customer.'))
  })
})