import { assertArgumentLength } from '../base/AssertionConcerns'

export class Customer {
  constructor (
    readonly name: string,
    readonly phone: string,
    readonly cpf: string
  ) {
    assertArgumentLength(name, 3, 100, 'Name must be greater than 3 and less than 100!')
  }
}
