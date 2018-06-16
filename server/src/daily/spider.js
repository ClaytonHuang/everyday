const rp = require('request-promise')
const fs = require('fs')
const http = require('http')
const cheerio = require('cheerio')
const phantom = require('phantom')
const config = require('config')
var iconv = require('iconv-lite');
const moment = require('moment')
var getPixels = require("get-pixels")

const baseUrl = config.dailyBaseUrl
const basePath = config.basePath

const {   
  clearEverydayListFromRedis,
  setEverydayList2Redis,
  getTodayFromEverydaylist, 
  setEveryday2Redis 
} = require('./client')

phantom.outputEncoding='gbk'

getEverydayPage = () => {

  // 清空之前的链接表
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
  console.log(' ============ today ============ ')
  console.log(dailyUrl)
  try {
    /**
     * 改用 request-async，可能可以解决80端口问题？
     * 1、redis异步和http占用错误、
     * 2、request-async和http冲突问题
     */
    http.get(dailyUrl, res => {	
      var html = ''
      var size = 0
      res.on('data', chunk => { 
        html += iconv.decode(chunk, 'GBK')
      })
      res.on('end', () => {
        var $ = cheerio.load(html, {decodeEntities: false})
        $('.maintit').css('text-align', 'center')
        $('.sendvalue > strong > a').removeAttr('href')
        $('#DocContent').css('width', '90%')
        $('#DocContent').css('height', '100%')
        $('#DocContent').css('padding', '3% 5% 0')
        $('p > br').remove()
        $('#copy').remove()
        $('.icons').remove()

        // 根据体验问题，修改img size的配置
        $('img').each(function () {
          $(this).css('width', '100%')
          var imgHref = $(this).attr('src')
          if (imgHref.indexOf('www.tuweng.com/') < 0) {
            $(this).attr('src', 'http://www.tuweng.com' + imgHref)
          }
        })
        var firstImage = $('.content > p > img').get(0).attribs.src || 'http://img.mp.itc.cn/upload/20170721/ff18eb954be34d2e9fc5ad1280a362e4_th.jpg'
        var todayTitle = $('.maintit').html() || '没有找到标题哦'

        // 获取文本内容
        var htmlContent = $('#container').html()
        htmlContent = '<body style="background-color: white;">' + htmlContent + '</body>'
        transferHtml2JPG(htmlContent, firstImage, todayTitle)
      })
    })
  } catch (err) {
    console.log(err)
  }
}

// 将html转为图片
transferHtml2JPG = async (htmlContent, firstImage, todayTitle) => {
  const htmlPath = basePath + 'index.html' 
  fs.writeFileSync(htmlPath, htmlContent, 'utf-8')
  await saveImage2Static(firstImage, todayTitle)
}

// 将图片存入本地
saveImage2Static = async (firstImage, todayTitle) => {
  var instance = await phantom.create()
  var page = await instance.createPage()
  await page.property({ width: 1024 });

  // 直接从主页链接中加载今日文章的页面
  const status = await page.open(config.indexUrl)
  const todayDate = moment().format('YYYY-MM-DD')
  const saveImagePath = basePath + 'daily-images/' + todayDate + '.jpg' 
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

      // 保存到历史列表，用于今后浏览，也可作为今日列表的检索对象
      var todayInfo = {
        width: width,
        height: height,
        imgurl: firstImage,
        title: todayTitle,
        date: todayDate,
        linkurl: url
      }
      console.log(todayInfo)
      setEveryday2Redis(todayDate, todayInfo)
    })
  }
}

module.exports.getEverydayPage = getEverydayPage
module.exports.getToday = getToday