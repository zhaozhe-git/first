import Vue from 'vue';
import Vuex from 'vuex';
import http from './util/http'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    personInfo: {},
    teacherInfo:{},
    footerShow: false, // 底部tab
    foooterName: '',
    config: '',
    loginparams: {},
    search_input: '', //上次搜索
    search_history: [], //搜索历史记录
    keywords: '',
    app: '',
    back_normal: 0 ,  //判断当前在app内打开的webview页面 页面点击返回按钮存在关闭webview的逻辑下是否需要不关闭而按照正常router返回上一级h5页面，现阶段主要用户一对一课程提交订单的时候点击返回关闭整个webview, 暂使用页面 OtoPlan 开启和关闭
    coin_id:0,
  },
  mutations: {
    /**
     * 操作token
     *  */
    SET_USERINFO: (state, person) => {
      state.personInfo = person
    },
    /**
     * 设置foot
     * @param {*} state 
     * @param {String} name   路由
     */
    SET_FOOT(state, name) {
      if (name) {
        state.foooterName = name
        state.footerShow = true
      } else {
        state.foooterName = ''
        state.footerShow = false
      }
    },
    SET_CONFIG(state, app) {
      state.config = app
    },
    GETLOGINPARAMS(state, params) {
      state.loginparams = params;
    },
    SEARCH_INP(state, inp) {
      //添加上次搜索记录
      state.search_input = inp;
    },
    SEARCH_EMPTY(state) {
      //清空搜索记录
      state.search_history = [];
    },
    /**
     * search页操作历史记录
     * @param {*} state
     * @param {最新记录} new_his
     */
    ADD_SEARCH_HISTORY(state, new_his) {
      //添加搜索历史
      if (state.search_history.indexOf(new_his) != -1) {
        //若搜索历史中已有该记录，则删除原纪录，添加新纪录到最前
        //若没有。则直接添加
        var index = state.search_history.indexOf(new_his);
        state.search_history.splice(index, 1);
      }
      state.search_history.unshift(new_his);
      //若历史记录为五个或更多时，删除最早的
      if (state.search_history.length > 5) {
        state.search_history.pop();
      }
    },
    SET_APP(state, val) {
      state.app = val
    },
    OTO_KEY(state, val) {
      if (val) {
        state.keywords = val
      } else {
        state.keywords = ""
      }
    },
    BACK_NORMAL(state, flag) {
      state.back_normal = flag
    },
    SET_COINID(state, id) {
      state.coin_id = id
    },
  },
  actions: {
    async getPerson(content) {
      const userInfo = await http.get(`/api/app/userInfo`)
      localStorage.user_id = userInfo.id
      content.commit('SET_USERINFO', userInfo)
    },
  },
});
