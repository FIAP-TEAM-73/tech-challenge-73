import { SaveCustomerUseCase, type CustomerCommand } from '../../../../src/core/application/use-cases/SaveCustomerUseCase'
import { DomainError } from '../../../../src/core/domain/base/DomainError'
import { Customer } from '../../../../src/core/domain/entities/Customer'
import { type ICustomerRepository } from '../../../../src/core/domain/repositories/ICustomerRepository'
import * as uuid from 'uuid'
import { CPF } from '../../../../src/core/domain/value-objects/Cpf'
import { Phone } from '../../../../src/core/domain/value-objects/Phone'
import { internalServerError, noContent } from '../../../../src/core/application/api/HttpResponses'

jest.mock('uuid')

const mockCustomerRequest: CustomerCommand = {
  name: 'Any Customer Name',
  phone: '35999251111',
  cpf: '12559757619'
}

describe('Save Customer use case', () => {
  const mockCustomerRepository: ICustomerRepository = {
    save: jest.fn(async (customer) => await Promise.resolve(customer.id)),
    findByCpf: jest.fn(async () => await Promise.resolve(new Customer('any_id', 'Any Name', new Phone('35999111115'), new CPF('12559757610'))))
  }

  it('Should create a customer with success', async () => {
    jest.spyOn(uuid, 'v4').mockReturnValueOnce('mocked_id')
    const sut = new SaveCustomerUseCase(mockCustomerRepository)
    const result = await sut.execute(mockCustomerRequest)
    expect(result).toEqual(noContent())
  })
  it('Should return internal server error when repository throws', async () => {
    const error = new DomainError('Generic repository error')
    const mockRejectCustomerRepository: ICustomerRepository = {
      ...mockCustomerRepository,
      save: jest.fn(async () => await Promise.reject(error))
    }
    const sut = new SaveCustomerUseCase(mockRejectCustomerRepository)
    const result = await sut.execute(mockCustomerRequest)
    expect(result).toEqual(internalServerError('Fail while saving a customer.', error))
  })
})
