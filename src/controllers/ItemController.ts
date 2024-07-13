import { type ItemPageParams } from '../interfaces/IItemGateway'
import type IGatewayFactory from '../interfaces/IGatewayFactory'
import { type HttpResponse } from '../presenters/HttpResponses'
import DeactivateItemUseCase from '../usecases/DeactivateItemUseCase'
import FindItemUseCase from '../usecases/FindItemUseCase'
import SaveItemUseCase, { type SaveItemCommand } from '../usecases/SaveItemUseCase'
import UpdateItemUseCase, { type UpdateItemCommand } from '../usecases/UpdateItemUseCase'

export default class ItemController {
  private readonly saveItemUseCase: SaveItemUseCase
  private readonly updateItemUseCase: UpdateItemUseCase
  private readonly findItemUseCase: FindItemUseCase
  private readonly deactivateItemUseCase: DeactivateItemUseCase
  constructor (factory: IGatewayFactory) {
    const itemGateway = factory.createItemGateway()
    this.saveItemUseCase = new SaveItemUseCase(itemGateway)
    this.updateItemUseCase = new UpdateItemUseCase(itemGateway)
    this.findItemUseCase = new FindItemUseCase(itemGateway)
    this.deactivateItemUseCase = new DeactivateItemUseCase(itemGateway)
  }

  async saveItem (command: SaveItemCommand): Promise<HttpResponse> {
    return await this.saveItemUseCase.execute(command)
  }

  async updateItem (itemId: string, command: UpdateItemCommand): Promise<HttpResponse> {
    return await this.updateItemUseCase.execute(itemId, command)
  }

  async find (params: ItemPageParams): Promise<HttpResponse> {
    return await this.findItemUseCase.execute(params)
  }

  async deactivateIem (itemId: string): Promise<HttpResponse> {
    return await this.deactivateItemUseCase.execute(itemId)
  }
}
