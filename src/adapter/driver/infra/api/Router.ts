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
    void this.http.route('get', '/customer/:cpf', async (params: { cpf: string }) => {
      const controller = new CustomerController(this.repositoryFactory)
      return await controller.identify(params.cpf)
    })
  }
}
