import { Context, Middleware, Next } from 'koa'

export const health: Middleware = async (ctx: Context, next: Next): Promise<void> => {
  ctx.response.body = {
    env: {
      NODE: process.env.NODE,
      NODE_ENV: process.env.NODE_ENV
    },
    status: 'up'
  }

  return next()
}
