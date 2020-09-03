<template>
  <div class="sms-Login">
    <div class="login-content">
      <div class="top">
        <img :src="config.web_logo?config.web_logo:'@/assets/logo.png'" style="width:80%;margin:100px auto" class="logo" />
        <!-- <h4>{{config.web_title}}</h4> -->
      </div>
      <div :class="active!= 1 ? 'int_num':'int_num int_num_active'">
        <input
          class="iptuser"
          type="tel"
          placeholder="请输入手机号"
          maxlength="11"
          v-model="getsmscodeData.mobile"
          @focus="active=1"
          @blur="active=''"
        />
        <div class="getCAPTCHA" v-on:click="getsmsCode" v-if="!timebool">获取验证码</div>
        <div class="getCAPTCHA" v-if="timebool" style="color:#ccc;">获取验证码({{time}})</div>
      </div>
      <div :class="active!= 2 ? 'int_num':'int_num int_num_active'">
        <input
          class="iptsms"
          type="tel"
          placeholder="请输入短信验证码"
          v-model="getsmscodeData.smscode"
          @focus="active=2"
          @blur="active=''"
        />
      </div>
      <div class="others">
        <span class="forget">*未注册的手机号将自动注册</span>
        <span class="login_CAPTCHA" @click="$router.go(-1)">使用密码登录</span>
      </div>
    </div>
    <div class="login">
      <span @click="goLogin">登录</span>
    </div>
    <div class="otherLogin" v-if="showOther">
      <p>第三方登录</p>
      <div class="txLogin">
        <div class="wxLogin" @click="qqLogin(1)">
          <img src="@/assets/images/wechat.png" />
          <span>微信登录</span>
        </div>
        <div class="qqLogin" @click="qqLogin(2)">
          <img src="@/assets/images/QQ.png" alt />
          <span>QQ登录</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "SmsLogin",
  data() {
    return {
      getsmscodeData: {
        mobile: "",
        sms_type: "login",
        smscode: ""
      },
      time: 60,
      timebool: false,
      type: "",
      active: "",
      showOther: false
    };
  },
  computed: mapState(["config"]),
  methods: {
    otherLogin(code, type) {
      this.$http
        .post(`/api/app/webOauths`, {
          code,
          type
        })
        .then(res => {
          // 判断是否有手机号
          if (res.mobile) {
            localStorage.setItem("adminToken", res.remember_token);
            localStorage.setItem("user_id", res.id);
            if (res.is_new == 1) {
              this.$store.commit("GETLOGINPARAMS", {
                mobile: this.getsmscodeData.mobile,
                sms_code: this.getsmscodeData.smscode
              });
              this.$router.push({
                name: "SetPass"
              });
              return;
            }
            this.$router.go(-1);
          } else {
            this.$router.push({
              name: "BindMobile",
              query: {
                qq_openid: res.qq_openid,
                wx_openid: res.wx_openid,
                code: code,
                type: type
              }
            });
          }
        });
    },
    qqLogin(type) {
      if (type === 1) {
        this.$pub.thirdpartLogin("wx");
      } else {
        this.$pub.thirdpartLogin("qq");
      }
    },
    getsmsCode() {
      if (!this.$pub.isPoneAvailable(this.getsmscodeData.mobile)) {
        this.$toast("手机号码格式不正确");
        return;
      }
      this.$http
        .post(`/api/app/smsCode`, {
          mobile: this.getsmscodeData.mobile,
          sms_type: this.getsmscodeData.sms_type
        })
        .then(() => {
          this.timebool = true;
          this.time = 60;
          let _this = this;
          var timer = setInterval(function() {
            _this.time--;
            if (_this.time <= 0) {
              _this.timebool = false;
              clearInterval(timer);
            }
          }, 1000);
        });
    },
    goLogin() {
      if (!this.$pub.isPoneAvailable(this.getsmscodeData.mobile)) {
        this.$toast("手机号码格式不正确");
        return;
      }
      this.$http
        .post("/api/app/login", {
          mobile: this.getsmscodeData.mobile,
          sms_code: this.getsmscodeData.smscode,
          type: 2
        })
        .then(res => {
          localStorage.setItem("adminToken", res.remember_token);
          localStorage.setItem("user_id", res.id);
          if (res.is_new == 1) {
            this.$store.commit("GETLOGINPARAMS", {
              mobile: this.getsmscodeData.mobile,
              sms_code: this.getsmscodeData.smscode
            });
            this.$router.push({
              name: "SetPass"
            });
            return;
          }
          if(this.$pub.isWeiXin()){
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx4b809012f597f205&redirect_uri=https://wap.365msmk.com/person&response_type=code&scope=snsapi_userinfo&state=1&connect_redirect=1#wechat_redirect"
            return false;
          }
          this.$router.push({
            name: "Person"
          });
        });
    }
  },
  mounted() {
    let href = window.location.href;
    if (href.search("code") > 0) {
      href = href.split("code=")[1];
      if (localStorage.getItem("login_way") == 0) {
        href = href.slice(0, href.indexOf("&"));
      }
      this.type = localStorage.getItem("login_way");
      this.otherLogin(href, this.type);
    }
  }
};
</script>
<style scoped lang="scss">
.login-page {
  overflow: hidden;
}
.login-content {
  padding: 0 80px;
}
.top {
  margin-bottom: 130px;
  .logo {
    display: block;
    width: 162px;
    margin-top: 80px;
  }
  h4 {
    font-size: 48px;
    font-family: PingFangSC-Semibold;
    font-weight: 600;
    color: rgba(89, 89, 89, 1);
    margin-top: 160px;
  }
}
input::-webkit-input-placeholder {
  /* placeholder颜色  */
  color: rgba(190, 190, 190, 1);
}
.int_num {
  height: 100px;
  background-color: #fff;
  border-bottom: 1px solid #f1f1f1;
  input {
    box-sizing: border-box;
    padding: 30px 0;
    border: 0;
    height: 100%;
    font-size: 30px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    line-height: 40px;
    float: left;
    outline: none;
  }
  .iptuser {
    width: 400px;
  }
  .iptsms {
    width: 540px;
  }
  .getCAPTCHA {
    height: 50px;
    margin-top: 25px;
    margin-right: 10px;
    color: $theme_color;
    border-radius: 3px;
    float: right;
    padding: 0;
    text-align: center;
    font-size: 24px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    line-height: 50px;
  }
}
.int_num_active {
  border-color: $theme_color;
}
.login {
  width: 613px;
  height: 90px;
  margin: 118px auto 0;
  // height: 374px;
  background: url("../../assets/theme-img/login-btn.png");
  background-size: 100% 100%;
  font-size: 28px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  letter-spacing: 4px;
  span {
    display: inline-block;
    width: 560px;
    height: 90px;
    line-height: 90px;
  }
}
.others {
  width: 100%;
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  .forget {
    font-size: 24px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: #b7b7b7;
  }
  .login_CAPTCHA {
    font-size: 24px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
  }
}
.otherLogin {
  width: 100%;
  p {
    font-size: 28px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(183, 183, 183, 1);
    text-align: center;
  }
  .txLogin {
    display: flex;
    margin-top: 80px;
    .wxLogin,
    .qqLogin {
      width: 50%;
      justify-content: center;
      align-items: center;
      display: flex;
      img {
        margin-right: 20px;
      }
      span {
        font-size: 28px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(140, 140, 140, 1);
      }
    }
    .wxLogin {
      border-right: 1px solid #f1f1f1;
    }
    .wxLogin img {
      width: 48px;
      height: 38px;
    }
    .qqLogin img {
      width: 44px;
      height: 44px;
    }
  }
}
</style>
