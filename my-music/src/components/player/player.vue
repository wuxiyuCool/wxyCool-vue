<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img width="100%" height="100%" :src="currentSong.image">
      </div>
      <div class="top">
        <div class="back" @click="back">
          <i style="color: #ffcd32" class="iconfont icon-iconfontjiantouzuo"></i>
        </div>
        <h1 class="title-player" v-html="currentSong.name"></h1>
        <h2 class="subtitle" v-html="currentSong.singer"></h2>
      </div>
      <div class="middle" @touchstart.prevent="middleTStart"
           @touchmove.prevent="middleTMove"
           @touchend="middleTEnd"

      >
        <div class="middle-l" ref="middleL">
          <div class="cd-wrapper">
            <div class="cd" :class="cdrotate">
              <img v-lazy="currentSong.image" class="image" alt="">
            </div>
          </div>
          <div class="playing-lyric-wrapper">
          <div class="playing-lyric">{{playingLyr}}</div>
          </div>
        </div>
        <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
          <div class="lyric-wrapper">
            <div v-if="currentLyric">
              <p ref="lyricLine"
                 class="text-lyric"
                 :class="{'current': currentLyricLine === index}"
                 v-for="(line, index) in currentLyric.lines"
              >
                {{line.txt}}
              </p>
            </div>
          </div>
        </scroll>
      </div>
      <div class="bottom">
        <div class="dot-wrapper">
          <span class="dot" :class="{'active' : currentshow === 'cd'}"></span>
          <span class="dot" :class="{'active' : currentshow === 'lyr'}"></span>
        </div>
        <div class="progress-wrapper">
          <span class="time time-l" v-show="songReady">{{currentTime}}</span>
          <div class="progress-bar-wrapper">
            <progressBar @init="setinit" @changeTime="onChangeTime" @percentChange="onPregressChange" :percent="percent"></progressBar>
          </div>
          <span class="time time-r" v-show="songReady">{{duration}}</span>
        </div>
        <div class="operators">
          <!--随机播放-->
          <div class="icon i-left" @click="changeMode">
            <i class="iconfont" :class="iconMode"></i>
          </div>
          <!--上一曲-->
          <div class="icon i-left" :class="disable">
            <i @click="prev" class="iconfont icon-icon-test"></i>
          </div>
          <div  class="icon i-center" :class="disable">
            <i @click="togglePlaying" class="iconfont" :class="playIcon"></i>
          </div>
          <!--下一曲-->
          <div class="icon i-right" :class="disable">
            <i @click="next" class="iconfont icon-icon-test6"></i>
          </div>
          <!--喜欢-->
          <div class="icon i-right">
            <i class="iconfont icon-xihuan"></i>
          </div>
        </div>
      </div>
    </div>
    </transition>
    <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="open">
      <div class="icon">
        <img :class="cdrotate" :src="currentSong.image" alt="" style="width: 40px;height: 40px;padding: 0;margin-top: -5px;border: transparent;">
      </div>
      <div class="text">
        <h2 class="name12" v-html="currentSong.name"></h2>
        <p class="desc" >{{playingLyr}}</p>
      </div>
      <div class="control">
        <progress-circle :radius="32" :dashoffset="dashoffset">
        <i class="icon-mini iconfont" :class="playIcon" @click.stop="togglePlaying"></i>
        </progress-circle>
      </div>
      <div class="control">
      <i class="iconfont icon-icon-test14"></i>
    </div>
    </div>
    </transition>
    <audio ref="audio" :src="currentSong.url" @canplay="ready"
           @error="songError" @timeupdate="updatetime" @ended="end"></audio>
  </div>
