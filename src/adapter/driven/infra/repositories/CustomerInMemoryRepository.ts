import { type Customer } from '../../../../core/domain/entities/Customer'
import { type ICustomerRepository } from '../../../../core/domain/repositories/ICustomerRepository'

export default class CustomerInMemoryRepository implements ICustomerRepository {
  private readonly customers: Customer[] = []

  async save (customer: Customer): Promise<string> {
    await Promise.resolve(this.customers.push(customer))
    return customer.id
  }

  async findByCpf (cpf: string): Promise<Customer | undefined> {
    const customer = this.customers.find((customer) => customer.cpf.value === cpf)
    return await Promise.resolve(customer)
  }
}
