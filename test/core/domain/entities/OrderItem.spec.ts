import { DomainError } from '../../../../src/core/domain/base/DomainError'
import OrderItem from '../../../../src/core/domain/entities/OrderItem'

describe('Calculate OrderItem total value', () => {
  it('Should calculate the total price when the OrderItem is valid', () => {
    const itemPrice = 30.00
    const itemQuantity = 2
    const sut = new OrderItem('any_item_id', 'any_order_id', itemPrice, itemQuantity)
    const totalPrice = sut.calculateTotal()
    expect(totalPrice).toBe(60)
  })
  it('Should fail when price is under than 0', () => {
    const itemPrice = -1
    const itemQuantity = 2
    expect(() => new OrderItem('any_item_id', 'any_order_id', itemPrice, itemQuantity)).toThrow(new DomainError('Price must be greater than 1'))
  })
})
