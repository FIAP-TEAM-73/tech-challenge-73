import { type ItemPageParams } from '../interfaces/IItemGateway'
import type IGatewayFactory from '../interfaces/IGatewayFactory'
import { type HttpResponse } from '../presenter/HttpResponses'
import DeactivateItemUseCase from '../use-cases/DeactivateItemUseCase'
import FindItemUseCase from '../use-cases/FindItemUseCase'
import SaveItemUseCase, { type SaveItemCommand } from '../use-cases/SaveItemUseCase'
import UpdateItemUseCase, { type UpdateItemCommand } from '../use-cases/UpdateItemUseCase'

export default class ItemController {
  private readonly saveItemUseCase: SaveItemUseCase
  private readonly updateItemUseCase: UpdateItemUseCase
  private readonly findItemUseCase: FindItemUseCase
  private readonly deactivateItemUseCase: DeactivateItemUseCase
  constructor (factory: IGatewayFactory) {
    const itemRepository = factory.createItemRepository()
    this.saveItemUseCase = new SaveItemUseCase(itemRepository)
    this.updateItemUseCase = new UpdateItemUseCase(itemRepository)
    this.findItemUseCase = new FindItemUseCase(itemRepository)
    this.deactivateItemUseCase = new DeactivateItemUseCase(itemRepository)
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
