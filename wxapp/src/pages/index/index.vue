<template>
  <today :dailyUrl='dailyUrl' :height='height'></today>
</template>

<script>
import today from '@/components/today'

export default {
  data: {
    dailyUrl: 'https://www.clayhuang.cn/everyday/daily-images/2018-06-08.jpg',
    height: 1800
  },
  components: {
    today
  },
  onLoad: function (options) {
    wx.request({
      url: 'https://www.clayhuang.cn/everyday/api/daily/today',
      success: function (res) {
        console.log(res)
      }
    })
  }
}
</script>

<style>
</style>
