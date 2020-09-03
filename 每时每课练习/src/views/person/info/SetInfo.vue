<template>
  <div class="set-info">
    <Header :title="title" @toGet="onSave">
      <div slot="right-sum">保存</div>
    </Header>
    <van-cell-group class="content" v-if="tag == 'nickname'">
      <van-field v-model="value" placeholder="最多可输入15个字" maxlength="15" />
    </van-cell-group>
    <div class="subject" v-else-if="tag == 'subjects'">
      <ul>
        <li v-for="(item,index) in value" :key="index">         
          <input type="checkbox" v-model="sub" :value="item.id">
          <span>{{item.name}}</span>
        </li>
      </ul>
    </div>
    <ul class="content" v-else>
      <li :class="{active:value==0}" @click="onSex(0)">男</li>
      <li :class="{active:value==1}" @click="onSex(1)">女</li>
    </ul>
  </div>
</template>

<script>
import Header from "@/components/Header";
export default {
  name: "set-info",
  components: {
    Header
  },
  data() {
    return {
      title: {
        name: "修改个人信息"
      },
      value: this.$route.query.value,
      tag: this.$route.query.tag,
      sub:this.$route.query.select?this.$route.query.select:[],
    };
  },
  created() {},
  methods: {
    onSave() {
      switch (this.tag) {
        case "nickname":
          if (!this.value) {
            this.$toast("昵称不能为空");
            return;
          }
          this.$http.put("/api/app/user", { nickname: this.value }).then(() => {
            this.$router.go(-1);
          });
          break;
        case "sex":
          if (this.value) this.value = 1;
          else this.value = 0;
          this.$http.put("/api/app/user", { sex: this.value }).then(() => {
            this.$router.go(-1);
          });
          break;
        case "subjects":
          let subDate = [];
          this.sub.forEach(res => {
            let d = {attr_id:2,attr_val_id:res}
            subDate.push(d)
          });
          this.$http.put("/api/app/user", {user_attr:JSON.stringify(subDate)}).then(() => {
            this.$router.go(-1);
          });
          break;
      }
    },
    onSex(val) {
      this.value = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.set-info {
  @extend %default-bg;
  .content {
    margin-top: 20px;
  }
  ul {
    background: #fff;
    margin: 20px 0;
    padding: 10px 30px;
    li {
      height: 110px;
      line-height: 110px;
      font-size: 28px;
      color: #595959;
      position: relative;
      &:after {
        content: "";
        display: block;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        height: 1px;
        background-color: #f5f5f5;
      }
      &:last-child:after {
        display: none;
      }
      &.active {
        background: url("~@/assets/theme-img/icon-check.png") no-repeat right
          center;
        background-size: 30px 30px;
      }
    }
  }
  .subject{
    input{
      width: 50px;
      height: 50px;
      margin-top: 30px;
      margin-right: 20px;
      float: left;
    }
    span{
      display: inline-block;
      height: 110px;
      line-height: 110px
    }
  }
}
</style>