import RepositoryFactory from './adapter/driven/infra/factories/RepositoryFactory'
import ExpressHttp from './adapter/driver/infra/api/ExpressHttp'
import Router from './adapter/driver/infra/api/Router'

const main = async (): Promise<void> => {
  const http = new ExpressHttp()
  const repository = new RepositoryFactory()
  const router = new Router(http, repository)
  router.init()
  await http.listen(+(process.env.PORT ?? 9001))
  process.on('SIGINT', () => {
    console.log('Process is finishing')
    process.exit()
  })
}

main().catch(console.log)
