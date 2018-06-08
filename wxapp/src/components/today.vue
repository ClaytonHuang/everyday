<template>
  <img :src='dailyUrl' class='today-image' :style='{height: height + "px"}'/>
</template>

<script>
export default {
  props: ['dailyUrl', 'height']
}
</script>

<style>
.today-image {  
    width:100%; 
} 
</style>