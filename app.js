import Koa from 'koa'
import router from 'koa-router'
import onerror from 'koa-onerror'

let app = new Koa()

onerror(app)
app.use(router)


// app.use(async (ctx, next) => {
//  console.log('>> one')
//   await next()
//   console.log('<< one')
// })

// app.use(async (ctx, next) => {
//   console.log('>> two')
//   ctx.body = 'two';
//   console.log('<< two')
// })

// app.use(async (ctx, next) => {
//   console.log('>> three')
//   await next()
//   console.log('<< three')
// })

// app.use(async (ctx, next) => {
//   let path = ctx.path
//   ctx.body = path
// })

app.listen(3000)
