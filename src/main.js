import Vue from 'vue'

import Cookies from 'js-cookie'
import 'normalize.css/normalize.css'

import Element from 'element-ui'
import '@/assets/styles/element-variables.scss'
import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css

import App from './App.vue'
import router from './router'
import store from './store'
// import permission from './directive/permission'

import '@/assets/icons' // icon
import './permission' // permission control

import { getDicts } from '@/api/system/dict/data'
import { parseTime, resetForm, addDateRange, selectDictLabel, download, handleTree } from '@/utils/dc'
import Pagination from '@/components/Pagination'

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree

Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: 'success' })
}

Vue.prototype.msgError = function (msg) {
  this.$message({ showClose: true, message: msg, type: 'error' })
}

Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg)
}

// 全局组件挂载
Vue.component('Pagination', Pagination)

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
