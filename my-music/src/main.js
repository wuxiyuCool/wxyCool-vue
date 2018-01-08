// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './common/css/reset.css'
import fastclick from 'fastclick'
import vuelazyload from 'vue-lazyload'
Vue.config.productionTip = false

fastclick.attach(document.body)
Vue.use(vuelazyload, {
  loading: require('./common/img/logo@3x.png')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
