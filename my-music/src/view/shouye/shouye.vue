<template>
  <scroll v-if="recommend.length" class="recommend" :data="disclist">
    <div>
    <Warrper>
          <img v-lazy="item.picUrl" v-for="item in recommend" />
    </Warrper>
      <div class="remen" >
      <div class="remen-head">
        <span class="remen-head-font">热门歌单推荐</span>
      </div>
      <div class="remen-body">
          <ul>
          <li @click="selectItem(lists)" class="remen-list" v-for="lists in disclist">
            <div class="remen-list-left">
              <img v-lazy="lists.imgurl" alt="">
            </div>
            <div class="remen-list-right">
              <div class="remen-list-author">
                <span v-html="lists.creator.name"></span>
              </div>
              <div class="remen-list-ti">
                <p v-html="lists.dissname"></p>
              </div>
            </div>
          </li>
            </ul>
      </div>
        <div v-show="!disclist.length" class="loading-content">
          <loading></loading>
        </div>
    </div>
  </div>
    <router-view/>
  </scroll>
</template>
<script>
  import loading from '@/base/loading/index'
  import Warrper from '@/base/warrper'
  import scroll from 'base/scroll/scroll'
  import {getRecommend, getRemengedan} from '@/api/remen'
  import {ERR_OK} from '@/api/config'
  import {mapMutations} from 'vuex'
  export default {
    data () {
      return {
        recommend: [],
        disclist: []
      }
    },
    components: {
      Warrper,
      loading,
      scroll
    },
    created () {
      this._getRecommend()
      setTimeout(() => {
        this._getGedan()
      }, 40)
    },
    methods: {
      // 轮播图数据获取
      _getRecommend () {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
//            console.log(res.data.slider)
            this.recommend = res.data.slider
          }
        })
      },
      // 获取list数据
      _getGedan() {
        getRemengedan().then((res) => {
          if (res.code === ERR_OK) {
            this.disclist = res.data.list
          }
        })
      },
      selectItem(item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setDisc(item)
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    }
  }
</script>
<style>
  .shouye{
    width: 100%;
  }
  .recommend{
    width: 100%;
    height: 600px;
  }
  .tuijian{
    width: 100%;
    height: 300px;
    background: yellow;
  }
  .remen{
    background: deepskyblue;
  }
  .remen-head{
    width: 100%;
    height: 50px;
    text-align: center;
    background: skyblue;
  }
  .remen-body{
    width: 100%;
    height: 100%;
  }
  .remen-head-font{
    font-size: 18px;
    color: grey;
    line-height: 50px;
  }
  .remen-list{
    height: 11%;
    display: flex;
    flex-direction: row;
    background: #444;
  }
  .remen-list-left{
    height: 80px;
    width: 30%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .remen-list-left img{
    height: 50px;
    width: 70px;
  }
  .remen-list-right{
    height: 80px;
    width: 70%;
    display: flex;
    flex-direction: column;
  }
  .remen-list-author{
    height: 30px;
    color: aliceblue;
    display: flex;
    padding-left: 40px;
    align-items: center;
  }
  .remen-list-ti{
    height: 50px;
    width: 100%;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: aliceblue;
  }
  .loading-content{
    width: 100%;
    height: 50px;
    margin: 0 auto;
  }
</style>
