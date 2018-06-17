<template>
  <img :src='dailyUrl' class='today-image' :style='{height: caclHeight + "px"}'/>
</template>

<script>
export default {
  props: ['dailyUrl', 'width', 'height'],
  computed: {
    caclHeight: function () {
      const screenWidth = wx.getSystemInfoSync().windowWidth
      return (screenWidth * this.height) / this.width
    }
  }
}
</script>

<style>
.today-image {  
    width:100%; 
} 
</style>