<template>
  <Scroll v-bind:data="data" class="list-view"  ref="listview"
          :listenScroll="listenScroll"
          @scroll="scroll">
    <ul>
      <li  v-for="group in data"  class="list-group" ref="listGroup">
        <h2 class="list-group-title"> {{group.title}} </h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}  </span>
          </li>
        </ul>
      </li>
    </ul>

    <!--右侧快速定位列表-->
    <div class="list-shortcut" @touchstart="onshortcuttouchstart"  @touchmove.stop.prevent="onshortcuttouchmove">
      <ul>
        <li class="item" v-for="(item,index) in shortcutList"
            :data-index="index" :class="{'current': currentIndex===index}"
            @click="setcurrent(index)"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <div class="loading-container">
      <div v-show="!data.length">
      <loading></loading>
      </div>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed" >
      <h1 class="fixed-title">{{fixedTitle}} </h1>
    </div>
  </Scroll>
</template>
<script>
  import Scroll from '@/base/scroll/scroll'
  import {getData} from 'common/js/dom'
  import loading from 'base/loading/index'

  const singerIndex = 22
  export default {
    created() {
      this.touch = {}
      this.listenScroll = true
    },
    data() {
      return {
        scrollY: 0,
        currentIndex: 0,
        dataTitle: '',
        diff: -1
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    // vue计算属性可以写入页面中间{{sssss}}
    computed: {
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      // 计算出Data数据里面的title使用三元运算符计算出来
      fixedTitle() {
        if (this.scrollY > 0) {
          return ''
        }
        this.dataTitle = this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
        return this.dataTitle
      }
    },
    methods: {
      // 让点击能够跳转到那个list-Group下
      onshortcuttouchstart(el) {
        // 定义getINdex获取这个传人对象的data的index数据
        let getIndex = getData(el.target, 'index')
        // 获取点击时候的位置
        let firstTouch = el.touches[0]
        // 将获取到的位置放入data中的touch数组中
        this.touch.y1 = firstTouch.pageY
        this.touch.singerIndex = singerIndex
        this._scrollTo(getIndex)
      },
      onshortcuttouchmove(el) {
        // 获取到移动时候的位置
        let firstTouch = el.touches[0]
        let starTouch = 168
        this.touch.y2 = firstTouch.pageY
        // 将移动的位置坐标减去热门坐标并且除以每个的高度在进行取整运算
        let getIndex = parseInt((firstTouch.pageY - starTouch) / 20.8)
        // 当getIndex= 负数的时候让他取一个反值
        if (getIndex < 0) {
          getIndex = 0
          getIndex = Math.abs(getIndex)
        } else if (getIndex >= 22) {
          getIndex = 22
        }
        this.currentIndex = getIndex
        this._scrollTo(getIndex)
      },
      setcurrent(index) {
        // 用于点击侧边栏点击是将其高亮
        this.currentIndex = index
      },
      _scrollTo(index) {
        // 定义一个方法获取跳转方法
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      scroll(pos) {
        // 获取scroll滚动时候的Y
        this.scrollY = pos.y
      },
      _calculateHeight() {
        // 将每个listGroup的高度计算出来并把它push进一个数组
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      // 事件派发到上一级组件
      selectItem(item) {
        this.$emit('select', item)
      }
    },
    watch: {
      // 让vue观察data和scroll发生数据变化时候并执行响应度函数
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 30)
      },
      scrollY(newY) {
        const listHeight = this.listHeight
        for (let i = 0; i < listHeight.length; i++) {
          let heighttop = listHeight[i]
          let heightdown = listHeight[i + 1]
          if (!heightdown || (-newY > heighttop && -newY < heightdown)) {
            this.currentIndex = i
            this.diff = heightdown + newY
//            console.log(this.diff)
            return
          }
        }
      },
      // 监听diff数据发生改变时候判断是否正在切换列表，切换列表时候进行transform动画
      diff(value) {
        let fixedTop = (value > 0 && value < 30) ? value - 30 : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        console.log(this.fixedTop)
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },
    components: {
      Scroll,
      loading
    }
  }
</script>
<style >
  .list-view {
    position: relative;
    width: 100%;
    /*限制高度才能够让better-scroll*/
    height: 600px;
    overflow: hidden;
    background: skyblue;
  }
    .list-group{
      padding-bottom: 30px;
  }
  .list-group-title {
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    font-size: 16px;
    color: grey;
    background: dodgerblue;
  }
      .list-group-item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
      }
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
        }
        .name {
          margin-left: 20px;
          color:  dodgerblue;
          font-size: 16px;
        }
    .list-shortcut {
      position: absolute;
      z-index: 30;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-radius: 10px;
      text-align: center;
      background: dodgerblue;
      font-family: '华文楷体';
    }
      .item {
        padding: 3px;
        line-height: 1;
        color: #d5ff54;
        font-size: 16px;
      }
        .current{
        color: hotpink;
      }
    .list-fixed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
      .fixed-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: 16px;
        color: hotpink;
        background: dodgerblue;
      }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
</style>
