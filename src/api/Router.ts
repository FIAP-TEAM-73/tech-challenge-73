import { type IHttp } from '../interfaces/IHttp'
import type EventHandler from '../handlers/EventHandler'
import { type ChangeOrderStatusCommand } from '../use-cases/ChangeOrderStatusUseCase'
import { type PlaceOrderCommand } from '../use-cases/PlaceOrderUseCase'
import { type CustomerCommand } from '../use-cases/SaveCustomerUseCase'
import { type SaveItemCommand } from '../use-cases/SaveItemUseCase'
import { type UpdateItemCommand } from '../use-cases/UpdateItemUseCase'
import type IGatewayFactory from '../interfaces/IGatewayFactory'
import CustomerController from '../controllers/CustomerController'
import ItemController from '../controllers/ItemController'
import OrderController from '../controllers/OrderController'
import { type ItemPageParams } from '../interfaces/IItemGateway'
import { type OrderPageParams } from '../interfaces/IOrderGateway'
export default class Router {
  private readonly customerController: CustomerController
  private readonly orderController: OrderController
  private readonly itemController: ItemController
  constructor (
    private readonly http: IHttp,
    repositoryFactory: IGatewayFactory,
    eventHandler: EventHandler
  ) {
    this.customerController = new CustomerController(repositoryFactory)
    this.orderController = new OrderController(repositoryFactory, eventHandler)
    this.itemController = new ItemController(repositoryFactory)
  }

  init (): void {
    void this.http.route('post', 'customer', async (_: any, body: CustomerCommand) => {
      return await this.customerController.save(body)
    })
    void this.http.route('get', 'customer/:cpf', async (req: { params: { cpf: string } }) => {
      return await this.customerController.identify(req.params.cpf)
    })
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
    // ITEM
    void this.http.route('post', 'item', async (_: any, body: SaveItemCommand) => {
      return await this.itemController.saveItem(body)
    })
    void this.http.route('put', 'item/:id', async (req: { params: { id: string } }, body: UpdateItemCommand) => {
      return await this.itemController.updateItem(req.params.id, body)
    })
    void this.http.route('delete', 'item/:id', async (req: { params: { id: string } }) => {
      return await this.itemController.deactivateIem(req.params.id)
    })
    void this.http.route('get', 'item', async (req: { query: ItemPageParams }) => {
      return await this.itemController.find(req.query)
    })
  }
}
