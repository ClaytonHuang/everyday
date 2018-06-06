const schedule = require('node-schedule')
const fs = require('fs')
const config = require('config')
const { getDailyPage } = require('./spider')
const moment = require('moment')
// 判断redis中是否有链接数据，没有则首先爬取一次
var existTodayLink = false
try {
  fs.statSync(config.basePath + 'daily-images/' + moment().format('YYYY-MM-DD') + '.png')
  existTodayLink = true
} catch (err) {
  console.log(err)
}
if (existTodayLink) {
  console.log('existed')
} else {
  getDailyPage()
}
/**
 * 定时任务
 * 每天凌晨12点爬取数据
 */
var spider = schedule.scheduleJob('1 0 0 * * *', function () {
  console.log("更新每日推荐, At: " + moment().format('YYYY-MM-DD'))
  try {
    getDailyPage()
  } catch (err) {
    console.log(err)
  }
  
})

module.exports = spider