<template>
  <div  ref="gedanlist">
    <slot></slot>
  </div>
</template>
<script>
  import Bscroll from 'better-scroll'
  export default {
    props: {
      probeType: {
        type: Number,
        default: 3
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      pullup: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 50)
    },
    methods: {
      _initScroll() {
        if (!this.$refs.gedanlist) {
          return
        }
        this.scroll = new Bscroll(this.$refs.gedanlist, {
          // 节流功能1代表节流3代表不节流
          probeType: this.probeType,
          scrollX: false,
          scrollY: true,
          momentum: true,
          snapSpeed: 400,
          snapThreshold: 0.3
        })
        if (this.listenScroll) {
          let me = this
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos)
          })
        }
        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd')
            }
          })
        }
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this.refresh()
        }, 50)
      }
    }
  }
</script>

