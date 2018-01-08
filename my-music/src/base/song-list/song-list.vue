<template>
    <div class="song-list">
      <ul>
        <li @click="selectItem(song,index)" class="item" v-for="(song,index) in songs">
          <div class="content">
            <h2 class="name">{{song.name ? song.name : song.songname}}</h2>
            <p class="desc">{{getDesc(song)}}</p>
          </div>
        </li>
      </ul>
    </div>
</template>
<script>
  import {mapGetters} from 'vuex'
  export default {
    props: {
      songs: {
        type: Array,
        default: []
      }
    },
    computed: {
      ...mapGetters([
        'singer'
      ])
    },
    methods: {
      selectItem(song, index) {
        this.$emit('select', song, index)
      },
      getDesc(song) {
        // 因为歌单获取到的歌曲列表与歌曲获取到的列表名字不同
        let singer = song.singer[0].name ? song.singer[0].name : song.singer
        let album = song.album ? song.album : song.albumname
        return `${singer}---${album}`
      },
      cons() {
        console.log(this.singer)
      }
    }
  }
</script>
<style>
  .song-list .item {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 70px;
  font-size: 16px;
  }
  .song-list .rank {
    flex: 0 0 25px;
    width: 25px;
    margin-right: 30px;
    text-align: center;
  }
  .song-list  .content {
    flex: 1;
    line-height: 20px;
    overflow: hidden;
  }
  .song-list .name {
    color: #ff22ea;
  }
  .song-list  .desc {
      margin-top: 4px;
      padding-left: 20px;
      color: #2252ff;
  }
</style>
