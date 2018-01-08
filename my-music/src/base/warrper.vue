<template>
  <div class="slider" ref="slider">
    <div class="warrper" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dot-box">
      <ul>
        <li  v-on:click="_setSliderWidth(index)"  v-for="(item,index) in dots" :class="{active: currentPageIndex === index}" class="dot"></li>
      </ul>
    </div>
    </div>
</template>
<script>
  import dot from '@/base/warrperdot'
  //  better-scrool是一个轮播滚动的框架主要运行在vue上面
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/banner'
export default {
    data () {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 3000
      }
    },
    mounted () {
      //  掩饰函数是为了在获得所有数据后使用对应的函数以免报错
      setTimeout(() => {
        this._setwarrperWidth()
        this._initdots()
        this._initSlider()
        if (this.autoPlay) {
          this._play()
        }
      }, 80)
      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }
        this._setwarrperWidth(true)
        this.slider.refresh()
      })
    },
    methods: {
      //  设置warpper的宽度以便于能够滚动
      _setwarrperWidth (methods) {
        this.children = this.$refs.sliderGroup.children
        let width = 0
        let WarrperWidth = this.$refs.slider.clientWidth
        console.log(WarrperWidth)
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'warrper-img')
          child.style.width = WarrperWidth + 'px'
          width += WarrperWidth
        }
        if (this.loop && !methods) {
          width += 2 * WarrperWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      //  轮播图模块可以滑动实现
      _initSlider () {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: true
          },
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400
        })
        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX
          if (this.loop) {
            pageIndex -= 1
          }
          //  因为使用了延迟播放所以要循环调用
          this.currentPageIndex = pageIndex
          if (this.autoPlay) {
            clearTimeout(this.timer)
            this._play()
          }
        })
      },
      //  push5个空的值的数组进行遍历小点
      _initdots () {
        this.dots = new Array(this.children.length)
      },
      //  轮播与点之间联系并且滚动
      _play () {
        let pageIndex = this.currentPageIndex + 1
        if (this.loop) {
          pageIndex += 1
        }
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      },
      //  点击小点进行图片切换
      _setSliderWidth (isResize, i) {
        this.slider.goToPage(isResize + 1, 0, 400)
      }
    },
    components: {
      dot
    }
}
</script>
<style>
  .slider{
    position: relative;
    max-height: 200px;
    overflow: hidden;
  }
  .warrper{
    position: relative;
    display: flex;
    overflow: hidden;
    flex-direction: row;
  }

  .warrper-img{
    width: 100%;
    max-height: 200px;
    overflow: hidden;
  }
  .dot-box {
       width: 100px;
       height: 15px;
       position: absolute;
       left: 50%;
       bottom: 20%;
       transform: translate(-50%,100%);

     }
  .dot{
    width: 10px;
    height: 10px;
    margin: 2px;
    display: inline-block;
    background: dodgerblue;
    border-radius: 50%;
  }
  .active{
    width: 18px;
    border-radius: 40%;
  }
</style>
