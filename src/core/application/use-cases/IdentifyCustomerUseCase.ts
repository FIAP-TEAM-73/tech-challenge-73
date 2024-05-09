import { DomainError } from '../../domain/base/DomainError'
import { type ICustomerRepository } from '../../domain/repositories/ICustomerRepository'

export class IdentifyCustomerUseCase {
  constructor (private readonly customerRepository: ICustomerRepository) { }

  async execute (cpf: string): Promise<boolean> {
    try {
      const customer = await this.customerRepository.findByCpf(cpf)
      return customer !== undefined
    } catch (error) {
      throw new DomainError('Fail while fetching a Customer.')
    }
  }
}
