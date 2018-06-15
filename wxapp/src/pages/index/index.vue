<template>
  <showaday :dailyUrl='dailyUrl' :height='height'></showaday>
</template>

<script>
import showaday from '@/components/showaday'

export default {
  data () {
    return {
      dailyUrl: 'http://bpic.ooopic.com/01/24/92/77b1OOOPICe3.jpg!/fw/750/quality/90/unsharp/true/compress/true/watermark/url/bG9nby53YXRlci52NS5wbmc=/repeat/true/align/center/format/webp',
      height: 650
    }
  },
  components: {
    showaday
  },
  onLoad: function (options) {
    // var that = this
    // const screenWidth = wx.getSystemInfoSync().windowWidth
    // wx.request({
    //   url: 'http://127.0.0.1:3030/api/daily/toay',
    //   success: function (res) {
    //     const data = res.data
    //     if (data.result) {
    //       that.dailyUrl = data.url
    //       that.height = (screenWidth * data.shape.height) / data.shape.width
    //     } else {
    //       console.log('error')
    //     }
    //   }
    // })
  }
}
</script>

<style>
</style>
