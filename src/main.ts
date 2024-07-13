import RepositoryFactory from './factories/RepositoryFactory'
import ExpressHttp from './api/ExpressHttp'
import Router from './api/Router'
import FakeCheckoutHandler from './handlers/FakeCheckoutHandler'
import EventHandler from './handlers/EventHandler'
import type IGatewayFactory from './interfaces/IGatewayFactory'
import * as doc from '../docs/swagger.json'
import PostgresConnection from './external/PostgresConnection'

const getHanlders = (factory: IGatewayFactory): EventHandler => {
  return new EventHandler(
    [new FakeCheckoutHandler(factory)]
  )
}

const main = async (): Promise<void> => {
  const http = new ExpressHttp()
  const connection = new PostgresConnection({
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? '1234',
    database: process.env.DB_NAME ?? 'postgres',
    host: process.env.DB_HOST ?? '0.0.0.0',
    port: +(process.env.DB_PORT ?? 5432)
  })
  // comentar para testes locais sem banco de dados
  await connection.connect()
  const repository = new RepositoryFactory(connection)
  const router = new Router(http, repository, getHanlders(repository))
  router.init()
  await http.doc('/swagger', doc)
  await http.listen(+(process.env.PORT ?? 9001))
  process.on('SIGINT', () => {
    console.log('Process is finishing')
    connection.close().catch(console.log)
    process.exit()
  })
}

main().catch(console.log)
