const Koa = require('koa')
const path = require('path')
const Router = require('koa-router')
const serve = require('koa-static')
const config = require('config')

const { wxRouter } = require('./api/wx')
// const { dailyRouter } = require('./api/daily')
const spider = require('./daily')

var app = new Koa()
var router = new Router()

/**
 * 微信端的功能接口
 */
router.use('/api/wx', wxRouter.routes(), wxRouter.allowedMethods())
/**
 * 获取每日图文链接的公共接口
 */
// router.use('/api/daily/', dailyRouter.routes(), dailyRouter.allowedMethods())
// 加载上面两个路由
app.use(router.routes(), router.allowedMethods())
/**
 * 静态资源服务
 * use koa-static middleware
 * 括号内的(
 *  root: 静态文件位置
 *  opts 选项
 * )
 */
app.use(serve( path.join(__dirname, '../static') ))

const appPort = config.port

app.listen(appPort)
console.log('Everyday server is listening on port 3030')