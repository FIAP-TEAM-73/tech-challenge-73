import { type IHttp } from '../../../../core/application/api/IHttp'
import { type CustomerCommand } from '../../../../core/application/use-cases/SaveCustomerUseCase'
import type IRepositoryFactory from '../../../../core/domain/factories/IRepositoryFactory'
import CustomerController from './controllers/CustomerController'

export default class Router {
  constructor (private readonly http: IHttp, private readonly repositoryFactory: IRepositoryFactory) { }

  init (): void {
    void this.http.route('post', '/customer', async (_: any, body: CustomerCommand) => {
      const controller = new CustomerController(this.repositoryFactory)
      return await controller.save(body)
    })
    void this.http.route('get', '/customer/:id', async (params: { id: string }) => {
      const controller = new CustomerController(this.repositoryFactory)
      return await controller.identify(params.id)
    })
    void this.http.route('get', '/orders', async () => {
      const data = { statusCode: 200, payload: 'consulta realizada com sucesso' }
      return await new Promise(resolve => { resolve(data) })
    })
  }
}
