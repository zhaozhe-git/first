<template>
  <div class="exchange">
    <Header :title="title"></Header>
    <ul>
      <li>
        <van-field v-model="form.card_number" label="卡号：" type="text" placeholder="请输入学习卡号"></van-field>
      </li>
      <li>
        <van-field
          v-model="form.card_pwd"
          label="密码："
          :type="passwordType"
          placeholder="请输入学习卡密码"
          rows="1"
          @focus="passwordType='password'"
        />
      </li>
    </ul>
    <div class="bottom-box">
      <div class="btn" @click="onExchange">立即兑换</div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
export default {
  name: "exchange",
  components: { Header },
  data() {
    return {
      title: {
        name: "学习卡兑换"
      },
      form: {
        card_number: '',
        card_pwd: ''
      },
      passwordType: "text"
    };
  },
  methods: {
    // on event
    onExchange() {
      this.$http.post("/api/app/checkout/studyCard", this.form)
        .then(() => {
          this.$toast({
            duration: 1500,
            message: "兑换成功"
          });
          setTimeout(() => {
            this.$router.go(-1);
          }, 1500);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">
.exchange {
  @extend %default-bg;
  @include cell-list(false);
  .van-cell {
    padding: 0;
    .van-cell__title {
      font-size: 28px;
    }
  }
  ul {
    margin-bottom: 0;
  }
  .bottom-box {
    overflow: hidden;
    background-color: #fff;
    height: 300px;
    .btn {
      background-color: $theme_color;
      color: #fff;
      width: 690px;
      height: 88px;
      margin: 130px auto;
      border-radius: 8px;
      font-size: 34px;
      text-align: center;
      line-height: 88px;
    }
  }
}
</style>
