<template>
  <div class="musicheader">
    <div class="icon"></div>
    <h1 class="text">wxy Music</h1>
    <router-link tag="div" class="mine" to="/user">
      <i class="iconfont icon-icon-test20"></i>
    </router-link>
  </div>
</template>
<script>
  export default {}
</script>
<style>
  .musicheader{
    position: relative;
    height: 44px;
    text-align: center;
    color: aquamarine;
    background: skyblue;
    font-size: 0;
  }
  .icon{
    display: inline-block;
    vertical-align: top;
    margin-top: 6px;
    width: 30px;
    height: 32px;
    margin-right: 9px;
    background-size: 30px 32px;
  }
  .text{
    display: inline-block;
    vertical-align: top;
    line-height: 44px;
    font-size: 20px;
  }
  .mine{
    position: absolute;
    top:0;
    right: 0;

  }
  .icon-icon-test20{
    display: block;
    padding: 12px;
    font-size: 20px;
    color: aquamarine;
  }

</style>
