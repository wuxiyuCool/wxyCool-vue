<template>
  <transition name="singer-farm">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import MusicList from 'components/music-list/music-list'
  export default {
    components: {
      MusicList
    },
    data() {
      return {
        songs: []
      }
    },
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    created() {
      this.getDetail()
    },
    methods: {
      // 当在歌手也面刷新时候将起跳转歌手list页面
      getDetail() {
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      golist() {
        this.$router.push({
          path: `/singer`
        })
      }
    }
  }
</script>
<style>
 .singer-detail{
   position: fixed;
   z-index: 31;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   background-color: skyblue;
 }
 .detail-header i,a{
   line-height: 50px;
   font-size: 36px;
   color: hotpink;
   text-decoration: none;
 }
  .singer-farm-enter-active,.singer-farm-leave-active{
    transition: all .3s;
  }
 .singer-farm-enter,.singer-farm-leave-to{
   transform: translate3d(100%,0,0);
 }
</style>
