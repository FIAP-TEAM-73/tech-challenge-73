import { assertArgumentLength, assertArgumentMin, assertArgumentUnionType } from '../base/AssertionConcerns'

const categories = ['BURGERS', 'SIDES', 'DRINKS', 'DESSERTS'] as const
export type ItemCategory = (typeof categories)[number]
export default class Item {
  constructor (
    readonly id: string,
    readonly name: string,
    readonly category: ItemCategory,
    readonly price: number,
    readonly description: string,
    readonly pathImages: string[]
  ) {
    assertArgumentLength(name, 3, 100, 'Name must be greater than 3 and less than 100!')
    assertArgumentUnionType(category, Object.values(categories), `Category '${category}' is invalid!`)
    assertArgumentMin(price, 0, 'Price must be greater than 0')
    assertArgumentLength(description, 3, 255, 'Description must be greater than 3 and less than 255!')
  }
}
