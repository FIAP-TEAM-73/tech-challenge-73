import type IConnection from '../interfaces/IConnection'
import { Customer } from '../entities/Customer'
import { type ICustomerGateway } from '../interfaces/ICustomerGateway'
import { Phone } from '../entities/value-objects/Phone'
import { CPF } from '../entities/value-objects/Cpf'

interface CustomerRow {
  id: string
  name: string
  phone: string
  cpf: string
}

export default class CustomerGateway implements ICustomerGateway {
  constructor (private readonly connection: IConnection) {}
  async save (customer: Customer): Promise<string> {
    const query = 'INSERT INTO customer(id, name, phone, cpf) VALUES($1, $2, $3, $4) RETURNING *'
    const { id, name, phone, cpf } = customer
    const values = [id, name, phone.value, cpf.value]
    const result = await this.connection.query(query, values)
    return result.rows[0].id
  }

  async findByCpf (cpf: string): Promise<Customer | undefined> {
    const query = 'SELECT * FROM customer WHERE cpf = $1'
    const result = await this.connection.query(query, [cpf])
    if (result.rows.length === 0) return undefined
    const row: CustomerRow = result.rows[0]
    return new Customer(row.id, row.name, new Phone(row.phone), new CPF(row.cpf))
  }
}
