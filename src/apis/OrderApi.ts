import { type IHttp } from '../interfaces/IHttp'
import { type ChangeOrderStatusCommand } from '../usecases/ChangeOrderStatusUseCase'
import type IGatewayFactory from '../interfaces/IGatewayFactory'
import OrderController from '../controllers/OrderController'
import { type OrderPageParams } from '../interfaces/IOrderGateway'
import { type IApi } from '../interfaces/IApi'

export default class OrderApi implements IApi {
  private readonly orderController: OrderController
  constructor (
    private readonly http: IHttp,
    factory: IGatewayFactory
  ) {
    this.orderController = new OrderController(factory)
  }

  init (): void {
    void this.http.route('get', 'order', async (req: { query: OrderPageParams }) => {
      return await this.orderController.findOrder(req.query)
    })
    void this.http.route('put', 'order/:id', async (req: { params: { id: string } }, body: ChangeOrderStatusCommand) => {
      return await this.orderController.changeOrderStatus(req.params.id, body)
    })
  }
}
