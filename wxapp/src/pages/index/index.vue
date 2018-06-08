<template>
  <today :dailyUrl='dailyUrl' :height='height'></today>
</template>

<script>
import today from '@/components/today'

export default {
  data () {
    return {
      dailyUrl: '',
      height: 0
    }
  },
  components: {
    today
  },
  onLoad: function (options) {
    // 域名备案中，用本地接口开发
    // https://www.clayhuang.cn/everyday
    var that = this
    const screenWidth = wx.getSystemInfoSync().windowWidth
    wx.request({
      url: 'http://127.0.0.1:3030/api/daily/today',
      success: function (res) {
        const data = res.data
        console.log(data)
        if (data.result) {
          that.dailyUrl = data.url
          that.height = (screenWidth * data.shape.height) / data.shape.width
        } else {
          console.log('error')
        }
      }
    })
  }
}
</script>

<style>
</style>
