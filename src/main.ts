import PostgresConnection from './adapter/driven/infra/database/PostgresConnection'
import RepositoryFactory from './adapter/driven/infra/factories/RepositoryFactory'
import ExpressHttp from './adapter/driver/infra/api/ExpressHttp'
import Router from './adapter/driver/infra/api/Router'

const main = async (): Promise<void> => {
  const http = new ExpressHttp()
  const connection = new PostgresConnection({
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? '1234',
    database: process.env.DB_NAME ?? 'postgres',
    host: process.env.DB_HOST ?? '0.0.0.0',
    port: +(process.env.DB_PORT ?? 5432)
  })
  await connection.connect()
  const repository = new RepositoryFactory(connection)
  const router = new Router(http, repository)
  router.init()
  await http.listen(+(process.env.PORT ?? 9001))
  process.on('SIGINT', () => {
    console.log('Process is finishing')
    connection.close().catch(console.log)
    process.exit()
  })
}

main().catch(console.log)
