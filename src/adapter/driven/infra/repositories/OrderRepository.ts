import type IConnection from '../../../../core/domain/database/IConnection'
import Order, { type OrderStatus } from '../../../../core/domain/entities/Order'
import OrderItem from '../../../../core/domain/entities/OrderItem'
import type IOrderRepository from '../../../../core/domain/repositories/IOrderRepository'
import { CPF } from '../../../../core/domain/value-objects/Cpf'

interface OrderRow {
  id: string
  table_number: number
  status: OrderStatus
  cpf: string | null
  item_id: string
  price: number
  quantity: number
}

export class OrderRepository implements IOrderRepository {
  constructor (private readonly connection: IConnection) {}
  async save (order: Order): Promise<string> {
    const query = 'INSERT INTO "order"(id, table_number, status, cpf) VALUES($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET table_number=$2, status=$3 RETURNING *'
    const { id, tableNumber, status, orderItems, cpf } = order
    const values = [id, tableNumber, status, cpf?.value]
    const result = await this.connection.query(query, values)
    const orderId: string = result.rows[0].id
    await this.saveOrderItem(orderId, orderItems)
    return orderId
  }

  private async saveOrderItem (orderId: string, orderItems: OrderItem[]): Promise<void> {
    const query = 'INSERT INTO order_item(item_id, order_id, price, quantity) VALUES($1, $2, $3, $4) ON CONFLICT (item_id, order_id) DO NOTHING RETURNING *'
    await Promise.all(orderItems.map(async ({ itemId, price, quantity }) => {
      const values = [itemId, orderId, price, quantity]
      await this.connection.query(query, values)
    }))
  }

  async findById (id: string): Promise<Order | undefined> {
    const query = `
    SELECT * FROM "order" o
    JOIN order_item oi ON oi.order_id = o.id
    WHERE o.id = $1
    `
    const result = await this.connection.query(query, [id])
    if (result.rows.length === 0) return undefined
    return result.rows.reduce((acc: Order | undefined, row: OrderRow) => {
      const { id, table_number: tableNumber, status, cpf, item_id: itemId, price, quantity } = row
      if (acc === undefined) {
        const orderItem = new OrderItem(itemId, id, price, quantity)
        return new Order(id, tableNumber, status, [orderItem], this.createTypeSafeCpf(cpf))
      }
      const orderItem = new OrderItem(itemId, id, price, quantity)
      return new Order(acc.id, acc.tableNumber, acc.status, [...acc.orderItems, orderItem], this.createTypeSafeCpf(cpf))
    }, undefined)
  }

  private createTypeSafeCpf (cpf: string | null): CPF | undefined {
    if (cpf === null) return undefined
    return new CPF(cpf)
  }

  async findAllOrdersByCpf (cpf: string): Promise<Order | undefined> {
    const query = `
    SELECT * FROM "order" o
    JOIN order_item oi ON oi.order_id = o.id
    WHERE o.cpf = $1
    `
    const result = await this.connection.query(query, [cpf])
    if (result.rows.length === 0) return undefined
    return result.rows.reduce((acc: Order | undefined, row: OrderRow) => {
      const { id, table_number: tableNumber, status, cpf, item_id: itemId, price, quantity } = row
      if (acc === undefined) {
        const orderItem = new OrderItem(itemId, id, price, quantity)
        return new Order(id, tableNumber, status, [orderItem], this.createTypeSafeCpf(cpf))
      }
      const orderItem = new OrderItem(itemId, id, price, quantity)
      return new Order(acc.id, acc.tableNumber, acc.status, [...acc.orderItems, orderItem], this.createTypeSafeCpf(cpf))
    }, undefined)
  }
}
