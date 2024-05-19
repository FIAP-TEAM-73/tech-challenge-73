export default class OrderItem {
  constructor (
    readonly itemId: string,
    readonly orderId: string,
    readonly price: number,
    readonly quantity: number) {}

  calculateTotal (): number {
    return this.price * this.quantity
  }
}
