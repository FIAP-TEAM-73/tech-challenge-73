import { SaveCustomerUseCase, type CustomerCommand } from '../../src/use-cases/SaveCustomerUseCase'
import { DomainError } from '../../src/entities/base/DomainError'
import { Customer } from '../../src/entities/Customer'
import * as uuid from 'uuid'
import { internalServerError, noContent } from '../../src/presenter/HttpResponses'
import { type ICustomerGateway } from '../../src/interfaces/ICustomerGateway'
import { CPF } from '../../src/entities/value-objects/Cpf'
import { Phone } from '../../src/entities/value-objects/Phone'

jest.mock('uuid')

const mockCustomerRequest: CustomerCommand = {
  name: 'Any Customer Name',
  phone: '35999251111',
  cpf: '12559757619'
}

describe('Save Customer use case', () => {
  const mockCustomerRepository: ICustomerGateway = {
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
    const mockRejectCustomerRepository: ICustomerGateway = {
      ...mockCustomerRepository,
      save: jest.fn(async () => await Promise.reject(error))
    }
    const sut = new SaveCustomerUseCase(mockRejectCustomerRepository)
    const result = await sut.execute(mockCustomerRequest)
    expect(result).toEqual(internalServerError('Fail while saving a customer.', error))
  })
})
