import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/css/global.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
import { Message } from 'element-ui'
Vue.prototype.$message = Message;
//清空表单
import resetForm from '@/utils/resetForm'
Vue.prototype.$resetForm = resetForm;
//对象快速复制
import objCopy from '@/utils/objCopy'
Vue.prototype.$objCopy = objCopy;
//信息提示框
import myconfirm from '@/utils/myconfirm'
Vue.prototype.$myconfirm = myconfirm;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
