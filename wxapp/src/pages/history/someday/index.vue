<template>
  <show-oneday :dailyUrl='somedayUrl' :width='width' :height='height'></show-oneday>
</template>

<script>
import showOneday from '@/components/show-oneday'

export default {
  data () {
    return {
      somedayUrl: '',
      height: 0
    }
  },
  onLoad: function (options) {
    this.somedayUrl = options.linkurl
    this.width = options.width
    this.height = options.height
  },
  components: {
    'show-oneday': showOneday
  }
}
</script>