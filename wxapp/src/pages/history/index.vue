<template>
  <div>
    <everyday-item v-for='iteminfo in everydaylist'
      :key='iteminfo.uploadtime' 
      :imgurl='iteminfo.imgurl'
      :title='iteminfo.title'
      :date='iteminfo.date'
    >
    </everyday-item>
  </div>
</template>

<script>
import everydayItem from '@/components/everyday-item'

export default {
  data () {
    return {
      everydaylist: []
    }
  },
  components: {
    'everyday-item': everydayItem
  },
  onLoad: function (options) {
    var that = this
    var host = 'http://127.0.0.1:3030'
    if (process.env.NODE_ENV === 'production') {
      host = 'https://www.clayhuang.cn/everyday'
    }
    wx.request({
      url: host + '/api/daily/everyday',
      success: function (res) {
        const { data } = res
        if (data.result) {
          that.everydaylist = data.message
        }
      }
    })
  }
}
</script>