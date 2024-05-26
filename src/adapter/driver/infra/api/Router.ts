import { type IHttp } from '../../../../core/application/api/IHttp'
import type EventHandler from '../../../../core/application/handlers/EventHandler'
import { type ChangeOrderStatusCommand } from '../../../../core/application/use-cases/ChangeOrderStatusUseCase'
import { type PlaceOrderCommand } from '../../../../core/application/use-cases/PlaceOrderUseCase'
import { type CustomerCommand } from '../../../../core/application/use-cases/SaveCustomerUseCase'
import { type SaveItemCommand } from '../../../../core/application/use-cases/SaveItemUseCase'
import { type UpdateItemCommand } from '../../../../core/application/use-cases/UpdateItemUseCase'
import type IRepositoryFactory from '../../../../core/domain/factories/IRepositoryFactory'
import { type ItemPageParams } from '../../../../core/domain/repositories/IItemRepository'
import CustomerController from './controllers/CustomerController'
import ItemController from './controllers/ItemController'
import OrderController from './controllers/OrderController'

export default class Router {
  private readonly customerController: CustomerController
  private readonly orderController: OrderController
  private readonly itemController: ItemController
  constructor (
    private readonly http: IHttp,
    repositoryFactory: IRepositoryFactory,
    eventHandler: EventHandler
  ) {
    this.customerController = new CustomerController(repositoryFactory)
    this.orderController = new OrderController(repositoryFactory, eventHandler)
    this.itemController = new ItemController(repositoryFactory)
  }

  init (): void {
    // CUSTOMER
    void this.http.route('post', '/customer', async (_: any, body: CustomerCommand) => {
      return await this.customerController.save(body)
    })
    void this.http.route('get', '/customer/:cpf', async (req: { params: { cpf: string } }) => {
      return await this.customerController.identify(req.params.cpf)
    })
    // ORDER
    void this.http.route('post', '/order', async (_: any, body: PlaceOrderCommand) => {
      return await this.orderController.placeOrder(body)
    })
    void this.http.route('put', '/order/:id', async (req: { params: { id: string } }, body: ChangeOrderStatusCommand) => {
      return await this.orderController.changeOrderStatus(req.params.id, body)
    })
    // ITEM
    void this.http.route('post', '/item', async (_: any, body: SaveItemCommand) => {
      return await this.itemController.saveItem(body)
    })
    void this.http.route('put', '/item/:id', async (req: { params: { id: string } }, body: UpdateItemCommand) => {
      return await this.itemController.updateItem(req.params.id, body)
    })
    void this.http.route('delete', '/item/:id', async (req: { params: { id: string } }) => {
      return await this.itemController.deactivateIem(req.params.id)
    })
    void this.http.route('get', '/item', async (req: { query: ItemPageParams }) => {
      return await this.itemController.find(req.query)
    })
  }
}
