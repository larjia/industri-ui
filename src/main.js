import Vue from 'vue'

import Cookies from 'js-cookie'
import 'normalize.css/normalize.css'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css

import App from './App.vue'
import router from './router'
import store from './store'
// import permission from './directive/permission'

import './permission' // permission control

// 全局方法挂载

// 全局组件挂载
// Vue.use(permission)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
