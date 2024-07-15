import { assertArgumentLength, assertArgumentMin, assertArgumentUnionType } from './base/AssertionConcerns'
import type ItemImage from './ItemImage'

const categories = ['BURGERS', 'SIDES', 'DRINKS', 'DESSERTS'] as const
export type ItemCategory = (typeof categories)[number]
export default class Item {
  constructor (
    readonly id: string,
    readonly name: string,
    readonly category: ItemCategory,
    readonly price: number,
    readonly description: string,
    readonly pathImages: ItemImage[],
    readonly isActive: boolean = true
  ) {
    assertArgumentLength(name, 3, 100, 'Name must be greater than 3 and less than 100!')
    assertArgumentUnionType(category, Object.values(categories), `Category '${category}' is invalid!`)
    assertArgumentMin(price, 0, 'Price must be greater than 0')
    assertArgumentLength(description, 3, 255, 'Description must be greater than 3 and less than 255!')
  }

  public deactivate (): Item {
    return this.setIsActive(false)
  }

  private setIsActive (isActive: boolean): Item {
    return new Item(this.id, this.name, this.category, this.price, this.description, this.pathImages, isActive)
  }

  public activate (): Item {
    return this.setIsActive(true)
  }
}
