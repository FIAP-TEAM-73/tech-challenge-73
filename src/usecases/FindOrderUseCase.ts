import type IOrderGateway from '../interfaces/IOrderGateway'
import { type OrderPageParams } from '../interfaces/IOrderGateway'
import { type HttpResponse, ok, badRequest } from '../presenters/HttpResponses'
export class FindOrderUseCase {
  constructor (private readonly orderGateway: IOrderGateway) { }

  async execute (params: OrderPageParams): Promise<HttpResponse> {
    const { page = 1, size = 10, ...rest } = params
    if (+size < 1) return badRequest('Size must be greater than 0')
    if (+page < 1) return badRequest('Page must be greater than 0')
    const orderPage = await this.orderGateway.find({ ...rest, page, size })
    return ok(orderPage)
  }
}
