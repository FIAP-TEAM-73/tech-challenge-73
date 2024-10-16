import { Customer } from '../entities/Customer'
import { v4 as uuidv4 } from 'uuid'
import { type HttpResponse, noContent, internalServerError } from '../presenters/HttpResponses'
import { type ICustomerGateway } from '../interfaces/ICustomerGateway'
import { CPF } from '../entities/value-objects/Cpf'
import { Phone } from '../entities/value-objects/Phone'
export interface CustomerCommand {
  name: string
  phone: string
  cpf: string
}
export class SaveCustomerUseCase {
  constructor (private readonly customerGateway: ICustomerGateway) {}

  async execute (command: CustomerCommand): Promise<HttpResponse> {
    try {
      const customer = new Customer(uuidv4(), command.name, new Phone(command.phone), new CPF(command.cpf))
      await this.customerGateway.save(customer)
      return noContent()
    } catch (error) {
      return internalServerError('Fail while saving a customer.', error)
    }
  }
}
