<template>
  <div class="music-list">
    <div class="back"><i class="iconfont icon-iconfontjiantouzuo" @click="back"></i></div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper" ref="playW">
        <div @click="random" class="play" v-show="songs.length>0">
          <i  class="iconfont icon-icon-test9"></i>
          <span class="text1">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" class="list" ref="songList">
      <div class="song-list-wrapper">
        <SongList @select="selectItem" v-bind:songs="songs"></SongList>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script>
  import scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import loading from 'base/loading/index'
  import {mapActions} from 'vuex'
  export default {
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      }
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight
      // layer向上滚动的界限值
      this.minTranslateY = -this.imageHeight + 40
      this.$refs.songList.$el.style.top = `${this.imageHeight}px`
    },
    computed: {
      bgStyle() {
        return `background-image: url(${this.bgImage})`
      }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
    },
    data() {
      return {
        scrollY: 0,
        imageHeight: 0,
        minTranslateY: 0
      }
    },
    methods: {
      back() {
        this.$router.push({
          path: `./`
        })
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      selectItem(song, index) {
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      random() {
        this.randomPlay({
          list: this.songs
        })
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    watch: {
      scrollY(newY) {
        let Y1 = Math.max(this.minTranslateY, newY)
        let bgzIndex = 0
        // 图片放大效果
        let scale = 1
        // 图片模糊效果
        let blur = 0
        this.$refs.layer.style['transform'] = `translate3d(0,${Y1}px,0)`
        this.$refs.layer.style['webkitTransform'] = `translate3d(0,${Y1}px,0)`
        const fangda = Math.abs(newY / this.imageHeight)
        if (newY > 0) {
          scale = 1 + fangda
          bgzIndex = 10
        } else {
          blur = Math.min(20 * fangda, 20)
        }
        this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`
        this.$refs.filter.style['webkitBackdrop-filter'] = `blur(${blur}px)`
        if (newY < Y1) {
          bgzIndex = 10
          let bg = this.$refs.bgImage
          bg.style.paddingTop = 0
          bg.style.height = '40px'
          this.$refs.playW.style.display = 'none'
        } else {
          let bg = this.$refs.bgImage
          bg.style.paddingTop = '70%'
          bg.style.height = '0px'
          this.$refs.playW.style.display = ''
        }
        this.$refs.bgImage.style.zIndex = bgzIndex
        this.$refs.bgImage.style['transform'] = `scale(${scale})`
        this.$refs.bgImage.style['webkitTransform'] = `scale(${scale})`
      }
    },
    components: {
      scroll,
      SongList,
      loading
    }
  }
</script>
<style>
  .music-list {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: skyblue;
  }
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
  }
  .back i{
    font-size: 30px;
  }
  .title {
    position: absolute;
    top: 5px;
    left: 10%;
    z-index: 40;;
    width: 80%;
    text-align: center;
  }
  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;
  }
  .play-wrapper {
    position: absolute;
    bottom: 20px;
    z-index: 50;
    width: 100%;
  }
  .play {
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid yellow;
    color: grey;
    border-radius: 100px;
    font-size: 0
  }
  .play i{
    display: inline-block;
    vertical-align: middle;
    margin-right: 6px;
    font-size: 16px;
    color: #ff6700;
  }
  .text1 {
    display: inline-block;
    vertical-align: middle;
    font-size: 16px;
    color: #CCC;
  }
  . .filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7, 17, 27, 0.4);
  }
  .bg-layer {
    position: relative;
    height: 100%;
    background-color: skyblue;
  }
  .list{
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background:skyblue;
  }
  .song-list-wrapper {
    padding: 20px 30px;
  }
  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
