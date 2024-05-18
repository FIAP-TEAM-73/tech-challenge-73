import CustomerRepository from '../../../../../src/adapter/driven/infra/repositories/CustomerRepository'
import type IConnection from '../../../../../src/core/domain/database/IConnection'
import { Customer } from '../../../../../src/core/domain/entities/Customer'
import { CPF } from '../../../../../src/core/domain/value-objects/Cpf'
import { Phone } from '../../../../../src/core/domain/value-objects/Phone'

const mockCustomer = new Customer('any_id', 'Any Name', new Phone('35999111115'), new CPF('12559757610'))

describe('Customer Repository', () => {
  const mockConnection: IConnection = {
    isAlive: async () => await Promise.resolve(true),
    close: async () => { },
    connect: async () => { },
    query: async (stmt: string, params: any[]) => {
      console.log({ stmt, params })
      return await Promise.resolve({ rows: [{ id: 'any_id', name: 'Any Name', phone: '35999111115', cpf: '12559757610' }] })
    }
  }
  describe('Create a customer', () => {
    it('Should save a customer with success when every data was correct provided', async () => {
      const sut = new CustomerRepository(mockConnection)
      const result = await sut.save(mockCustomer)
      expect(result).toBe('any_id')
    })
  })
  describe('Find a customer by CPF', () => {
    it('Should find a customer by CPF when it exists', async () => {
      const sut = new CustomerRepository(mockConnection)
      const customer = await sut.findByCpf('12559757610')
      expect(customer).toEqual(mockCustomer)
    })
    it('Should not find a customer by CPF when it does not exist', async () => {
      const mockCpfNotFound: IConnection = {
        ...mockConnection,
        query: async (stmt: string, params: any[]) => {
          console.log({ stmt, params })
          return await Promise.resolve({ rows: [] })
        }
      }
      const sut = new CustomerRepository(mockCpfNotFound)
      const customer = await sut.findByCpf('wrong_cpf')
      expect(customer).toBeUndefined()
    })
  })
})