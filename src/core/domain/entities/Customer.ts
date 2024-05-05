export class Customer {
  readonly name
  constructor (
    firstName: string,
    lastName: string,
    readonly phone: string,
    readonly cpf: string
  ) {
    this.name = `${firstName} ${lastName}`
  }
}
