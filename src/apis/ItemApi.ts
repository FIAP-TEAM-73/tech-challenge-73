import { type IHttp } from '../interfaces/IHttp'
import { type SaveItemCommand } from '../usecases/SaveItemUseCase'
import { type UpdateItemCommand } from '../usecases/UpdateItemUseCase'
import type IGatewayFactory from '../interfaces/IGatewayFactory'
import ItemController from '../controllers/ItemController'
import { type ItemPageParams } from '../interfaces/IItemGateway'
import { type IApi } from '../interfaces/IApi'

export default class ItemApi implements IApi {
  private readonly itemController: ItemController
  constructor (
    private readonly http: IHttp,
    factory: IGatewayFactory
  ) {
    this.itemController = new ItemController(factory)
  }

  init (): void {
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
