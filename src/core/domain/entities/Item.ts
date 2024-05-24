export default class Item {
  constructor (
    readonly id: string,
    readonly name: string,
    readonly category: string,
    readonly price: number,
    readonly description: string,
    readonly pathImages: string[]
  ) {}
}
