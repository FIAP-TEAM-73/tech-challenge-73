import GatewayFactory from './factories/GatewayFactory'
import ExpressHttp from './adapters/ExpressHttp'
import FakeCheckoutHandler from './handlers/FakeCheckoutHandler'
import EventHandler from './handlers/EventHandler'
import type IGatewayFactory from './interfaces/IGatewayFactory'
import * as doc from '../docs/swagger.json'
import PostgresConnection from './adapters/PostgresConnection'
import type IConnection from './interfaces/IConnection'
import { type IHttp } from './interfaces/IHttp'
import CustomerApi from './apis/CustomerApi'
import ItemApi from './apis/ItemApi'
import OrderApi from './apis/OrderApi'
import PaymentApi from './apis/PaymentApi'
import PaymentAcceptedHandler from './handlers/PaymentAcceptedHandler'
import PaymentRejectedHandler from './handlers/PaymentRejectedHandler'

const getHanlders = (factory: IGatewayFactory): EventHandler => {
  return new EventHandler(
    [
      new FakeCheckoutHandler(factory),
      new PaymentAcceptedHandler(factory),
      new PaymentRejectedHandler(factory)
    ]
  )
}

const getHttp = (): IHttp => new ExpressHttp()

const getConnection = (): IConnection => {
  return new PostgresConnection({
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? '1234',
    database: process.env.DB_NAME ?? 'postgres',
    host: process.env.DB_HOST ?? '0.0.0.0',
    port: +(process.env.DB_PORT ?? 5432)
  })
}

const initRoutes = (http: IHttp, connection: IConnection): void => {
  const factory = new GatewayFactory(connection)
  const handler = getHanlders(factory)
  const routes = [
    new CustomerApi(http, factory),
    new ItemApi(http, factory),
    new OrderApi(http, factory, handler),
    new PaymentApi(http, factory, handler)
  ]
  routes.forEach((route) => { route.init() })
}

const main = async (): Promise<void> => {
  const http = getHttp()
  const connection = getConnection()
  await connection.connect()
  initRoutes(http, connection)
  await http.doc('/swagger', doc)
  await http.listen(+(process.env.PORT ?? 9001))
  process.on('SIGINT', () => {
    console.log('Process is finishing')
    connection.close().catch(console.log)
    process.exit()
  })
}

main().catch(console.log)
