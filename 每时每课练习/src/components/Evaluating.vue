<template>
  <div class="evaluating">
    <van-popup v-model="show">
      <div class="box">
        <i class="close" @click="close"></i>
        <div class="info" v-if="params.teacher_name">
          <span>{{params.teacher_name}}</span>
          <font>{{params.course_time}}</font>
        </div>
        <div class="star">
          <span>星级：</span>
          <van-rate
            :readonly="params.comment_id ? 'readonly': false"
            v-model="grade"
            color="#EA7A2F"
            void-color="#EA7A2F"
          />
        </div>
        <div class="com-label" v-if="tag.length">
          <p>标签：</p>
          <div>
            <span
              v-for="(item,index) in tag"
              :key="item.id"
              :class="item.choose ? 'active':''"
              @click="selectLabel(index)"
            >{{item.title}}</span>
          </div>
        </div>
        <div class="body">
          <span>内容：</span>
          <textarea v-model="ipt" :readonly="params.comment_id ? 'readonly': false"></textarea>
        </div>
        <div v-show="!params.comment_id" class="submit" @click="submit">{{btn_name}}</div>
      </div>
    </van-popup>
  </div>
</template>
<script>
export default {
  props: {
    com_type: {
      type: String,
      default: "1"
    },
    btn_name: {
      type: String,
      default: "发布"
    }
  },
  data() {
    return {
      show: false,
      ipt: "",
      grade: 5,
      params: {},
      tag: []
    };
  },
  methods: {
    async submit() {
      let params = {
        grade: this.grade,
        content: this.ipt,
        course_id: this.params.id,
        type: this.params.type
      };
      if (this.com_type == 1) {
        // 订单
        await this.$http.post("/api/app/myStudy/comment", params);
      } else {
        // 约课
        let tag_id = "";
        if (this.tag.length) {
          this.tag.forEach(item => {
            if (item.choose) {
              tag_id += item.id + ",";
            }
          });
          tag_id = tag_id.substr(0, tag_id.length - 1);
        }
        params.teacher_id = this.params.teacher_id;
        params.user_id = this.params.user_id;
        params.oto_course_id = this.params.oto_course_id;
        params.tag_id = tag_id;
        params.comment_id = 0;
        await this.$http.post("/api/app/oto/comment/send", params);
      }
      this.$toast("评价成功");
      this.close();
      this.ipt = "";
      this.$emit("refresh");
    },
    close() {
      this.show = false;
    },
    showBox(e) {
      this.params = e;
      if (e.comment_id) {
        this.detail(e.tag);
      } else {
        this.show = true;
        this.grade = 5;
        this.ipt = "";
        this.initTag(e.tag);
      }
    },
    // 初始化标签
    initTag(tag, ids) {
      if (tag && tag.length) {
        tag.forEach(item => {
          item.choose = false;
          if (ids && ids.includes(item.id + "")) {
            item.choose = true;
          }
        });
        this.tag = tag;
      }
    },
    // 回显
    detail(tag) {
      this.$http
        .post(`/api/app/oto/comment/send`, {
          comment_id: this.params.comment_id
        })
        .then(res => {
          this.show = true;
          this.ipt = res.content;
          this.grade = res.grade;
          let ids = "";
          if (res.tag_id) {
            ids = res.tag_id.split(",");
          }
          this.initTag(tag, ids);
        });
    },
    selectLabel(index) {
      if (!this.params.comment_id) {
        let item = this.tag[index];
        item.choose = !item.choose;
        this.$set(this.tag, index, item);
      }
    }
  },
  created() {}
};
</script>
<style scoped lang="scss">
.van-popup {
  border-radius: 10px;
}
.box {
  width: 710px;
  background: rgba(255, 255, 255, 1);
  border-radius: 5px;
  padding: 80px 40px 60px;
  box-sizing: border-box;
  font-size: 30px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(89, 89, 89, 1);
  position: relative;
  .close {
    position: absolute;
    right: 24px;
    top: 30px;
    width: 20px;
    height: 20px;
    background-image: url("../assets/images/close.png");
    background-size: 100%;
  }
  .info {
    padding: 40px 0;
    font {
      padding-left: 20px;
      font-size: 24px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(183, 183, 183, 1);
    }
  }
  .star {
    width: 100%;
    height: 60px;
    text-align: left;
    display: flex;
    span {
      line-height: 36px;
      display: inline-block;
      height: 40px;
    }
    .van-rate {
      display: inline-block;
      height: 40px;
      line-height: 40px;
    }
    .van-rate__icon {
      font-size: 28px;
    }
  }
  .com-label {
    display: flex;
    padding-top: 20px;
    p {
      font-size: 30px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      text-align: left;
      white-space: nowrap;
      line-height: 44px;
    }
    div {
      display: flex;
      flex-wrap: wrap;
      span {
        width: 166px;
        height: 40px;
        border: 1px solid #ea7a2f;
        border-radius: 4px;
        font-size: 20px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: #ea7a2f;
        line-height: 40px;
        overflow: hidden;
        margin-right: 10px;
        margin-bottom: 20px;
        text-align: center;
      }
      span.active {
        color: #fff;
        background: #ea7a2f;
      }
    }
  }
  .body {
    margin-top: 45px;
    width: 100%;
    display: flex;
    span {
      line-height: 40px;
      text-align: left;
    }
    textarea {
      flex: 1;
      height: 160px;
      border: 1px solid rgba(191, 191, 191, 1);
      border-radius: 5px;
      box-sizing: border-box;
      padding: 10px 20px;
    }
  }
  .submit {
    width: 176px;
    height: 56px;
    background: $theme_color;
    border-radius: 5px;
    margin: 0 auto;
    line-height: 49px;
    font-size: 26px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    text-align: center;
    margin-top: 50px;
  }
}
</style>
