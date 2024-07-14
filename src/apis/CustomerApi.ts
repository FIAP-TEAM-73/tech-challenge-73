import { type IHttp } from '../interfaces/IHttp'
import { type CustomerCommand } from '../usecases/SaveCustomerUseCase'
import type IGatewayFactory from '../interfaces/IGatewayFactory'
import CustomerController from '../controllers/CustomerController'
import { type IApi } from '../interfaces/IApi'
export default class CustomerApi implements IApi {
  private readonly customerController: CustomerController
  constructor (
    private readonly http: IHttp,
    factory: IGatewayFactory
  ) {
    this.customerController = new CustomerController(factory)
  }

  init (): void {
    void this.http.route('post', 'customer', async (_: any, body: CustomerCommand) => {
      return await this.customerController.save(body)
    })
    void this.http.route('get', 'customer/:cpf', async (req: { params: { cpf: string } }) => {
      return await this.customerController.identify(req.params.cpf)
    })
  }
}
