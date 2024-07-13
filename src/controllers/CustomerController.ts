import type IGatewayFactory from '../interfaces/IGatewayFactory'
import { type HttpResponse } from '../presenter/HttpResponses'
import { IdentifyCustomerUseCase } from '../use-cases/IdentifyCustomerUseCase'
import { SaveCustomerUseCase, type CustomerCommand } from '../use-cases/SaveCustomerUseCase'

export default class CustomerController {
  private readonly saveCustomerUseCase: SaveCustomerUseCase
  private readonly identifyCustomerUseCase: IdentifyCustomerUseCase

  constructor (factory: IGatewayFactory) {
    const customerRepository = factory.createCustomerRepository()
    this.saveCustomerUseCase = new SaveCustomerUseCase(customerRepository)
    this.identifyCustomerUseCase = new IdentifyCustomerUseCase(customerRepository)
  }

  async save (command: CustomerCommand): Promise<HttpResponse> {
    return await this.saveCustomerUseCase.execute(command)
  }

  async identify (cpf: string): Promise<HttpResponse> {
    return await this.identifyCustomerUseCase.execute(cpf)
  }
}
