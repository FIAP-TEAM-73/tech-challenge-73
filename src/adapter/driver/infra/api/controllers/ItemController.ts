import { type HttpResponse } from '../../../../../core/application/api/HttpResponses'
import DeactivateItemUseCase from '../../../../../core/application/use-cases/DeactivateItemUseCase'
import FindItemUseCase from '../../../../../core/application/use-cases/FindItemUseCase'
import SaveItemUseCase, { type SaveItemCommand } from '../../../../../core/application/use-cases/SaveItemUseCase'
import UpdateItemUseCase, { type UpdateItemCommand } from '../../../../../core/application/use-cases/UpdateItemUseCase'
import type IRepositoryFactory from '../../../../../core/domain/factories/IRepositoryFactory'
import { type ItemPageParams } from '../../../../../core/domain/repositories/IItemRepository'

export default class ItemController {
  private readonly saveItemUseCase: SaveItemUseCase
  private readonly updateItemUseCase: UpdateItemUseCase
  private readonly findItemUseCase: FindItemUseCase
  private readonly deactivateItemUseCase: DeactivateItemUseCase
  constructor (factory: IRepositoryFactory) {
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
