import Vue from "vue";
import Vuex from "vuex";
import  headerModule from './modules/headerModule'
import  realNameModule from './modules/realNameModule'
import  helpCenterModule from './modules/helpCenterModule'
Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        header: headerModule,
        realName: realNameModule,
        helpCenter: helpCenterModule
    }
})