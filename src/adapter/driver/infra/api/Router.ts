import { type IHttp } from '../../../../core/application/api/IHttp'
import { type CustomerCommand } from '../../../../core/application/use-cases/SaveCustomerUseCase'
import type IRepositoryFactory from '../../../../core/domain/factories/IRepositoryFactory'
import CustomerController from './controllers/CustomerController'

export default class Router {
  constructor (private readonly http: IHttp, private readonly repositoryFactory: IRepositoryFactory) { }

  init (): void {
    void this.http.route('post', '/api/v1/customer', async (_: any, body: CustomerCommand) => {
      const controller = new CustomerController(this.repositoryFactory)
      return await controller.save(body)
    })
    void this.http.route('get', '/api/v1/customer/{id}', async (params: { id: string }) => {
      const controller = new CustomerController(this.repositoryFactory)
      return await controller.identify(params.id)
    })
    void this.http.route('get', '/api/v1/orders', async () => {
      const data = { statusCode: 200, payload: 'consulta realizada com sucesso' }
      return await new Promise(resolve => { resolve(data) })
    })
    void this.http.route('get', '/api/v1/orders?customerId={customerId}', async () => {
      const data = { statusCode: 200, payload: 'consulta realizada com sucesso' }
      return await new Promise(resolve => { resolve(data) })
    })
    void this.http.route('post', '/api/v1/orders', async () => {
      const data = { statusCode: 201, payload: 'recurso criado com sucesso' }
      return await new Promise(resolve => { resolve(data) })
    })
    void this.http.route('patch', '/api/v1/orders/:id/products', async () => {
      const data = { statusCode: 200, payload: 'recurso atualizado com sucesso' }
      return await new Promise(resolve => { resolve(data) })
    })
    void this.http.route('delete', '/api/v1/orders/:id/products', async () => {
      const data = { statusCode: 200, payload: 'recurso deletado com sucesso' }
      return await new Promise(resolve => { resolve(data) })
    })
    void this.http.route('get', '/api/v1/products', async () => {
      const data = { statusCode: 200, payload: 'recurso consultado com sucesso' }
      return await new Promise(resolve => { resolve(data) })
    })
    void this.http.route('get', '/api/v1/products?categoryId={categoryId}', async () => {
      const data = { statusCode: 200, payload: 'recurso consultado com sucesso' }
      return await new Promise(resolve => { resolve(data) })
    })
  }
}
