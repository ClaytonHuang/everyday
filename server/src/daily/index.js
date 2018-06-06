const schedule = require('node-schedule')
const { getDailyPage } = require('./spider'
)
// 判断redis中是否有链接数据，无则首先爬取一次
/**
 * 定时任务
 * 每天凌晨12点爬取数据
 */
var spider = schedule.scheduleJob('1 0 0 * * *', function () {
  console.log("更新每日推荐, At: " + new Date().toISOString() )
  try {
    getDailyPage()
  } catch (err) {
    console.log(err)
  }
  
})

module.exports = spider