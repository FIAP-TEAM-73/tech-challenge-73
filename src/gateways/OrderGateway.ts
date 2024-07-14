import type IConnection from '../interfaces/IConnection'
import Order, { type OrderStatus } from '../entities/Order'
import OrderItem from '../entities/OrderItem'
import type IOrderGateway from '../interfaces/IOrderGateway'
import { type OrderParams, type OrderPageParams } from '../interfaces/IOrderGateway'
import { CPF } from '../entities/value-objects/Cpf'

interface OrderRow {
  id: string
  table_number: number
  status: OrderStatus
  cpf: string | null
  item_id: string
  price: number
  quantity: number
}

interface OrderItemRow {
  order_id: string
  item_id: string
  price: number
  quantity: number
}

export class OrderGateway implements IOrderGateway {
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

  async find (params: OrderPageParams): Promise<Order[]> {
    const query = `
    SELECT * FROM "order" 
    WHERE 1 = 1
    AND (id = $1 OR $1 is null)
    AND (table_number = $2 OR $2 is null)
    AND (status = $3 OR ($3 is null AND status <> 'DONE'))
    AND (cpf = $4 OR $4 is null)
    ORDER BY
      CASE
        WHEN status = 'READY' THEN 1
        WHEN status = 'IN_PROGRESS' THEN 2
        WHEN status = 'RECEIVED' THEN 3
        ELSE 4
      END,
    "createdAt" DESC
    LIMIT $5
    OFFSET $6;
    `
    const { page, size, id, tableNumber, cpf, status } = params
    const result = await this.connection.query(query, [id, tableNumber, status, cpf, size, (size * page)])
    if (result.rows.length === 0) return []
    return await Promise.all(result.rows.map(async (row: OrderRow) => {
      const { id, cpf, status, table_number: tableNumber } = row
      const orderItems = await this.findOrderItemsByOrderId(id)
      return new Order(id, tableNumber, status, orderItems, this.createTypeSafeCpf(cpf))
    }))
  }

  private async findOrderItemsByOrderId (orderId: string): Promise<OrderItem[]> {
    const query = `
    SELECT * FROM order_item
    WHERE order_id = $1
    `
    const result = await this.connection.query(query, [orderId])
    if (result.rows.length === 0) return []
    return result.rows.map((row: OrderItemRow) => {
      const { item_id: itemId, price, quantity } = row
      return new OrderItem(itemId, orderId, price, quantity)
    })
  }

  async count (params: OrderParams): Promise<number> {
    const query = `
    SELECT COUNT(*) as "total" FROM "order" 
    WHERE 1 = 1
    AND (id = $1 OR $1 is null)
    AND (table_number = $2 OR $2 is null)
    AND (status = $3 OR $3 is null)
    AND (cpf = $4 OR $4 is null)
    `
    const { id, tableNumber, cpf, status } = params
    const result = await this.connection.query(query, [id, tableNumber, status, cpf])
    if (result.rows.length === 0) return 0
    return result.rows[0].total
  }
}
