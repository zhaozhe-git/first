<template>
  <div class="record-page">
    <headers :title="title" :returnShow="false"></headers>
    <van-tabs v-model="active" :line-width="16" @change="change">
      <van-tab title="待上课"></van-tab>
      <van-tab title="已上课"></van-tab>
      <van-tab title="已取消"></van-tab>
    </van-tabs>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <List
        v-if="login"
        ref="list"
        url="/api/app/oto/myInviteCourse/index"
        method="post"
        :params="params"
        :on-getdata="onGetdata"
        :showText="false"
      >
        <section slot="item" class="record-list">
          <div class="rl-item" v-for="(item,index) in list" :key="index">
            <div class="rl-info">
              <img class="avatar" :src="item.avatar" />
              <div class="rl-content">
                <p class="rl-time">{{item.course_time}}</p>
                <p class="rl-name">
                  {{item.nickname}}
                  <span>（{{item.chapter_time}}分钟）</span>
                </p>
                <p v-show="active != 2" class="rl-notice">{{item.course_tips}}</p>
              </div>
            </div>
            <div class="rl-action" v-show="active != 2">
              <p @click="goPage(item)">
                <i></i>
                <span :class="{'active':item.is_read}">沟通记录</span>
              </p>
              <p @click="look(item.id)">
                <i></i>
                <span>{{active == 0?'进入教室':'查看回放'}}</span>
              </p>
              <p>
                <i></i>
                <span v-if="active == 0" @click="sendCancel(item)">取消约课</span>
                <span v-else @click="comment(item)">{{item.is_comment == 0?'评价老师':'已评价'}}</span>
              </p>
            </div>
            <div
              v-show="active == 2"
              class="rl-cancel"
            >于{{item.cancel_at | fomartTime('yyyy.MM.dd hh:mm')}}取消</div>
          </div>
        </section>
      </List>
      <div class="rp-empty" v-show="!show">
        <img src="../../assets/images/no-message.png" />
        <p>{{emptyTip}}</p>
        <van-button v-show="(active == 0 || active == 1) && login" @click="toPage">立即约课</van-button>
        <van-button v-if="!login" @click="toPage">登录/注册</van-button>
      </div>
    </van-pull-refresh>
    <van-dialog v-model="cancelModel" title="提示" show-cancel-button @confirm="cancel">
      <p class="rp-notice">{{msg}}</p>
    </van-dialog>
    <evaluating ref="comModel" @refresh="change" com_type="2"></evaluating>
  </div>
</template>

