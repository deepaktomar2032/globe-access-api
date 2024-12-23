import { Server } from 'http'

import 'reflect-metadata'
import Router from '@koa/router'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from 'koa2-cors'
import { useKoaServer } from 'routing-controllers'
import { InitialControllerV1, CountryControllerV1, VisaControllerV1, CronControllerV1 } from '@src/controllers'
import { health } from '@src/routes'
import { addEnvRequirements, checkRequiredEnvs } from '@src/utils'

addEnvRequirements('NODE_ENV')

export const initializeServer: () => Promise<Server> = async (): Promise<Server> => {
  if (checkRequiredEnvs()) {
    throw new Error('Missing env vars')
  }

  const app: Koa = new Koa()
  app.use(cors({ origin: '*' }))

  const router: Router = new Router()
  app.use(bodyParser())
  router.get('/health', health)

  app.use(router.routes())
  app.use(router.allowedMethods())

  useKoaServer(app, {
    controllers: [InitialControllerV1, CountryControllerV1, VisaControllerV1, CronControllerV1],
    defaultErrorHandler: false,
    routePrefix: ''
  })

  const port: number = 3000

  return app.listen(port)
}
