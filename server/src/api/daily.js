const Router = require('koa-router')
const moment = require('moment')
const config = require('config')
const {getTodayFromRedis, getEverydayFromRedis} = require('../daily/client')
var dailyRouter = new Router()

/**
 * 获取今日的推荐文章
 * response.body: {
 *    result: true, // false
 *    url: 'xxxx'
 * }
 */
dailyRouter.get('/today', async ctx => {
  try {
    var res = { result: false }
    const url = await getTodayFromRedis()
    if (!url) {
      res.msg = 'No article today!'
      ctx.response.body = JSON.stringify(res)
      return
    }
    const shape = await getEverydayFromRedis(url)
    res.url = url
    res.shape = JSON.parse(shape)
    res.result = true
    ctx.response.body = JSON.stringify(res)
  } catch (err) {
    console.log(err)
    ctx.response.status = 500
  }
})

module.exports.dailyRouter = dailyRouter