<script>
import evaluating from "@/components/Evaluating";
import headers from "@/components/Header";
import List from "@/components/List";
export default {
  name: "Report",
  components: {
    headers,
    evaluating,
    List
  },
  data() {
    return {
      title: {
        name: "约课记录"
      },
      active: 0,
      list: [],
      cancelModel: false,
      cancel_id: "",
      msg: "",
      params: {
        type: 1
      },
      login: false,
      isLoading: false
    };
  },
  created() {
    if (localStorage.adminToken) {
      this.login = true;
    }
  },
  computed: {
    show: {
      get() {
        return this.list.length;
      },
      set() {}
    },
    isApp() {
      return this.$store.state.app;
    },
    emptyTip() {
      let ret = "";
      if (this.login) {
        switch (this.active) {
          case 0:
            ret = "还没有待上课记录哦";
            break;
          case 1:
            ret = "还没有上课记录哦";
            break;
          case 2:
            ret = "还没有取消上课记录哦";
            break;
        }
      } else {
        ret = "请登录后查看相关内容";
      }
      return ret;
    }
  },
  methods: {
    change() {
      if (!this.login) {
        return;
      }
      this.show = false;
      this.params = {
        type: this.active + 1
      };
      this.$refs.list.reset();
    },
    onRefresh() {
      this.$refs.list.reset(1);
      this.isLoading = false;
    },
    toPage() {
      if (!this.login) {
        if (this.isApp) {
          this.$pub.appAction("login");
        } else {
          this.$router.push({
            name: "Login"
          });
        }
      } else {
        if (this.$store.state.app) {
          this.$pub.appJump("oto");
        } else {
          this.$router.push({
            name: "Oto"
          });
        }
      }
    },
    goPage(item) {
      if (this.isApp) {
        this.$pub.appJump(`Communicate?id=${item.id}&t_id=${item.teacher_id}`);
      } else {
        this.$router.push({
          name: "Communicate",
          query: {
            id: item.id,
            t_id: item.teacher_id
          }
        });
      }
    },
    onGetdata(data) {
      this.list = data;
    },
    sendCancel(item) {
      this.cancel_id = item.id;

      this.$http.get(`/api/app/oto/cancelCourseCount`).then(res => {
        let time =
          new Date(item.start_play * 1000).format("yyyy-MM-dd hh:mm") +
          "-" +
          new Date(item.end_play * 1000).format("hh:mm");
        if(res.count<4){
          this.msg = 
            "取消课程后，资金将原路返回您的账户。确认取消" +
              item.nickname +
              "   " +
              time +
              "   的约课么？";
        }else{
          this.msg =
          "您已经取消预约4次了，再次取消预约将不退课时。确认取消" +
              item.nickname +
              "   " +
              time +
              "   的约课么？"
        }
        this.cancelModel = true;
      })
      // this.$http.get(`/api/app/oto/cancelInvite/${item.id}/1`).then(res => {
      //   this.cancelModel = true;
      //   // this.msg = res;
      // });
    },
    cancel() {
      this.$http
        .get(`/api/app/oto/cancelInvite/${this.cancel_id}/0`)
        .then(() => {
          this.$toast("取消成功");
          this.change();
        });
    },
    comment(item) {
      this.$http.get(`/api/app/oto/comment/info/${item.id}`).then(res => {
        let params = {
          teacher_id: item.teacher_id,
          user_id: item.user_id,
          oto_course_id: item.id,
          tag: res.tag,
          teacher_name: res.teacher_name,
          course_time: res.course_time,
          comment_id: item.is_comment // 0 评价老师  1 回显
        };
        this.$refs.comModel.showBox(params);
      });
    },
    look(id) {
      if (this.isApp) {
        this.$pub.appAction("play", {
          course_id: id
        });
      } else {
        this.$http.get(`/api/app/oto/getLiveRoomCode/${id}/0`).then(res => {
          window.location.href = res.web_url;
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.record-page {
  @extend %default-bg;
  padding-bottom: 130px;
  .record-list {
    padding: 0 20px;
    .rl-item {
      margin-top: 20px;
      background: rgba(255, 255, 255, 1);
      border-radius: 8px;
      .rl-info {
        padding: 20px;
        display: flex;
        .avatar {
          width: 80px;
          height: 80px;
          margin-right: 24px;
        }
        .rl-content {
          line-height: 44px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          .rl-time {
            padding-top: 14px;
            font-size: 30px;
            color: rgba(89, 89, 89, 1);
          }
          .rl-name {
            font-size: 24px;
            color: rgba(140, 140, 140, 1);
            span {
              font-size: 22px;
            }
          }
          .rl-notice {
            font-size: 24px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(183, 183, 183, 1);
            padding-top: 10px;
          }
        }
      }
      .rl-action {
        height: 90px;
        border-top: 1px solid #f5f5f5;
        display: flex;
        p {
          width: 33.3%;
          @extend %flex-center;
          &:nth-child(1) {
            i {
              width: 32px;
              height: 32px;
              background: url("../../assets/images/icon-concat.png") no-repeat;
              background-size: 100% 100%;
            }
          }
          &:nth-child(2) {
            i {
              width: 28px;
              height: 28px;
              background: url("../../assets/images/icon-enter.png") no-repeat;
              background-size: 100% 100%;
            }
          }
          &:nth-child(3) {
            i {
              width: 28px;
              height: 28px;
              background: url("../../assets/images/icon-cancel-course.png")
                no-repeat;
              background-size: 100% 100%;
            }
          }
          span {
            font-size: 22px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: #8c8c8c;
            margin-left: 20px;
            position: relative;
          }
          span.active::after {
            content: "";
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #e02020;
            right: -1px;
            top: -6px;
          }
        }
        p:active {
          &:nth-child(1) {
            i {
              background: url("../../assets/theme-img/icon-concat-hover.png")
                no-repeat;
              background-size: 100% 100%;
            }
          }
          &:nth-child(2) {
            i {
              background: url("../../assets/theme-img/icon-enter-hover.png")
                no-repeat;
              background-size: 100% 100%;
            }
          }
          &:nth-child(3) {
            i {
              background: url("../../assets/theme-img/icon-cancel-course-hover.png")
                no-repeat;
              background-size: 100% 100%;
            }
          }
          span {
            color: $theme_color;
          }
        }
      }
      .rl-cancel {
        font-size: 24px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(140, 140, 140, 1);
        line-height: 74px;
        height: 74px;
        border-top: 1px solid #f5f5f5;
        padding-left: 60px;
        background: url("../../assets/images/icon-time.png") no-repeat 24px
          center;
        background-size: 24px 24px;
      }
    }
  }
  .rp-empty {
    img {
      display: block;
      width: 358px;
      height: 258px;
      margin: 200px auto 20px;
    }
    p {
      font-size: 28px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(183, 183, 183, 1);
      line-height: 40px;
      margin-bottom: 50px;
      text-align: center;
    }
    button {
      margin: 0 auto;
      display: block;
      width: 176px;
      height: 56px;
      font-size: 26px;
      color: rgba(255, 255, 255, 1);
      background: $theme_color;
      border-radius: 5px;
    }
  }
  .rp-notice {
    font-size: 30px;
    font-family: PingFangSC-Light;
    font-weight: 300;
    color: rgba(89, 89, 89, 1);
    line-height: 42px;
    padding: 10px 50px 50px;
    text-indent: 40px;
  }
  /deep/ .van-dialog__cancel {
    background: #fff;
    color: #666;
  }
}
</style>
