const Router = require('koa-router')
const moment = require('moment')
const config = require('config')
const {  
  getSomedayFromRedis,
  getEverydayListFromRedis
} = require('../daily/client')
var dailyRouter = new Router()

/**
 * 获取今日的推荐文章
 * response.body: {
 *    result: true, // false
 *    info: {
 *      width
 *    }
 * }
 */
dailyRouter.get('/today', async ctx => {
  try {
    var res = { result: false }
    // 这里有个小bug，每天十二点后重置今天文章需要时间，会无法获取
    const todayDate = moment().format('YYYY-MM-DD')
    const todayInfo = await getSomedayFromRedis(todayDate)
    if (!todayInfo) {
      res.message = "加载失败"
    } else {
      res.message = JSON.parse(todayInfo)
      res.result = true
    }
    ctx.response.body = JSON.stringify(res)
  } catch (err) {
    console.log(err)
    ctx.response.status = 500
  }
})

dailyRouter.get('/everyday', async ctx => {
  try {
    var res = {result: false}
    const everydayList = await getEverydayListFromRedis()
    if (!everydayList) {
      res.message = "获取历史列表失败" 
    } else {
      res.message = everydayList
      res.result = true
    }
    ctx.response.body = JSON.stringify(res)
  } catch (err) {
    console.log(err)
    ctx.response.status = 500
  }
})

module.exports.dailyRouter = dailyRouter