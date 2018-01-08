<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgimg" :songs="songs"></music-list>
  </transition>
</template>
<script>
  import musicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getSongList} from '@/api/remen'
  import {ERR_OK} from '@/api/config'
  import {createSong} from '@/common/js/song'
  export default {
    data() {
      return {
        songs: []
      }
    },
    components: {
      musicList
    },
    mounted () {
      setTimeout(() => {
        this._getSongList()
      }, 50)
    },
    computed: {
      title() {
        return this.disc.dissname
      },
      bgimg() {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    methods: {
      _getSongList() {
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
          return
        }
        getSongList(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.cdlist[0].songlist)
            console.log(this.songs)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition all 0.3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