</template>
<script>
  import {mapGetters, mapMutations} from 'vuex'
  import progressBar from '@/base/progressBar/progressBar'
  import progressCircle from '@/base/progressCircle/progressCircle'
  import {playMode} from '@/common/js/config'
  import {randomSong} from '@/common/js/until'
  import Lyric from 'lyric-parser'
  import Scroll from 'base/scroll/scroll'
  export default {
    components: {
      progressBar,
      progressCircle,
      Scroll
    },
    data() {
      return {
        songReady: false,
        currentTime: 0,
        currentTimebefor: 0,
        duration: 0,
        // circle参数传递
        dashoffset: 314,
        // 拖动判断
        init: false,
        currentLyric: null,
        currentLyricLine: 0,
        currentshow: 'cd',
        playingLyr: ''
      }
    },
    methods: {
      // timeupdate事件监听到当前播放时间
      updatetime (e) {
        // 防止拖动是继续监听时间
        if (this.init) {
          return
        }
        this.currentTime = this.shijan(e.target.currentTime)
        this.duration = this.shijan(e.target.duration)
        this.currentTimebefor = e.target.currentTime
      },
      shijan (time) {
        time = time | 0
        const minute = time / 60 | 0
        let second = time % 60 | 0
        // 在秒针在小于10的时候补0
        if (second < 10) {
          second = '0' + second
        }
        return `${minute}:${second}`
      },
      back () {
        this.setFullScreen(false)
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayMode: 'SET_PLAY_MODE',
        setPlayList: 'SET_PLAYLIST'
      }),
      open () {
        this.setFullScreen(true)
      },
      togglePlaying () {
        if (!this.songReady) {
          return
        }
        this.setPlayingState(!this.playing)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      prev () {
        if (!this.songReady) {
          return
        }
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
        // 设置标志减少点击速度过快
        this.songReady = false
      },
      next () {
        // 当标志为false时候不让他进行点击
        if (!this.songReady) {
          return
        }
        let index = this.currentIndex + 1
        if (index === this.playlist.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
        // 设置标志减少点击速度过快
        this.songReady = false
      },
      ready () {
        this.songReady = true
      },
      end () {
        if (this.mode === playMode.loop) {
          this.$refs.audio.currentTime = 0
          this.$refs.audio.play()
          if (this.currentLyric) {
            this.currentLyric.seek(0)
          }
        } else {
          this.next()
        }
      },
      songError () {
        this.songReady = true
        // 出错后跳到下一首歌曲
//        setTimeout(() => {
//          this.next()
//        }, 100)
      },
      setinit (init) {
        this.init = init
      },
      onPregressChange (percent, init) {
        const currentTime = this.currentSong.duration * percent
        this.$refs.audio.currentTime = this.currentSong.duration * percent
        this.init = init
        // 如果当歌曲没有播放时候拖动调用方法播放歌曲
        if (!this.playing) {
          this.togglePlaying()
        }
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      onChangeTime (percent) {
        this.currentTime = this.shijan(this.currentSong.duration * percent)
      },
      changeMode () {
        const mode = (this.mode + 1) % 3
        this.setPlayMode(mode)
        let songList = null
        if (mode === playMode.random) {
          songList = randomSong(this.sequenceList)
        } else {
          songList = this.sequenceList
        }
        this.resetCurrentIndex(songList)
        this.setPlayList(songList)
      },
      resetCurrentIndex (list) {
        let index = list.findIndex((item) => {
          return item.id === this.currentSong.id
        })
        this.setCurrentIndex(index)
      },
      // 歌词解析
      getLyric () {
        this.currentSong.getLyric().then((lyric) => {
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          } else {
            this.currentLyric.stop()
          }
        })
      },
      // lyric歌词框架的回调函数
      handleLyric ({lineNum, txt}) {
        this.currentLyricLine = lineNum
        if (lineNum > 6) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollToElement(0, 0, 1000)
        }
        this.playingLyr = txt
      },
      // 歌词滑动函数
      middleTStart (e) {
        this.touch.init = true
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTMove (e) {
        if (!this.touch.init) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        const left = this.currentshow === 'cd' ? 0 : -window.innerWidth
        const width = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        this.touch.precent = Math.abs(width / window.innerWidth)
        this.$refs.lyricList.$el.style['transform'] = `translate3d(${width}px, 0, 0)`
        this.$refs.lyricList.$el.style['webkitTransform'] = `translate3d(${width}px, 0, 0)`
        this.$refs.lyricList.$el.style['transition-duration'] = 0
        this.$refs.lyricList.$el.style['webkitTransition-duration'] = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.precent
      },
      middleTEnd (e) {
        let width
        let opacity
        if (this.currentshow === 'cd') {
          if (this.touch.precent > 0.4) {
            width = -window.innerWidth
            opacity = 0
            this.currentshow = 'lyr'
          } else {
            width = 0
            opacity = 1
          }
        } else {
          if (this.touch.precent < 0.6) {
            width = 0
            opacity = 1
            this.currentshow = 'cd'
          } else {
            opacity = 0
            width = -window.innerWidth
          }
        }
        this.$refs.lyricList.$el.style['transform'] = `translate3d(${width}px, 0, 0)`
        this.$refs.lyricList.$el.style['webkitTransform'] = `translate3d(${width}px, 0, 0)`
        this.$refs.lyricList.$el.style['transition-duration'] = `300ms`
        this.$refs.lyricList.$el.style['webkitTransition-duration'] = `300ms`
        this.$refs.middleL.style.opacity = opacity
      }
    },
    computed: {
      cdrotate() {
        return this.playing ? 'play' : 'pause'
      },
      iconMode() {
        return this.mode === playMode.sequence ? 'icon-icon-test8' : this.mode === playMode.loop ? 'icon-single-loop' : 'icon-icon-test9'
      },
      playIcon() {
        return this.playing ? 'icon-icon-test1' : 'icon-icon-test2'
      },
      disable() {
        return this.songReady ? '' : 'disable'
      },
      percent() {
        return this.currentTimebefor / this.currentSong.duration
      },
      ...mapGetters([
        'fullScreen',
        'playlist',
        'currentSong',
        'playing',
        'currentIndex',
        'mode',
        'sequenceList'
      ])
    },
    created() {
      this.touch = {}
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (newSong.id === oldSong.id) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.stop()
        }
        setTimeout(() => {
          this.$refs.audio.play()
          this.getLyric()
        }, 1000)
      },
      percent(newPercent) {
        // newPercent 下级progressBar传送的歌曲当前播放时间和总时间的比例
        // 传输子组建progressCricle的参数314为stroke-dasharray
        this.dashoffset = (1 - newPercent) * 314
      },
      playing(value) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          value ? audio.play() : audio.pause()
        })
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-iconfontjiantouzuo
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title-player
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          transition : opacity  .3s ease
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text-lyric
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name12
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-icon-test1, .icon-icon-test2, .icon-icon-test14
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
