import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "@/store";
import '@/styles/index.scss'
import '@/styles/iconfont/iconfont.css'
import { TimeSelect, DatePicker ,Col} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import ccbJs from '@/pjf/ccbJs.common.js'
import { $axios, $myDecode } from '@/utils/myAxios.js'
import { $http } from '@/utils/http.js' //非 protobuf 的 ajax 请求
Vue.use(ccbJs);
Vue.use(TimeSelect);
Vue.use(DatePicker);
Vue.use(Col);
Vue.config.productionTip = false;

Object.assign(Vue.prototype, {$axios, $myDecode, $http});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
