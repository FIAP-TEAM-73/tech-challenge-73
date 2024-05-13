import { type HttpResponse } from '../../../../../core/application/api/HttpResponses'
import { IdentifyCustomerUseCase } from '../../../../../core/application/use-cases/IdentifyCustomerUseCase'
import { type CustomerCommand, SaveCustomerUseCase } from '../../../../../core/application/use-cases/SaveCustomerUseCase'
import type IRepositoryFactory from '../../../../../core/domain/factories/IRepositoryFactory'

export default class CustomerController {
  private readonly saveCustomerUseCase: SaveCustomerUseCase
  private readonly identifyCustomerUseCase: IdentifyCustomerUseCase

  constructor (factory: IRepositoryFactory) {
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
