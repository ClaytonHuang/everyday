const schedule = require('node-schedule')
const fs = require('fs')
const config = require('config')
const { getEverydayPage, getToday } = require('./spider')
const moment = require('moment')

// getEverydayPage()
getToday()

/**
 * 定时任务
 * 每天凌晨12点爬取数据
 */
var spider = schedule.scheduleJob('0 0 0 * * *', function () {
  console.log("更新每日推荐, At: " + moment().format('YYYY-MM-DD'))
  try {
    getToday()
  } catch (err) {
    console.log(err)
  }
  
})

module.exports = spider