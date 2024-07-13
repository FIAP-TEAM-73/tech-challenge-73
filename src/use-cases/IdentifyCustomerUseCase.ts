import { type HttpResponse, internalServerError, ok } from '../presenter/HttpResponses'
import { type ICustomerGateway } from '../interfaces/ICustomerGateway'

export class IdentifyCustomerUseCase {
  constructor (private readonly customergateway: ICustomerGateway) { }

  async execute (cpf: string): Promise<HttpResponse> {
    try {
      const customer = await this.customergateway.findByCpf(cpf)
      return ok({ isCustomer: customer !== undefined })
    } catch (error) {
      return internalServerError('Fail while fetching a Customer.', error)
    }
  }
}
