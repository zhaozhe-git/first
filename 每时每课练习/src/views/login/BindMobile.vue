<template>
  <div class="bindingMobile">
    <myHeader :title="title" />
    <div class="box">
      <div :class="active!= 1 ? 'int_num':'int_num int_num_active'">
        <input
          type="tel"
          placeholder="请输入手机号"
          maxlength="11"
          v-model="mobile"
          @focus="active=1"
          @blur="active=''"
        />
        <div class="getCAPTCHA" @click="getsmsCode" v-if="!timebool">获取验证码</div>
        <div class="getCAPTCHA timeout" v-if="timebool">
          获取验证码
          ({{time}})
        </div>
      </div>
      <div :class="active!= 2 ? 'int_num':'int_num int_num_active'">
        <input
          type="text"
          placeholder="请输入验证码"
          v-model="sms_code"
          maxlength="6"
          @focus="active=2"
          @blur="active=''"
        />
      </div>
    </div>
    <div class="login">
      <span @click="submits">确定</span>
    </div>
  </div>
</template>
<script>
import myHeader from "@/components/Header";

export default {
  components: { myHeader },
  data() {
    return {
      title: {
        name: "绑定手机号"
      },
      qq_openid: this.$route.query.qq_openid,
      wx_openid: this.$route.query.wx_openid,
      code: this.$route.query.code,
      type: this.$route.query.type,
      mobile: "",
      sms_code: "",
      time: 0,
      timebool: false,
      active: ""
    };
  },
  methods: {
    getsmscodes() {
      if (!this.$pub.isPoneAvailable(this.getsmscodeData.mobile)) {
        this.$toast("手机号码格式不正确");
        return;
      }
      this.$http
        .post(`/api/app/smsCode`, {
          mobile: this.mobile,
          sms_type: "loginOauth"
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
    getsmsCode() {
      this.getsmscodes();
    },
    submits() {
      this.appOauths();
    },
    appOauths() {
      this.$http
        .post("/api/app/webOauths", {
          code: this.code,
          type: this.type,
          mobile: this.mobile,
          sms_code: this.sms_code
        })
        .then(res => {
          localStorage.setItem("adminToken", res.remember_token);
          localStorage.setItem("user_id", res.id);
          this.$router.go(-2);
        });
    }
  }
};
</script>
<style scoped lang="scss">
.box {
  background-color: #fff;
  margin-top: 10px;
  padding: 0 40px;
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
  height: 374px;
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
    margin-top: 110px;
  }
}
</style>
