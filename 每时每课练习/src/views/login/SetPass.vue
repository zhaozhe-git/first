<template>
<div class="setPassword">
  <myHeader :title="title" :returnShow="false" @toGet="goPerson">
    <template slot="right-sum">跳过</template>
  </myHeader>
  <div class="box">
    <div :class="active!= 1 ? 'int_num':'int_num int_num_active'">
      <input type="password" placeholder="请设置登录密码" maxlength="20" v-model="password" @focus="active=1" @blur="active=''" />
    </div>
    <div :class="active!= 2 ? 'int_num':'int_num int_num_active'">
      <input type="password" maxlength="20" placeholder="请再次输入密码" v-model="secondPassword" @focus="active=2" @blur="active=''" />
    </div>
  </div>
  <div class="login">
    <span @click="set">确定</span>
  </div>
</div>
</template>
<script>
import myHeader from "@/components/Header";
export default {
  components: {
    myHeader
  },
  data() {
    return {
      title: {
        name: "设置密码"
      },
      password: "",
      secondPassword: "",
      active: ""
    };
  },
  methods: {
    set() {
      if (this.secondPassword == this.password) {
        let data = this.$store.state.loginparams;
        data.password = this.password;
        this.$http.post("/api/app/password", data).then(() => {
          this.$toast("设置成功");
          this.$router.push({
            name: "SetMessage"
          });
        });
      } else {
        this.$toast("两次输入的密码不相同");
      }
    },
    goPerson() {
      this.$router.replace({
        name: "SetMessage"
      });
    }
  }
};
</script>
<style scoped lang="scss">
.setPassword {
    padding-top: 10px;
}
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
        width: 540px;
        height: 100%;
        font-size: 30px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        line-height: 40px;
        float: left;
        outline: none;
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
