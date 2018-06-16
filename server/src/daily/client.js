const asyncRedis = require("async-redis");
const client = asyncRedis.createClient(6379, 'localhost');

client.on('ready', async res => {
  console.log('redis is ready')
})

const TODAY = 'today'
const EVERYDAYLIST = 'everyday-list'
const EVERYDAY = 'everyday'


/**
 * 将爬取的所有链接存入redis list
 */
clearEverydayListFromRedis = async () => {
  await client.del(EVERYDAYLIST)
}
setEverydayList2Redis = async (url) => {
  await client.lpush(EVERYDAYLIST, url)
}
getTodayFromEverydaylist = async () => {
  const res = await client.rpoplpush(EVERYDAYLIST, EVERYDAYLIST)
  return res
}

/**
 * 将今日文章的链接和相关数据存入Rides
 * info = {
 *  width: 400,
 *  height: 1800,
 *  imgurl: // 第一张图片的地址
 *  title: 文章的标题,
 *  date: 获取的时间,
 *  linkurl: 
 * }
 */
setEveryday2Redis = async (date, info) => {
  try {
    const value = JSON.stringify(info)
    var dict = {}
    dict[date] = value
    const res = await client.hgetall(EVERYDAY)
    if (!res) { // 原先没有记录
      await client.hmset(EVERYDAY, dict)
    } else {
      res[date] = value
      await client.hmset(EVERYDAY, res) 
    }
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

getSomedayFromRedis = async (date) => {
  try {
    // 是通用方法，所以采用getall
    const res = await client.hget(EVERYDAY, date)
    if (!res) { // 原先没有记录
      return false
    }
    return res
  } catch (err) {
    console.log(err)
    return false
  }
}

// TODO: 添加Pager
getEverydayListFromRedis = async () => {
  try {
    const res = await client.hgetall(EVERYDAY)
    if(!res) {
      return false
    }
    var dateKeys = Object.keys(res)
    var resultList = []
    var count = 0
    dateKeys.forEach(key => {
      resultList.push(JSON.parse(res[key]))
      if (count++ === 10) {
        return resultList
      }
    })
    return resultList
  } catch (err) {
    console.log(err)
    return false
  }
}

module.exports = {
  clearEverydayListFromRedis,
  setEverydayList2Redis,
  getTodayFromEverydaylist,

  setEveryday2Redis,
  getSomedayFromRedis,
  getEverydayListFromRedis
}
