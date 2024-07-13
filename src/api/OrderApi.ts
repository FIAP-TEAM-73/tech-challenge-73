import { type IHttp } from '../interfaces/IHttp'
import type EventHandler from '../handlers/EventHandler'
import { type ChangeOrderStatusCommand } from '../use-cases/ChangeOrderStatusUseCase'
import { type PlaceOrderCommand } from '../use-cases/PlaceOrderUseCase'
import type IGatewayFactory from '../interfaces/IGatewayFactory'
import OrderController from '../controllers/OrderController'
import { type OrderPageParams } from '../interfaces/IOrderGateway'
import { type IApi } from '../interfaces/IApi'
export default class OrderApi implements IApi {
  private readonly orderController: OrderController
  constructor (
    private readonly http: IHttp,
    repositoryFactory: IGatewayFactory,
    eventHandler: EventHandler
  ) {
    this.orderController = new OrderController(repositoryFactory, eventHandler)
  }

  init (): void {
    // ORDER
    void this.http.route('post', 'order', async (_: any, body: PlaceOrderCommand) => {
      return await this.orderController.placeOrder(body)
    })
    void this.http.route('put', 'order/:id', async (req: { params: { id: string } }, body: ChangeOrderStatusCommand) => {
      return await this.orderController.changeOrderStatus(req.params.id, body)
    })
    void this.http.route('get', 'order', async (req: { query: OrderPageParams }) => {
      return await this.orderController.findOrder(req.query)
    })
  }
}
