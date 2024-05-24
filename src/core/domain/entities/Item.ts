import { assertArgumentLength } from '../base/AssertionConcerns'

export default class Item {
  constructor (
    readonly id: string,
    readonly name: string,
    readonly category: string,
    readonly price: number,
    readonly description: string,
    readonly pathImages: string[]
  ) {
    assertArgumentLength(name, 3, 100, 'Name must be greater than 3 and less than 100!')
  }
}
