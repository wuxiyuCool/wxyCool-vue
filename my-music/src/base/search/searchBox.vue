<template>
  <div class="search-box">
    <i class="iconfont icon-sousuo "> </i>
    <input class="box" type="text" v-model="query" :placeholder="placeholder">
    <i style="color: whitesmoke" @click="clearQuery" class="iconfont icon-cha" v-show="query"></i>
  </div>
</template>
<script>
  export default {
    props: {
      placeholder: {
        type: String,
        default: '输入歌手或歌曲'
      }
    },
    data() {
      return {
        query: ''
      }
    },
    methods: {
      clearQuery() {
        this.query = ''
      },
      setquery(query) {
        this.query = query
      }
    },
    watch: {
      query(newQuery) {
        // eslint-disable-next-line
        clearTimeout(timer)
        let timer = setTimeout(() => {
          this.$emit('query', newQuery)
        }, 200)
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 15px
    height: 40px
    background: skyblue
    border-radius: 6px
    i
      color: whitesmoke
      font-size: 16px
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: skyblue
      color: $color-text
      font-size: $font-size-medium
      outline: none
      border: none
      &::placeholder
        color: #eee
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
