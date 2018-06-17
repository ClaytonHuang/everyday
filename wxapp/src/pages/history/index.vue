<template>
  <div>
    <everyday-item v-for='item in everydaylist'
    v-on:somedayclick="openSomeday(item)"
      :key='item.uploadtime' 
      :imgurl='item.imgurl'
      :title='item.title'
      :date='item.date'
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
    var host = 'https://www.clayhuang.cn/everyday'
    wx.request({
      url: host + '/api/daily/everyday',
      success: function (res) {
        const { data } = res
        if (data.result) {
          that.everydaylist = data.message
        }
      }
    })
  },
  methods: {
    openSomeday ({linkurl, width, height}) {
      const pageUrl = `./someday/main?linkurl=${linkurl}&width=${width}&height=${height}`
      wx.navigateTo({
        url: pageUrl,
        success: function () {
        }
      })
    }
  }
}
</script>