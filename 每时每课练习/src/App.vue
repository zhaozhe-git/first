<template>
  <div id="app">
    <keep-alive include="Course,Oto,Exam,PaperPackage,Assess,ErrorQues,QuesCollect">
      <router-view />
    </keep-alive>
    <app-footer @showDialog="showDialog" />
    <van-dialog
      v-model="show"
      @confirm='toLogin'
      confirm-button-text="立即登录"
      id="app-dialog"
    >
      <i class="close" @click="show=false"></i>
      <img src="./assets/images/feiji.png">
      <p class="LoginText">赶紧登录一下吧</p>
      <p class="message">立即预约一对一辅导，浏览更多视频课程~</p>
    </van-dialog>
  </div>
</template>

<script>
import appFooter from "./components/Footer";
import plugins from './util/plugins'

// 打开手机端控制台
// import VConsole from 'vconsole'
// new VConsole

export default {
provide() {
    return {
      // 注入根组件方法以供子级组件使用
      reload: this.reload
    };
  },
  data(){
    return{
      show: false,
    }
  },
  components: {
    appFooter
  },
  methods: {
  /**
     * 刷新页面
     * */
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },
    showDialog(message){
      this.show = true;
    },
    toLogin(){
      this.$router.push({
        name:'Login'
      })
    },
    async getConfig() {
      const config = await this.$http.get(
        `/api/app/get/config/system_webConfig`
      );
      this.$store.commit("SET_CONFIG", config);
    },
    appSet() {
      let { app, token } = this.$pub.app_js();
      this.$store.commit("SET_APP", app);
      if (app == "ios") {
        // ios首次需要注册
        this.$pub.registerWebViewJavascriptBridge();
      }

      if (token) {
        if (token == "clear") {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("user_id");
        } else {
          localStorage.setItem("adminToken", token);
        }
      }
      // else{
      //     localStorage.removeItem("adminToken");
      //     localStorage.removeItem("user_id");
      // }
    }
  },
  created() {
  	let that=this;
    that.appSet();
    that.getConfig();
    setTimeout(function(){
    if(that.$route.name==null||that.$route.name==undefined||that.$route.name=='')
    {
    	
    }
    else
    {
    	if(that.$route.name.search('teacher')>=0){
      return false;
	    }
	    if (localStorage.adminToken) {
	      that.$store.dispatch("getPerson");
	    }
    }	
    },200);
  },
  mounted: function() {
    if (!plugins.app_js().app) {
      $.getScript("./meiqia.js", function() {
        console.log("加载js文件");
      });
    }
  },
};
</script>
<style lang="scss">
#app {
    background: #fff;
    min-height: 100vh;
    box-sizing: border-box;
}
    #app-dialog{
      width:566px;
      height:691px;
      background:rgba(255,255,255,1);
      border-radius:30px;
      .van-dialog__content,.van-dialog__footer{
        text-align: center;
      }
      .close{
        width: 24px;
        height: 24px;
        position: absolute;
        top: 23px;
        right: 26px;
        background-image: url('./assets/images/icon_member_account_close.png');
        background-size: 100%;
        background-position: center;
      }
      img{
        width: 565px;
        height: 400;
        margin-top: 29px;
      }
      .LoginText{
        font-size:30px;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height: 44px;
      }
      .message{
        font-size:24px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(153,153,153,1);
        line-height: 38px;
      }
      .van-button{
        width:472px;
        height:80px;
        background:rgba(235,97,0,1);
        border-radius:40px;
        font-size:30px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height: 80px;
        margin-top: 57px;
      }
    }
</style>

