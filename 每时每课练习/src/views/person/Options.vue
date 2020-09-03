<template>
  <div class="options">
    <Header :title="{name: '设置'}" />
    <ul>
      <li @click="turnPage('SetNewPass')">设置密码</li>
      <!--
      	<li @click="turnPage('Feedback')">意见反馈</li>
      -->
    </ul>
    <div class="bottom-box">
      <div class="btn-exit" @click="onLogout">退出登录</div>
    </div>
  </div>
</template>
<script>
import Header from "@/components/Header";
export default {
  name: 'options',
  components: {
    Header
  },
  data() {
    return {}
  },
  methods: {
    // on event
    onLogout() {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("user_id");
      this.$router.push({
        name: 'Index'
      })
    },
    // other
    turnPage(name) {
      this.$router.push({
        name
      });
    }
  }
};
</script>
<style scoped lang="scss">
.options {
  @extend %default-bg;
  @include cell-list;
  ul {
    margin-bottom: 0;
  }
  .bottom-box {
    overflow: hidden;
    background-color: #fff;
    height: 300px;
    .btn-exit {
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