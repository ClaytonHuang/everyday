const http = require('http')
const fs = require('fs')
const cheerio = require('cheerio')
const phantom = require('phantom')
const iconv = require('iconv-lite')
const config = require('config')
const moment = require('moment')
var getPixels = require("get-pixels")

const baseUrl = config.dailyBaseUrl
const basePath = config.basePath

const { setToday2Redis, setEveryday2Redis } = require('./client')

phantom.outputEncoding='gbk'

getDailyPage = () => {
  http.get(baseUrl, res => {
    var chunks = []
    var size = 0
    res.on('data', chunk => {
      chunks.push(chunk)
      size += chunk.length
    })
    res.on('end', () => {
      var data = Buffer.concat(chunks,size)
      var html = data.toString()
      // 完成后，提取每日推荐中的页面信息，可能要注意页面编码
      var $ = cheerio.load(html)
      const dailyUrl = $('#mrtj > .pic > a').attr('href')
      // 加上错误检验
      const saveResult = getContentHtml(dailyUrl)
    })
  })
}

getContentHtml = (dailyUrl) => {
  http.get(dailyUrl, res => {
    var html = ''
    var size = 0
    res.on('data', chunk => {
      html += iconv.decode(chunk, 'GBK')
    })
    res.on('end', () => {
      var $ = cheerio.load(html)
      // 对页面内容进行一些调整
      $('.maintit').css('text-align', 'center')
      $('.sendvalue > strong > a').removeAttr('href')
      $('#DocContent').css('width', '90%')
      $('#DocContent').css('height', '100%')
      $('#DocContent').css('padding', '3% 5% 0')
      $('p > br').remove()
      $('#copy').remove()
      $('.icons').remove()

      // 获取文本内容
      var htmlContent = $('#container').html()
      htmlContent = '<body style="background-color: white;">' + htmlContent + '</body>'
      transferHtml2JPG(htmlContent)
    })
  })
}

transferHtml2JPG = async (htmlContent) => {
  const htmlPath = basePath + 'index.html' 
  fs.writeFileSync(htmlPath, htmlContent, 'utf-8')
  await saveImage2Static(htmlPath)
}

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
      // TODO config中的
      const url = config.host + 'daily-images/' + moment().format('YYYY-MM-DD') + '.jpg'
      const width = imageShape[0]
      const height = imageShape[1]
      console.log({url, width, height})
      setToday2Redis(url, width, height)
      setEveryday2Redis(url, width, height)
    })
  }
}

module.exports.getDailyPage = getDailyPage