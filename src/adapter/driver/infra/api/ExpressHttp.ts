import express, { type Request, type Response, type Application } from 'express'
import { type Callback, type IHttp } from '../../../../core/application/api/IHttp'

export default class ExpressHttp implements IHttp {
  readonly app: Application

  constructor () {
    this.app = express()
    this.app.use(express.json())
  }

  async route (method: 'post' | 'get' | 'put' | 'delete' | 'patch', url: string, callback: Callback): Promise<unknown> {
    // TODO fix this ESLINT warn
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    return this.app[method](url, async (req: Request, res: Response) => {
      try {
        const { statusCode, payload } = await callback(req.params, req.body)
        res.status(statusCode).json(payload)
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message)
          res.status(400).json(error.message)
          return
        }
        res.status(400).json(error)
      }
    })
  }

  async listen (port: number): Promise<void> {
    this.app.listen(port, () => { console.log(`Server running at http://localhost:${port}`) })
  }
}
