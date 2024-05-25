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
    void this.http.route('post', '/api/v1/customer', async (_: any, body: CustomerCommand) => {
      return await this.customerController.save(body)
    })
    void this.http.route('get', '/api/v1/customer/:cpf', async (params: { cpf: string }) => {
      return await this.customerController.identify(params.cpf)
    })
    // ORDER
    void this.http.route('post', '/api/v1/order', async (_: any, body: PlaceOrderCommand) => {
      return await this.orderController.placeOrder(body)
    })
    void this.http.route('patch', '/api/v1/order/:id', async (params: { id: string }, body: ChangeOrderStatusCommand) => {
      return await this.orderController.changeOrderStatus(params.id, body)
    })
    void this.http.route('delete', '/api/v1/orders/:id', async () => {
      const data = { statusCode: 200, payload: 'recurso deletado com sucesso' }
      return await new Promise(resolve => { resolve(data) })
    })
    void this.http.route('get', '/api/v1/orders?:cpf', async (query: { cpf: string }) => {
      return await this.orderController.findAllOrdersByCpf(query.cpf)
    })
    void this.http.route('get', '/api/v1/products?:categoryId', async () => {
      const data = { statusCode: 200, payload: 'recurso consultado com sucesso' }
      return await new Promise(resolve => { resolve(data) })
    })
  }
}
