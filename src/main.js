import Vue from 'vue'
import App from './App.vue'
import VueRx from 'vue-rx'
import store from './store'

Vue.use(VueRx)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
