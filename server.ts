import Koa from 'koa'

const app = new Koa()

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  ctx.set('Access-Control-Allow-Credentials', 'true')
  ctx.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  ctx.set('Content-Type', 'application/json')
  await next()
})

app.use(async (ctx) => {
  // ctx.body = 'Hello World'
  ctx.response.status = 500
})

app.listen(3000, () => {
  console.log('listening on port 3000')
})
