import { internalServerError, ok } from '../../src/presenters/HttpResponses'
import { IdentifyCustomerUseCase } from '../../src/usecases/IdentifyCustomerUseCase'
import { Customer } from '../../src/entities/Customer'
import { type ICustomerGateway } from '../../src/interfaces/ICustomerGateway'
import { CPF } from '../../src/entities/value-objects/Cpf'
import { Phone } from '../../src/entities/value-objects/Phone'

describe('Identify Customer', () => {
  const mockCustomerGateway: ICustomerGateway = {
    save: jest.fn(async (customer) => await Promise.resolve(customer.id)),
    findByCpf: jest.fn(async () => await Promise.resolve(new Customer('any_id', 'Any Name', new Phone('35999111115'), new CPF('12559757610'))))
  }
  it('Should identify a customer by cpf when it exists', async () => {
    const cpf = '12559757610'
    const sut = new IdentifyCustomerUseCase(mockCustomerGateway)
    const result = await sut.execute(cpf)
    expect(result).toEqual(ok({ isCustomer: true }))
  })
  it('Should not identify a customer by cpf when it does not exist', async () => {
    const overrideMockCustomerGateway = {
      ...mockCustomerGateway,
      findByCpf: jest.fn(async () => {
        return undefined
      })
    }
    const cpf = '12559757610'
    const sut = new IdentifyCustomerUseCase(overrideMockCustomerGateway)
    const result = await sut.execute(cpf)
    expect(result).toEqual(ok({ isCustomer: false }))
  })
  it('Should throw when Gateway throws', async () => {
    const error = new Error('Generic Gateway Erro!')
    const overrideMockCustomerGateway = {
      ...mockCustomerGateway,
      findByCpf: jest.fn(async () => await Promise.reject(error))
    }
    const cpf = '12559757610'
    const sut = new IdentifyCustomerUseCase(overrideMockCustomerGateway)
    const result = await sut.execute(cpf)
    expect(result).toEqual(internalServerError('Fail while fetching a Customer.', error))
  })
})
