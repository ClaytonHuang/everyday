<template>
  <today :dailyUrl='dailyUrl' :height='height'></today>
</template>

<script>
import today from '@/components/today'

export default {
  data () {
    return {
      dailyUrl: '',
      height: 3420
    }
  },
  components: {
    today
  },
  onLoad: function (options) {
    var that = this
    wx.request({
      url: 'https://www.clayhuang.cn/everyday/api/daily/today',
      success: function (res) {
        const data = res.data
        if (data.result) {
          that.dailyUrl = data.url
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
