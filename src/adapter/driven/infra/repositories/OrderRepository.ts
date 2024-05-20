import type IConnection from '../../../../core/domain/database/IConnection'
import type Order from '../../../../core/domain/entities/Order'
import type OrderItem from '../../../../core/domain/entities/OrderItem'
import type IOrderRepository from '../../../../core/domain/repositories/IOrderRepository'

export class OrderRepository implements IOrderRepository {
  constructor (private readonly connection: IConnection) {}
  async save (order: Order): Promise<string> {
    const query = 'INSERT INTO order(id, table_number, status, cpf) VALUES($1, $2, $3, $4) RETURNING *'
    const { id, tableNumber, status, orderItems, cpf } = order
    const values = [id, tableNumber, status, cpf]
    const result = await this.connection.query(query, values)
    const orderId: string = result.rows[0].id
    await this.saveOrderItem(orderId, orderItems)
    return orderId
  }

  private async saveOrderItem (orderId: string, orderItems: OrderItem[]): Promise<void> {
    const query = 'INSERT INTO order_item(item_id, order_id, price, quantity) VALUES($1, $2, $3, $4) RETURNING *'
    await Promise.all(orderItems.map(async ({ itemId, price, quantity }) => {
      const values = [itemId, orderId, price, quantity]
      await this.connection.query(query, values)
    }))
  }
}
