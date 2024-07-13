import { Customer } from '../entities/Customer'
import { CPF } from '../value-objects/Cpf'
import { Phone } from '../value-objects/Phone'
import { v4 as uuidv4 } from 'uuid'
import { type HttpResponse, noContent, internalServerError } from '../presenter/HttpResponses'
import { type ICustomerGateway } from '../interfaces/ICustomerGateway'
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
