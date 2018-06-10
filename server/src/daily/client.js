const asyncRedis = require("async-redis");
const client = asyncRedis.createClient(6379, 'everyday-redis');

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
 * 将今日的图片链接、宽高的像素尺寸存入Redis
 */
setToday2Redis = async (url, width, height) => {
  const res = await client.set(TODAY, url)
  console.log(res)
}

getTodayFromRedis = async () => {
  const res = await client.get(TODAY)
  return res
}

/**
 * 将历史文章数据和宽高尺寸存入Rides
 */
setEveryday2Redis = async (url, width, height) => {
  try {
    const value = JSON.stringify({height, width})
    var dict = {}
    dict[url] = value
    const res = await client.hgetall(EVERYDAY)
    if (!res) { // 原先没有记录
      await client.hmset(EVERYDAY, dict)
    } else {
      var history = res
      res[url] = value
      await client.hmset(EVERYDAY, res) 
    }
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}

getEverydayFromRedis = async (url) => {
  try {
    // 是通用方法，所以采用getall
    const res = await client.hgetall(EVERYDAY)
    if (!res) { // 原先没有记录
      return false
    }
    return res[url]
  } catch (err) {
    console.log(err)
    return false
  }
}

module.exports = {
  clearEverydayListFromRedis,
  setEverydayList2Redis,
  getTodayFromEverydaylist,

  setToday2Redis,
  getTodayFromRedis,
  
  setEveryday2Redis,
  getEverydayFromRedis
}
