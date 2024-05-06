import { assertArgumentLength } from '../base/AssertionConcerns'

export class Customer {
  readonly name
  constructor (
    firstName: string,
    lastName: string,
    readonly phone: string,
    readonly cpf: string
  ) {
    assertArgumentLength(firstName, 3, 50, 'First name must be greater than 3 and less than 50!')
    this.name = `${firstName} ${lastName}`
  }
}
