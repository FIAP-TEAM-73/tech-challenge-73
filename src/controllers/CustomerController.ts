import type IGatewayFactory from '../interfaces/IGatewayFactory'
import { type HttpResponse } from '../presenters/HttpResponses'
import { IdentifyCustomerUseCase } from '../usecases/IdentifyCustomerUseCase'
import { SaveCustomerUseCase, type CustomerCommand } from '../usecases/SaveCustomerUseCase'

export default class CustomerController {
  private readonly saveCustomerUseCase: SaveCustomerUseCase
  private readonly identifyCustomerUseCase: IdentifyCustomerUseCase

  constructor (factory: IGatewayFactory) {
    const customerGateway = factory.createCustomerGateway()
    this.saveCustomerUseCase = new SaveCustomerUseCase(customerGateway)
    this.identifyCustomerUseCase = new IdentifyCustomerUseCase(customerGateway)
  }

  async save (command: CustomerCommand): Promise<HttpResponse> {
    return await this.saveCustomerUseCase.execute(command)
  }

  async identify (cpf: string): Promise<HttpResponse> {
    return await this.identifyCustomerUseCase.execute(cpf)
  }
}
