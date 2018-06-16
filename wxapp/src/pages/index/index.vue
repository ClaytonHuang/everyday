<template>
  <show-oneday :dailyUrl='dailyUrl' :height='height'></show-oneday>
</template>

<script>
import showOneday from '@/components/show-oneday'

export default {
  data () {
    return {
      dailyUrl: '',
      height: 0
    }
  },
  components: {
    'show-oneday': showOneday
  },
  onLoad: function (options) {
    var that = this
    var host = 'http://127.0.0.1:3030'
    if (process.env.NODE_ENV === 'production') {
      host = 'https://www.clayhuang.cn/everyday'
    }
    const screenWidth = wx.getSystemInfoSync().windowWidth
    wx.request({
      url: host + '/api/daily/today',
      success: function (res) {
        const data = res.data
        if (data.result) {
          const {message} = data
          that.dailyUrl = message.linkurl
          that.height = (screenWidth * message.height) / message.width
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
