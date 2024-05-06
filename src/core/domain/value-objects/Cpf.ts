import { assertArgumentLength } from '../base/AssertionConcerns'

export class CPF {
  constructor (readonly value: string) {
    assertArgumentLength(value, 11, 11, 'Cpf must have only number and 11 characteres!')
  }
}
