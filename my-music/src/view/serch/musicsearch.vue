<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="searchquery"></search-box>
    </div>
    <div class="shortcut-wrapper">
      <scroll class="shortcut" :data="shortcut">
        <div>
        <div class="hot-key">
          <h1 style="margin-bottom: 10px" >热门搜索</h1>
          <ul><li @click="addquery(hotkey,index)" class="item" v-for="(hotkey,index) in hotkeys">{{hotkey.k}}</li></ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <div class="search-title"><span >播放历史</span> <i @click="clearSearchHistory" class="iconfont icon-cha"></i></div>
          <search-list @select="addquery" @delete="deleteSearchHistory" :data="searchHistory"></search-list>
        </div>
        </div>
      </scroll>
    </div>
    <div v-show="query" class="search-result">
      <suggest @select="savesearch" :query="query"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import searchBox from 'base/search/searchBox'
  import {getHotKey} from '@/api/search'
  import {ERR_OK} from '@/api/config'
  import Suggest from 'components/suggest/suggest'
  import scroll from 'base/scroll/scroll'
  import {mapActions, mapGetters} from 'vuex'
  import searchList from '@/base/search-list/searchList'
  export default {
    components: {
      searchBox,
      Suggest,
      scroll,
      searchList
    },
    mounted () {
      setTimeout(() => {
        this._getHotKey()
      }, 50)
    },
    data() {
      return {
        hotkeys: '',
        query: ''
      }
    },
    computed: {
      ...mapGetters([
        'searchHistory'
      ]),
      shortcut() {
        return this.hotkeys.concat(this.searchHistory)
      }
    },
    methods: {
      _getHotKey() {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            console.log(res.data.hotkey)
            this.hotkeys = res.data.hotkey.slice(0, 10)
          }
        })
      },
      addquery(hotkey) {
        this.$refs.searchBox.setquery(hotkey.k ? hotkey.k : hotkey)
      },
      searchquery(newquery) {
        this.query = newquery
      },
      // action可以直接使用属于函数方法
      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory',
        'clearSearchHistory'
      ]),
      savesearch() {
        this.saveSearchHistory(this.query)
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            border 1px solid skyblue
            font-size: $font-size-medium
            color: skyblue
        .search-history
            position: relative
            margin: 0 20px
          .search-title
            display: flex
            justify-content space-between
            align-items: center
            padding 0 10px
            height: 40px
            font-size: $font-size-medium
            color: #444444
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
