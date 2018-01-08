import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '@/view/shouye/shouye'
import singer from '@/components/singer/singer'
import rank from '@/view/rank/rank'
import search from '@/view/serch/musicsearch'
import singerDetail from '@/components/singerchild/singer-detail'
import Disc from '@/components/disc/disc'
import TopList from '@/components/topList/index'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend',
      name: '主页'
    },
    {
      path: '/recommend',
      name: 'shouye',
      component: Recommend,
      children: [{
        path: ':id',
        component: Disc
      }]
    }, {
      path: '/singer',
      name: 'geshou',
      component: singer,
      children: [{
        path: ':id',
        component: singerDetail
      }]
    }, {
      path: '/rank',
      name: 'paihangbang',
      component: rank,
      children: [{
        path: ':id',
        component: TopList
      }]
    }, {
      path: '/search',
      name: '搜索页面',
      component: search,
      children: [{
        path: ':id',
        component: singerDetail
      }]
    }
  ]
})
