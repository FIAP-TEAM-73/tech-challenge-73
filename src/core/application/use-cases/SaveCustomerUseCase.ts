import { Customer } from '../../domain/entities/Customer'
import { type ICustomerRepository } from '../../domain/repositories/ICustomerRepository'
import { CPF } from '../../domain/value-objects/Cpf'
import { Phone } from '../../domain/value-objects/Phone'

export interface CustomerRequest {
  name: string
  phone: string
  cpf: string
}

export class SaveCustomerUseCase {
  constructor (private readonly customerRepository: ICustomerRepository) {}

  async execute (request: CustomerRequest): Promise<string> {
    try {
      const customer = new Customer('1', request.name, new Phone(request.phone), new CPF(request.cpf))
      return await this.customerRepository.save(customer)
    } catch (error) {
      throw new Error('Fail while saving a customer.')
    }
  }
}
