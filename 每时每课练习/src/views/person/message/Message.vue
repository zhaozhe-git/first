<template>
  <div class="message">
    <Header :title="{name: '消息通知'}"></Header>
    <ul>
      <li @click="turnDetail('course')">
        <div class="icon">
          <img src="@/assets/images/icon-msg-course.png" />
        </div>
        <div class="info" :class="{new: messageData.course && messageData.course.is_read==0}">
          <span>课程通知</span>
          <p class="content" v-if="messageData.course" v-html="messageData.course.content"></p>
          <p v-else>暂无消息</p>
        </div>
      </li>
      <li @click="turnDetail('system')">
        <div class="icon">
          <img src="@/assets/images/icon-msg-system.png" />
        </div>
        <div class="info" :class="{new: messageData.system && messageData.system.is_read==0}">
          <span>系统通知</span>
          <p class="content" v-if="messageData.system" v-html="messageData.system.content"></p>
          <p v-else>暂无消息</p>
        </div>
      </li>
      <li @click="turnDetail('order')">
        <div class="icon">
          <img src="@/assets/images/icon-msg-order.png" />
        </div>
        <div class="info" :class="{new: messageData.order && messageData.order.is_read==0}">
          <span>订单通知</span>
          <p class="content" v-if="messageData.order" v-html="messageData.order.content"></p>
          <p v-else>暂无消息</p>
        </div>
      </li>
      <li @click="turnDetail('oto')">
        <div class="icon">
          <img src="@/assets/images/icon-msg-oto.png" />
        </div>
        <div class="info" :class="{new: messageData.oto && messageData.oto.is_read==0}">
          <span>约课通知</span>
          <p class="content" v-if="messageData.oto" v-html="messageData.oto.content"></p>
          <p v-else>暂无消息</p>
        </div>
      </li>
       <li @click="turnDetail('exam')">
        <div class="icon">
          <img src="@/assets/images/icon-msg-exam.png" />
        </div>
        <div class="info" :class="{new: messageData.exam && messageData.exam.is_read==0}">
          <span>考试通知</span>
          <p class="content" v-if="messageData.exam" v-html="messageData.exam.content"></p>
          <p v-else>暂无消息</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import Header from "@/components/Header";
export default {
  name: "message",
  components: { Header },
  data() {
    return {
      messageData: {}
    };
  },
  created() {
    this.requestMessage();
  },
  methods: {
    // on event
    // other
    turnDetail(type) {
      this.$router.push({
        name: "MessageDetail",
        query: {
          message_classify: type,
        }
      });
    },
    // request
    requestMessage() {
      this.$http.post("/api/app/message/classifyMessage").then(data => {
        data.forEach(i => {
          this.$set(this.messageData, i.message_classify, i);
        });
      });
    },
  }
};
</script>
<style lang="scss" scoped>
.message {
  @include cell-list(false);
  overflow: hidden;
  ul {
    margin-top: 0;
    border-top: 1px solid #f5f5f5;
    li {
      height: auto;
      line-height: normal;
      display: flex;
      .icon {
        padding: 20px 0;
        margin-right: 30px;
        img {
          width: 88px;
          height: 88px;
          border-radius: 50%;
        }
      }
      .info {
        display: flex;
        flex-direction: column;
        color: #595959;
        padding: 15px 0;
        position: relative;
        .content {
          /deep/ img {
            width: 500px;
          }
        }
        span {
          font-size: 30px;
          font-weight: 500;
          margin-bottom: 20px;
        }
        p {
          font-size: 26px;
        }
        &.new:after {
          content: "";
          display: block;
          width: 10px;
          height: 10px;
          position: absolute;
          top: 30px;
          left: -15px;
          border-radius: 50%;
          background-color: red;
        }
      }
    }
  }
}
</style>