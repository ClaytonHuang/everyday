<template>
  <div>
    <everyday-item v-for='iteminfo in everydaylist'
      :key='iteminfo.uploadtime' 
      :imgurl='iteminfo.imgurl'
      :title='iteminfo.title'
      :uploadtime='iteminfo.uploadtime'
    >
    </everyday-item>
  </div>
</template>

<script>
import everydayItem from '@/components/everyday-item'

export default {
  data () {
    return {
      everydaylist: [
        {
          imgurl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529086342315&di=2db92615087f2510aa4b5e56009105c0&imgtype=0&src=http%3A%2F%2Fimg4q.duitang.com%2Fuploads%2Fitem%2F201502%2F20%2F20150220214233_WYZ2a.thumb.700_0.jpeg',
          title: '测试用的pika',
          uploadtime: '2018-06-15'
        }, {
          imgurl: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1436948145,4270509323&fm=200&gp=0.jpg',
          title: '测试用的pika2，这个标题有点长，再长一些更长一些？',
          uploadtime: '2018-06-15'
        }
      ]
    }
  },
  components: {
    'everyday-item': everydayItem
  },
  onLoad: function (options) {
    // Get everydaylist

  }
}
</script>