import { type IHttp } from '../../../../core/application/api/IHttp'
import type EventHandler from '../../../../core/application/handlers/EventHandler'
import { type ChangeOrderStatusCommand } from '../../../../core/application/use-cases/ChangeOrderStatusUseCase'
import { type PlaceOrderCommand } from '../../../../core/application/use-cases/PlaceOrderUseCase'
import { type CustomerCommand } from '../../../../core/application/use-cases/SaveCustomerUseCase'
import type IRepositoryFactory from '../../../../core/domain/factories/IRepositoryFactory'
import CustomerController from './controllers/CustomerController'
import OrderController from './controllers/OrderController'

export default class Router {
  private readonly customerController: CustomerController
  private readonly orderController: OrderController
  constructor (
    private readonly http: IHttp,
    repositoryFactory: IRepositoryFactory,
    eventHandler: EventHandler
  ) {
    this.customerController = new CustomerController(repositoryFactory)
    this.orderController = new OrderController(repositoryFactory, eventHandler)
  }

  init (): void {
    // CUSTOMER
    void this.http.route('post', '/customer', async (_: any, body: CustomerCommand) => {
      return await this.customerController.save(body)
    })
    void this.http.route('get', '/customer/:cpf', async (params: { cpf: string }) => {
      return await this.customerController.identify(params.cpf)
    })
    // ORDER
    void this.http.route('post', '/order', async (_: any, body: PlaceOrderCommand) => {
      return await this.orderController.placeOrder(body)
    })
    void this.http.route('put', '/order/:id', async (params: { id: string }, body: ChangeOrderStatusCommand) => {
      return await this.orderController.changeOrderStatus(params.id, body)
    })
  }
}
