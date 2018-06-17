<template>
  <show-oneday :dailyUrl='dailyUrl' :width='width' :height='height'></show-oneday>
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
    var host = 'https://www.clayhuang.cn/everyday'
    wx.request({
      url: host + '/api/daily/today',
      success: function (res) {
        const data = res.data
        if (data.result) {
          const {message} = data
          that.dailyUrl = message.linkurl
          that.width = message.width
          that.height = message.height
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
