<template>
<div class="share">
  <Header :title="{name: '每时每课'}"></Header>
  <img :src="data_background" style="width:100%; height:100%; position: fixed; z-index: 1;" />
  <div class="content">
    <input v-model="phone" placeholder="请输入手机号" @blur="iosToTop" />
    <div>
      <input v-model="code" placeholder="请输入验证码" @blur="iosToTop" />
      <button v-if="!timebool" type="button" @click="getsmsCode">获取验证码</button>
      <button v-else type="button">{{time}}</button>
    </div>
    <button type="button" class="submit-btn" @click="goLogin">立即领取体验课</button>
  </div>
  <van-dialog v-model="cancelModel" title="提示"  @confirm="cancel">
      <p class="rp-notice">恭喜您，领取成功!请下载每时每课APP或登录PC端进行预约老师，点击确定返回首页~</p>
   </van-dialog>
</div>
</template>
<script>
import Header from '@/components/Header'
export default {
  name: 'feedback',
  components: {
    Header
  },
  data() {
    return {
    	cancelModel: false,
      phone: '',
      code: '',
      time: 60,
      timebool: false,
      data_background:''
    }
  },
  created() {
  	this.bacground_url();
  	//this.cancelModel = true;
  },
  methods: {
  	bacground_url() {
      this.$http
        .get(`/api/app/getInviteHomePage`)
        .then((res) => {
        	this.data_background=res;
        });
   },
    iosToTop(){
      // if(this.app == "ios"){
        window.scrollTo(0,0);
        // let input = document.getElementsByTagName('input')[num];
        // console.log(input.onblur)
        // input.onblur=function(){
        //   console.log('失去焦点')
        //   window.scrollTo(0,0);
        // }
      // }
    },
  	cancel(){
      window.location.href = "https://wap.365msmk.com/index"
  		// this.$router.push({
      //   name: "Index"
      // });
  	},
    getsmsCode() {
      const that = this;
      if (!that.$pub.isPoneAvailable(that.phone)) {
        that.$toast("手机号码格式不正确");
        return;
      }
      that.$http
        .post(`/api/app/homeSmsCode`, {
          mobile: that.phone,
          sms_type: 'login'
        })
        .then(() => {
          that.timebool = true;
          that.time = 60;
          var timer = setInterval(function() {
            that.time--;
            if (that.time <= 0) {
              that.timebool = false;
              clearInterval(timer);
            }
          }, 1000);
        });
    },
    goLogin() {
      if (!this.$pub.isPoneAvailable(this.phone)) {
        this.$toast("手机号码格式不正确");
        return;
      }
      this.$http
        .post("/api/app/login", {
          mobile: this.phone,
          sms_code: this.code,
          type: 2,
          inviter_id: this.$route.query.inviter_id || 0
        })
        .then(res => {
          this.cancelModel = true;
        });
    }
  }
}
</script>

<style lang="scss" scoped>
.share {
    height: 100%;
    .content {
    		position: fixed;
    		left: 0;
    		bottom:100px;
        padding: 0 70px;
        box-sizing: border-box;
        overflow: hidden;
        z-index: 2;
        input {
            display: block;
            width: 100%;
            height: 90px;
            padding: 0 30px;
            border: none;
            border-radius: 8px;
            background-color: #fff;
            font-size: 30px;
            color: #333;
            line-height: 90px;
            flex: 1;
            box-sizing: border-box;
        }
        div {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            margin-top: 30px;
            button {
                background-color: $theme_color;
                color: #fff;
                width: 200px;
                height: 90px;
                margin: 0 0 0 30px;
                border-radius: 8px;
                font-size: 30px;
                text-align: center;
                line-height: 90px;
                border: none;
                outline: none;
                flex-shrink: 0;
                box-sizing: border-box;
            }
        }
        .submit-btn {
            background-color: $theme_color;
            color: #fff;
            width: 100%;
            height: 90px;
            margin: 30px 0 0;
            border-radius: 8px;
            font-size: 30px;
            text-align: center;
            line-height: 90px;
            border: none;
            outline: none;
            flex-shrink: 0;
            box-sizing: border-box;
        }
    }
}
.rp-notice {
    font-size: 30px;
    font-family: PingFangSC-Light;
    font-weight: 300;
    color: rgba(89, 89, 89, 1);
    line-height: 42px;
    padding: 10px 50px 50px;
    text-indent: 40px;
  }
</style>
