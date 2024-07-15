import { type Customer } from '../entities/Customer'

export interface ICustomerGateway {
  save: (customer: Customer) => Promise<string>
  findByCpf: (cpf: string) => Promise<Customer | undefined>
}
