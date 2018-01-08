<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-inner" @click="clickChang">
      <div class="progress" ref="progress" ></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchstart"
           @touchmove.prevent="progressTouchmove"
           @touchend="progressTouchend"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
  const progressBtnwidth = 16
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      clickChang(e) {
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - 7 - rect.left
        this._offset(offsetWidth)
        this._changePercent()
      },
      progressTouchstart(e) {
        this.touch.init = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
        this.initstop()
      },
      progressTouchmove(e) {
        if (!this.touch.init) {
          return
        }
        const Barwidth = this.$refs.progressBar.clientWidth - progressBtnwidth
        const deltaX = e.touches[0].pageX - this.touch.startX
        const offsetWidth = Math.min(Barwidth, Math.max(0, this.touch.left + deltaX))
        this._offset(offsetWidth)
        this._changeTime()
      },
      initstop() {
        const init = this.touch.init
        this.$emit('init', init)
      },
      _changeTime() {
        const Barwidth = this.$refs.progressBar.clientWidth - progressBtnwidth
        const percent = this.$refs.progress.clientWidth / Barwidth
        this.$emit('changeTime', percent)
      },
      progressTouchend (e) {
        this.touch.init = false
        // touch结束调用方法
        this._changePercent()
      },
      // progressBar 派发事件到上一级组件做出处理
      _changePercent () {
        const Barwidth = this.$refs.progressBar.clientWidth - progressBtnwidth
        const percent = this.$refs.progress.clientWidth / Barwidth
        const init = this.touch.init
        // 派发一个事件并且将percent传递到上一级函数
        this.$emit('percentChange', percent, init)
      },
      _offset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style['transform'] = `translate3d(${offsetWidth}px,0,0)`
      }
    },
    watch: {
      percent(newPercent) {
        if (newPercent >= 0 && !this.touch.init) {
          const Barwidth = this.$refs.progressBar.clientWidth - progressBtnwidth
          const offsetWidth = newPercent * Barwidth
          this._offset(offsetWidth)
        }
      }
    }
  }
</script>
<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
