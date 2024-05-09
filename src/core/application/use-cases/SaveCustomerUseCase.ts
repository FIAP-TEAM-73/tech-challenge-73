import { Customer } from '../../domain/entities/Customer'
import { type ICustomerRepository } from '../../domain/repositories/ICustomerRepository'
import { CPF } from '../../domain/value-objects/Cpf'
import { Phone } from '../../domain/value-objects/Phone'
import { v4 as uuidv4 } from 'uuid'
export interface CustomerRequest {
  name: string
  phone: string
  cpf: string
}

export class SaveCustomerUseCase {
  constructor (private readonly customerRepository: ICustomerRepository) {}

  async execute (request: CustomerRequest): Promise<string> {
    try {
      const customer = new Customer(uuidv4(), request.name, new Phone(request.phone), new CPF(request.cpf))
      return await this.customerRepository.save(customer)
    } catch (error) {
      throw new Error('Fail while saving a customer.')
    }
  }
}
