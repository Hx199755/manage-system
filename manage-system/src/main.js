// 引入vue
import Vue from 'vue'
//引入axios
import axios from 'axios'
// 引入elementui的组件 和 样式
import ElementUI from 'element-ui'; // 组件文件（js）
import 'element-ui/lib/theme-chalk/index.css'; // 样式文件

// 引入顶级组件 App.vue
import App from './App.vue'
// 引入路由文件
import router from './router'

// 引入公用样式
import '@/styles/common.less';

// 使用elementui
Vue.use(ElementUI);

//把axios挂在vue实例对象 被所有vue实例对象共享
Vue.prototype.axios = axios;

//  阻止生产提示
Vue.config.productionTip = false

// 创建vue实例对象 
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
