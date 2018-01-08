<template>
  <div :data="data" class="search-list">
    <ul>
      <li @click="selectItem(item)" v-for="item in data" class="search-item">
         <span class="text">{{item}}</span>
         <span class="icon" @click.stop="deleteOne(item)">
          <i  class="iconfont icon-cha"></i>
        </span>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },
      deleteOne (item) {
        this.$emit('delete', item)
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-list
    .search-item
      display: flex
      align-items: center
      justify-content space-between
      padding: 5px 10px
      margin: 0 20px 5px 0
      height: 30px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: skyblue
        font-size $font-size-medium
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>
