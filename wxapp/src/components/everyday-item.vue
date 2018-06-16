<template>
  <div class='everyday-item'>
    <img :src='imgurl' />
    <div>
      <p>{{title}}</p>
      <p>{{uploadtime}}</p>
    </div>

  </div>
</template>

<script>
export default {
  props: ['imgurl', 'title', 'uploadtime']
}
</script>

<style>
.everyday-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 120px;
  margin: 1% 0%;

  border-bottom: gray 1px;
  box-shadow: darkgrey 2px 2px 3px 2px
}

.everyday-item > img:first-child {
  width:25%;
  max-height: 80%;
  margin-left: 5%;
  overflow:hidden;
  border-radius:4rpx;
}

.everyday-item > div {
  display: flex;
  margin-left: 10%;
  max-width: 50%;
  flex-direction: column;
}

.everyday-item > div > p:first-child {
  font-size: 24px;
  max-height: 66px;
  overflow: hidden;
  margin: 3px 0
}

.everyday-item > div > p:last-child {
  font-size: 14px
}

.everyday-item > img:last-child {
  width: 30px;
  height: 30px
}
</style>