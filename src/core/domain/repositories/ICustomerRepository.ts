import { type Customer } from '../entities/Customer'

export interface ICustomerRepository {
  save: (customer: Customer) => Promise<string>
  findByCpf: (cpf: string) => Promise<Customer | undefined>
}
