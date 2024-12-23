import { Context, Middleware, Next } from 'koa'
import { NODE_ENV } from '@src/constants'

export const health: Middleware = async (ctx: Context, next: Next): Promise<void> => {
  ctx.response.body = {
    env: { NODE: process.env.NODE, NODE_ENV: NODE_ENV },
    status: 'up'
  }

  return next()
}
