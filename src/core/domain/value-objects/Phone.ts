import { assertArgumentLength } from '../base/AssertionConcerns'

export class Phone {
  constructor (readonly value: string) {
    assertArgumentLength(value, 11, 11, 'Phone must have only numbers and 11 characteres!')
  }
}
