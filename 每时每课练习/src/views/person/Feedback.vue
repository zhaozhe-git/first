<template>
  <div class="feedback">
    <Header :title="{name: '意见反馈'}"></Header>
    <div class="content">
      <van-field v-model="content" placeholder="请输入您的意见" type="textarea" :maxlength="maxLen"></van-field>
    </div>
    <p class="max-len">{{content.length}}/{{maxLen}}</p>
    <p class="btn" @click="onSubmit">提交</p>
  </div>
</template>

<script>
import Header from "@/components/Header";
export default {
  name: "feedback",
  components: {
    Header
  },
  data() {
    return {
      maxLen: 500,
      content: ""
    };
  },
  created() {},
  methods: {
    // on event
    onSubmit() {
      this.$http
        .post("/api/app/feedback", {
          content: this.content
        })
        .then(() => {
          this.$toast({
            message: "反馈成功",
            duration: 1500,
            onClose: () => {
              if (this.$store.state.app) {
                this.$pub.appAction("closeAppPage");
              } else {
                this.$router.push({
                  name:'Person'
                })
              }
            }
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.feedback {
  .header {
    border-bottom: 1px solid #f5f5f5;
  }
  .content {
    margin-top: 30px;
    /deep/ .van-field {
      height: auto;
    }
    /deep/ .van-cell__value {
      border: 1px solid #ddd;
      border-radius: 10px;
      textarea {
        padding: 20px 20px;
        font-size: 24px;
        line-height: 24px;
        min-height: 0;
        height: 330px;
        &::-webkit-input-placeholder {
          color: #b7b7b7;
        }
      }
    }
  }
  .max-len {
    font-size: 24px;
    color: #b7b7b7;
    text-align: right;
    margin: 10px 40px 0 0;
  }
  .btn {
    background-color: $theme_color;
    color: #fff;
    width: 690px;
    height: 88px;
    margin: 230px auto;
    border-radius: 8px;
    font-size: 34px;
    text-align: center;
    line-height: 88px;
  }
}
</style>