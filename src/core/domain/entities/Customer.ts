import { assertArgumentLength } from '../base/AssertionConcerns'
import type { CPF } from '../value-objects/Cpf'
import type { Phone } from '../value-objects/Phone'

export class Customer {
  constructor (
    readonly id: string,
    readonly name: string,
    readonly phone: Phone,
    readonly cpf: CPF
  ) {
    assertArgumentLength(name, 3, 100, 'Name must be greater than 3 and less than 100!')
  }
}
