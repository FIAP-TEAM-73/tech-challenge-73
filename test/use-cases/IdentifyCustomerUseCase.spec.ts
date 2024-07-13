import { internalServerError, ok } from '../../src/presenter/HttpResponses'
import { IdentifyCustomerUseCase } from '../../src/use-cases/IdentifyCustomerUseCase'
import { Customer } from '../../src/entities/Customer'
import { CPF } from '../../src/value-objects/Cpf'
import { Phone } from '../../src/value-objects/Phone'
import { type ICustomerGateway } from '../../src/interfaces/ICustomerGateway'

describe('Identify Customer', () => {
  const mockCustomerRepository: ICustomerGateway = {
    save: jest.fn(async (customer) => await Promise.resolve(customer.id)),
    findByCpf: jest.fn(async () => await Promise.resolve(new Customer('any_id', 'Any Name', new Phone('35999111115'), new CPF('12559757610'))))
  }
  it('Should identify a customer by cpf when it exists', async () => {
    const cpf = '12559757610'
    const sut = new IdentifyCustomerUseCase(mockCustomerRepository)
    const result = await sut.execute(cpf)
    expect(result).toEqual(ok({ isCustomer: true }))
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
    expect(result).toEqual(ok({ isCustomer: false }))
  })
  it('Should throw when repository throws', async () => {
    const error = new Error('Generic Repository Erro!')
    const overrideMockCustomerRepository = {
      ...mockCustomerRepository,
      findByCpf: jest.fn(async () => await Promise.reject(error))
    }
    const cpf = '12559757610'
    const sut = new IdentifyCustomerUseCase(overrideMockCustomerRepository)
    const result = await sut.execute(cpf)
    expect(result).toEqual(internalServerError('Fail while fetching a Customer.', error))
  })
})
