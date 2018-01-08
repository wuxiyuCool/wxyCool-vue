<template>
  <div id="app">
    <music></music>
    <tab></tab>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <player></player>
    <!--// <player/>-->
  </div>
</template>

<script>
  import music from '@/components/mheader/myindex.vue'
  import tab from '@/components/tab'
  import player from '@/components/player/player'
export default {
    name: 'app',
    components: {
      music,
      tab,
      player
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "common/stylus/variable.styl"

</style>
