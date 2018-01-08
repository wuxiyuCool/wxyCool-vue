<template>
  <scroll class="suggest" :data="result"
        ref="suggest"  :pullup="pullup" @scrollToEnd="searchmax">
    <ul class="suggest-list">
      <li  v-for="(item,index) in result" class="suggest-item">
        <div class="icon">
          <i class="iconfont" :class="getIcon(item)"></i>
        </div>
        <div @click="searchlist(item)" class="name">
          <p class="text" v-html="getdiplayname(item)"></p>
        </div>
      </li>
      <loading v-show="hasmore"></loading>
    </ul>
  </scroll>
</template>
<script>
  import {search} from '@/api/search'
  import {ERR_OK} from '@/api/config'
  import {createSong} from 'common/js/song'
  import scroll from 'base/scroll/scroll'
  import loading from 'base/loading/index'
  import Singer from 'common/js/singer'
  import {mapMutations, mapActions} from 'vuex'
  const TYPE_SINGER = 'singer'
  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      showsinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        page: 1,
        result: [],
        pullup: true,
        hasmore: true
      }
    },
    methods: {
      search() {
        this.page = 1
        this.hasmore = true
        this.$refs.suggest.scrollTo(0, 0)
        search(this.query, this.page, this.showsinger).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._geResult(res.data)
//            console.log(this.result)
          }
        })
      },
      searchmax() {
        if (!this.hasmore) {
          return
        }
        this.page += 1
        search(this.query, this.page, this.showsinger).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._geResult(res.data))
//            console.log(this.result)
          }
        })
      },
      getdiplayname(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      searchlist(item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
//        console.log('派发事件select')
        this.$emit('select')
      },
      getIcon(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-icon-test19'
        } else {
          return 'icon-icon-test13'
        }
      },
      _geResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          ret = ret.concat(this._normallist(data.song.list))
//          console.log(this._normallist(data.song.list))
        }
        return ret
      },
      _normallist(list) {
        let ret = []
//        console.log(list)
        list.forEach((musicdata) => {
          if (musicdata.songid && musicdata.albumid) {
            ret.push(createSong(musicdata))
          }
        })
        return ret
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query() {
        this.search()
      }
    },
    components: {
      scroll,
      loading
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .suggest
    height: 100%
    overflow: hidden
    background: skyblue
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        i
          line-height: 30px
      .name
        flex: 1
        font-size: 16px
        color: whitesmoke
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
