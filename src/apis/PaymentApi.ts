import { type IHttp } from '../interfaces/IHttp'
import type EventHandler from '../handlers/EventHandler'
import type IGatewayFactory from '../interfaces/IGatewayFactory'
import { type IApi } from '../interfaces/IApi'
import PaymentController from '../controllers/PaymentController'
import { type ChangePaymentStatusCommand } from '../usecases/ChangePaymentStatusUseCase'

export default class PaymentApi implements IApi {
  private readonly paymentController: PaymentController
  constructor (
    private readonly http: IHttp,
    factory: IGatewayFactory,
    eventHandler: EventHandler
  ) {
    this.paymentController = new PaymentController(factory, eventHandler)
  }

  init (): void {
    void this.http.route('post', 'payment/hook', async (_: any, body: ChangePaymentStatusCommand) => {
      return await this.paymentController.save(body)
    })
  }
}
