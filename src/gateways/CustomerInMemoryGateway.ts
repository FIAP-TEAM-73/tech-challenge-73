import { type Customer } from '../entities/Customer'
import { type ICustomerGateway } from '../interfaces/ICustomerGateway'

export default class CustomerInMemoryGateway implements ICustomerGateway {
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
