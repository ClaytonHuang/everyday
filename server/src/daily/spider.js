const rp = require('request-promise')
const fs = require('fs')
const cheerio = require('cheerio')
const phantom = require('phantom')
const iconv = require('iconv-lite')
const config = require('config')
const moment = require('moment')
var getPixels = require("get-pixels")

const baseUrl = config.dailyBaseUrl
const basePath = config.basePath

const {   
  clearEverydayListFromRedis,
  setEverydayList2Redis,
  getTodayFromEverydaylist, 
  setToday2Redis, 
  setEveryday2Redis } = require('./client')

phantom.outputEncoding='gbk'

getEverydayPage = () => {

  clearEverydayListFromRedis()
  const desDict = {
    'life/': 39, 
    'illustrations/': 32, 
    'culture/': 14,
    'picture/': 33
  }

  const desLink = Object.keys(desDict)
  desLink.forEach(subItem => {
    const limitPageNum = desDict[subItem]
    for ( var i = 1; i <= limitPageNum; i++ ) {
      var pagerUrl = 'http://www.tuweng.com/' + subItem
      if ( i > 1 ) {
        pagerUrl += 'index_' + i + '.html'
      }
      var options = {
        url: pagerUrl,
        transform: function (body) {
          return cheerio.load(body)
        }
      }
      rp(options)
        .then(function ($) {1
          $('.photo').each(function() {
            const thisHref = this.attribs.href
            setEverydayList2Redis(thisHref)
          })
        })
        .catch( err => {
        })
    }
  })
}

/**
 * 获取今日的图文内容
 */
getToday = async () => {
  var dailyUrl = await getTodayFromEverydaylist()
  dailyUrl = dailyUrl || 'http://www.tuweng.com/culture/8381.html'
  getContent2Image(dailyUrl)
}

getContent2Image = (dailyUrl) => {
  console.log('today')
  console.log(dailyUrl)
  try {
    /**
     * 改用 request-async，可能可以解决80端口问题？
     * 1、redis异步和http占用错误、
     * 2、request-async和http冲突问题
     */
    var options = {
      url: dailyUrl,
      transform: function (body) {
        return cheerio.load(body)
      } 
    }

    rp(options)
    .then(function ($) {

      $('.maintit').css('text-align', 'center')
      $('.sendvalue > strong > a').removeAttr('href')
      $('#DocContent').css('width', '90%')
      $('#DocContent').css('height', '100%')
      $('#DocContent').css('padding', '3% 5% 0')
      $('p > br').remove()
      $('#copy').remove()
      $('.icons').remove()

      // 根据体验问题，修改img size的配置
      $('img').each( function () {
        $(this).css('width', '100%')
        var imgHref = $(this).attr('src')
        if ( imgHref.indexOf('www.tuweng.com/') < 0 ) {
          $(this).attr('src', 'http://www.tuweng.com' + imgHref)
        }
      })

      // 获取文本内容
      var htmlContent = $('#container').html()
      htmlContent = '<body style="background-color: white;">' + htmlContent + '</body>'
      transferHtml2JPG(htmlContent)
    })
    .catch( err => {
      console.log(' ========== rq error')
      console.log(err)
    })

  } catch (err) {
    console.log(err)
  }
}

// 将html转为图片
transferHtml2JPG = async (htmlContent) => {
  const htmlPath = basePath + 'index.html' 
  fs.writeFileSync(htmlPath, htmlContent, 'utf-8')
  await saveImage2Static(htmlPath)
}

// 将图片存入本地
saveImage2Static = async (htmlPath) => {
  var instance = await phantom.create()
  var page = await instance.createPage()
  await page.property({ width: 1024, height: 800 });

  const status = await page.open(config.indexUrl)
  const saveImagePath = basePath + 'daily-images/' + moment().format('YYYY-MM-DD') + '.jpg' 
  await page.render(saveImagePath, {format: 'jpg', quality: '70'});
  await instance.exit()

  console.log(status)
  if (status === 'success') {
    getPixels(saveImagePath, function(err, pixels) {
      if(err) {
        console.log("Bad image path")
        return
      }
      const imageShape = pixels.shape.slice()

      const url = config.host + 'daily-images/' + moment().format('YYYY-MM-DD') + '.jpg'
      const width = imageShape[0]
      const height = imageShape[1]
      console.log({url, width, height})
      setToday2Redis(url, width, height)
      setEveryday2Redis(url, width, height)
    })
  }
}

module.exports.getEverydayPage = getEverydayPage
module.exports.getToday = getToday