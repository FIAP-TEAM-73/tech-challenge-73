import express, { type Request, type Response, type Application } from 'express'
import { type Callback, type IHttp } from '../../../../core/application/api/IHttp'
import swaggerUi, { type JsonObject } from 'swagger-ui-express'
import { badRequest, internalServerError } from '../../../../core/application/api/HttpResponses'

export default class ExpressHttp implements IHttp {
  readonly app: Application

  constructor () {
    this.app = express()
    this.app.use(express.json())
  }

  async route (method: 'post' | 'get' | 'put' | 'delete' | 'patch', url: string, callback: Callback): Promise<unknown> {
    // TODO fix this ESLINT warn
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    return this.app[method](`/api/v1/${url}`, async (req: Request, res: Response) => {
      try {
        const { query, params } = req
        const { statusCode, payload } = await callback({ query, params }, req.body)
        res.status(statusCode).json(payload)
      } catch (error) {
        const errorMessage = `Fail while trying to access ${method.toUpperCase()} - /${url}`
        if (error instanceof Error) {
          const { statusCode, payload } = badRequest(errorMessage, error)
          res.status(statusCode).json(payload)
          return
        }
        const { statusCode, payload } = internalServerError(errorMessage, error)
        res.status(statusCode).json(payload)
      }
    })
  }

  async listen (port: number): Promise<void> {
    this.app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`)
    })
  }

  async doc (urlPath: string, doc: JsonObject): Promise<void> {
    this.app.use(urlPath, swaggerUi.serve, swaggerUi.setup(doc))
  }
}
