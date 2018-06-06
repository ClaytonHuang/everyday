const Router = require('koa-router')
const moment = require('moment')
const config = require('config')

var dailyRouter = new Router()

/**
 * 获取今日的推荐文章
 * response.body: {
 *    result: true, // false
 *    url: 'xxxx'
 * }
 */
dailyRouter.get('/today', ctx => {
  try {
    var res = { result: true }
    const url =  config.host + '/daily-images/' + moment().format('YYYY-MM-DD') + '.png' 
    res.url = url
    console.log(JSON.stringify(res))
    ctx.response.body = JSON.stringify(res)
  } catch (err) {
    console.log(err)
    ctx.response.status = 500
  }
})

module.exports.dailyRouter = dailyRouter