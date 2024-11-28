import GatewayFactory from './factories/GatewayFactory'
import ExpressHttp from './adapters/ExpressHttp'
import * as doc from '../docs/swagger.json'
import PostgresConnection from './adapters/PostgresConnection'
import type IConnection from './interfaces/IConnection'
import { type IHttp } from './interfaces/IHttp'
import CustomerApi from './apis/CustomerApi'
import ItemApi from './apis/ItemApi'
import OrderApi from './apis/OrderApi'
import { type IIntegration } from './interfaces/IIntegration'
import AxiosIntegration from './adapters/AxiosIntegration'

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

const getIntegration = (): IIntegration => {
  return new AxiosIntegration(process.env.ORDER_API_HOST ?? 'http://localhost:9002/api/v1')
}

const initRoutes = (http: IHttp, connection: IConnection, integration: IIntegration): void => {
  const factory = new GatewayFactory(connection, integration)
  const routes = [
    new CustomerApi(http, factory),
    new ItemApi(http, factory),
    new OrderApi(http, factory)
  ]
  routes.forEach((route) => { route.init() })
}

const main = async (): Promise<void> => {
  const http = getHttp()
  const connection = getConnection()
  await connection.connect()
  const integration = getIntegration()
  initRoutes(http, connection, integration)
  await http.doc('/swagger/tech-challene-73', doc)
  await http.listen(+(process.env.PORT ?? 9001))
  process.on('SIGINT', () => {
    console.log('Process is finishing')
    connection.close().catch(console.log)
    process.exit()
  })
}

main().catch(console.log)
