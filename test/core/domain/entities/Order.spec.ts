import Order from '../../../../src/core/domain/entities/Order'
import OrderItem from '../../../../src/core/domain/entities/OrderItem'
import { CPF } from '../../../../src/core/domain/value-objects/Cpf'

const orderItems: OrderItem[] = [
  new OrderItem('1', '1', 30, 2),
  new OrderItem('2', '1', 10, 2),
  new OrderItem('3', '1', 25, 2),
  new OrderItem('4', '1', 25, 1)
]

describe('Create an order', () => {
  it('Should calculate total order price when its items are correct', () => {
    const tableNumber = 1
    const orderStatus = 'CREATED'
    const sut = new Order('1', tableNumber, orderStatus, orderItems, new CPF('12559757611'))
    const total = sut.getTotal()
    expect(total).toBe(155)
  })
})
