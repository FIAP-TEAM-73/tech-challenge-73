import { type ICustomerRepository } from '../../domain/repositories/ICustomerRepository'
import { type HttpResponse, internalServerError, ok } from '../api/HttpResponses'
export class IdentifyCustomerUseCase {
  constructor (private readonly customerRepository: ICustomerRepository) { }

  async execute (cpf: string): Promise<HttpResponse> {
    try {
      const customer = await this.customerRepository.findByCpf(cpf)
      return ok({ isCustomer: customer !== undefined })
    } catch (error) {
      return internalServerError('Fail while fetching a Customer.', error)
    }
  }
}
