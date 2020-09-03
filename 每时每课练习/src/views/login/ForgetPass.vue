<template>
  <div class="findPassword">
    <myHeader :title="title" />
    <div class="box">
      <div :class="active!= 1 ? 'int_num':'int_num int_num_active'">
        <input
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
          type="text"
          placeholder="请输入验证码"
          v-model="getsmscodeData.smscode"
          @focus="active=2"
          @blur="active=''"
        />
      </div>
      <div :class="active!= 3 ? 'int_num':'int_num int_num_active'">
        <input
          type="password"
          placeholder="请输入密码"
          v-model="getsmscodeData.pass"
          @focus="active=3"
          @blur="active=''"
        />
      </div>
    </div>
    <div class="login">
      <span @click="device">确定</span>
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
        name: "找回密码"
      },
      getsmscodeData: {
        mobile: "",
        smscode: "",
        pass: ""
      },
      sms_type: "getPassword",
      time: 60,
      timebool: false,
      active: ""
    };
  },
  created() {
    if (this.$route.name == "SetNewPass") {
      this.title.name = "设置密码";
    }
  },
  methods: {
    getsmsCode() {
      if (!this.$pub.isPoneAvailable(this.getsmscodeData.mobile)) {
        this.$toast("手机号码格式不正确");
        return;
      }
      this.$http
        .post(`/api/app/smsCode`, {
          mobile: this.getsmscodeData.mobile,
          sms_type: this.sms_type
        })
        .then(() => {
          this.timebool = true;
          this.time = 60;
          var timer = setInterval(() => {
            this.time--;
            if (this.time <= 0) {
              this.timebool = false;
              clearInterval(timer);
            }
          }, 1000);
        });
    },
    device() {
      if (!this.$pub.isPoneAvailable(this.getsmscodeData.mobile)) {
        this.$toast("手机号码格式不正确");
        return;
      }
      if (!this.getsmscodeData.pass || !this.getsmscodeData.smscode) {
        this.$toast("输入有误，请检查");
        return;
      }
      this.$http
        .post("/api/app/password", {
          mobile: this.getsmscodeData.mobile,
          password: this.getsmscodeData.pass,
          sms_code: this.getsmscodeData.smscode
        })
        .then(() => {
          this.$toast.success({
            message: "设置成功"
          });
          setTimeout(() => {
            this.$toast.clear();
            this.$router.go(-1);
          }, 1500);
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
</style>
