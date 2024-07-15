import type Payment from '../entities/Payment'
import type PaymentStatus from '../entities/PaymentStatus'
import type IConnection from '../interfaces/IConnection'
import { type IPaymentGateway } from '../interfaces/IPaymentGateway'

export default class PaymentGateway implements IPaymentGateway {
  constructor (private readonly connection: IConnection) {}
  async save (payment: Payment): Promise<string> {
    const query = 'INSERT INTO "payment"(id, order_id, "value", integration_id, qa_code) VALUES($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING RETURNING *'
    const { id, orderId, value, statuses, integrationId, qrCode } = payment
    const values = [id, orderId, value, integrationId, qrCode]
    const result = await this.connection.query(query, values)
    const paymentId: string = result.rows[0].id
    await this.savePaymentStatus(paymentId, statuses)
    return paymentId
  }

  async savePaymentStatus (paymentId: string, statuses: PaymentStatus[]): Promise<void> {
    const query = 'INSERT INTO "payment_status"(id, payment_id, "status") VALUES($1, $2, $3) ON CONFLICT DO NOTHING;'
    await Promise.all(statuses.map(async ({ id, status }) => {
      const values = [id, paymentId, status]
      await this.connection.query(query, values)
    }))
  }
}
