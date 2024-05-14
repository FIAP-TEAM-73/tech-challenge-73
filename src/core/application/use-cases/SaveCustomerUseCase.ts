import { Customer } from '../../domain/entities/Customer'
import { type ICustomerRepository } from '../../domain/repositories/ICustomerRepository'
import { CPF } from '../../domain/value-objects/Cpf'
import { Phone } from '../../domain/value-objects/Phone'
import { v4 as uuidv4 } from 'uuid'
import { type HttpResponse, noContent, internalServerError } from '../api/HttpResponses'
export interface CustomerCommand {
  name: string
  phone: string
  cpf: string
}
export class SaveCustomerUseCase {
  constructor (private readonly customerRepository: ICustomerRepository) {}

  async execute (command: CustomerCommand): Promise<HttpResponse> {
    try {
      const customer = new Customer(uuidv4(), command.name, new Phone(command.phone), new CPF(command.cpf))
      await this.customerRepository.save(customer)
      return noContent()
    } catch (error) {
      return internalServerError('Fail while saving a customer.', error)
    }
  }
}
