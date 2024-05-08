import { SaveCustomerUseCase, type CustomerRequest } from '../../../../src/core/application/use-cases/SaveCustomerUseCase'
import { DomainError } from '../../../../src/core/domain/base/DomainError'
import { type ICustomerRepository } from '../../../../src/core/domain/repositories/ICustomerRepository'
import * as uuid from 'uuid'

jest.mock('uuid')

describe('Save Customer use case', () => {
  const mockCustomerRepository: ICustomerRepository = {
    save: jest.fn(async (customer) => await Promise.resolve(customer.id))
  }

  it('Should create a customer with success', async () => {
    jest.spyOn(uuid, 'v4').mockReturnValueOnce('mocked_id')
    const sut = new SaveCustomerUseCase(mockCustomerRepository)
    const customerRequest: CustomerRequest = {
      name: 'Any Customer Name',
      phone: '35999251111',
      cpf: '12559757619'
    }
    const result = await sut.execute(customerRequest)
    expect(result).toBe('mocked_id')
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
