const Router = require('koa-router')

var wxRouter = new Router()

wxRouter.post('/login', async ctx => {
  try {
  } catch (err) {
    ctx.response.status = 500
  }
})

module.exports.wxRouter = wxRouter