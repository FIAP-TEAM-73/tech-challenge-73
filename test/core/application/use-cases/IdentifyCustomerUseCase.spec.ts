import { IdentifyCustomerUseCase } from '../../../../src/core/application/use-cases/IdentifyCustomerUseCase'
import { DomainError } from '../../../../src/core/domain/base/DomainError'
import { Customer } from '../../../../src/core/domain/entities/Customer'
import { type ICustomerRepository } from '../../../../src/core/domain/repositories/ICustomerRepository'
import { CPF } from '../../../../src/core/domain/value-objects/Cpf'
import { Phone } from '../../../../src/core/domain/value-objects/Phone'

describe('Identify Customer', () => {
  const mockCustomerRepository: ICustomerRepository = {
    save: jest.fn(async (customer) => await Promise.resolve(customer.id)),
    findByCpf: jest.fn(async () => await Promise.resolve(new Customer('any_id', 'Any Name', new Phone('35999111115'), new CPF('12559757610'))))
  }
  it('Should identify a customer by cpf when it exists', async () => {
    const cpf = '12559757610'
    const sut = new IdentifyCustomerUseCase(mockCustomerRepository)
    const result = await sut.execute(cpf)
    expect(result).toBe(true)
  })
  it('Should not identify a customer by cpf when it does not exist', async () => {
    const overrideMockCustomerRepository = {
      ...mockCustomerRepository,
      findByCpf: jest.fn(async () => {
        return undefined
      })
    }
    const cpf = '12559757610'
    const sut = new IdentifyCustomerUseCase(overrideMockCustomerRepository)
    const result = await sut.execute(cpf)
    expect(result).toBe(false)
  })
  it('Should throw when repository throws', async () => {
    const overrideMockCustomerRepository = {
      ...mockCustomerRepository,
      findByCpf: jest.fn(async () => await Promise.reject(new Error('Generic Repository Erro!')))
    }
    const cpf = '12559757610'
    const sut = new IdentifyCustomerUseCase(overrideMockCustomerRepository)
    const result = sut.execute(cpf)
    await expect(result).rejects.toEqual(new DomainError('Fail while fetching a Customer.'))
  })
})
