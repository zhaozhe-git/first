<template>
  <div class="my-study-list">
    <div v-for="(item, index) in courses" :key="index" class="item" @click="onClick(item)">
      <p class="title">{{item.title}}</p>
      <div class="time">
        <span class="duration" v-if="$pub.showDuration(item.course_type)">
          <img class="clock" src="@/assets/images/icon-time.png" alt />
          <span>{{item.start_play_date | fomartTime('MM月dd日 hh:mm')}} ~ {{item.end_play_date | fomartTime('MM月dd日 hh:mm')}}</span>
        </span>
        <span>共{{item.section_num}}课时</span>
      </div>
      <div class="info">
        <!-- 面授课的进度条特殊处理：列表需要显示，详情中的不用显示，故这里做了特殊处理 -->
        <div class="info1" v-if="item.course_type == 7 || $pub.showProgress(item.course_type)">
          <MyProgress width="180" :percent="item.progress_rate"></MyProgress>
          <span class="rate">已学习{{item.progress_rate}}%</span>
        </div>
        <div class="info2">{{getPlayInfo(item)}}</div>
      </div>
      <div class="vip" v-if="item.is_vip_course">会员</div>
      <div v-if="isLoseEfficacy(item)" class="lose">
        <img src="~@/assets/images/lose-efficacy.png" alt />
      </div>
    </div>
  </div>
</template>

<script>
import MyProgress from '@/components/MyProgress'
export default {
  name: 'my-study-list',
  props: {
    courses: {
      type: Array,
      default() {
        return []
      }
    },
    userInfo: {
      type: Object,
      required: true
    }
  },
  components: {
    MyProgress
  },
  data() {
    return {
      event: {
        onRefresh: 'onRefresh'
      }
    }
  },
  methods: {
    // on evet
    onClick(item) {
      if (this.isLoseEfficacy(item)) {
        this.$dialog.confirm({
          title: '提示',
          message: '您的会员已失效',
          cancelButtonText: '移除课程',
          confirmButtonText: '续费会员',
          closeOnClickOverlay: true
        }).then(() => {
          // 续费会员
          this.$router.push({
            name: 'Vip'
          })
        }).catch((val) => {
          // 移除课程
          if (val == 'cancel') {
            this.$http.delete(`/api/app/myStudy/course/${item.course_id}`).then(() => {
              this.$toast('移除课程成功')
              this.$emit(this.event.onRefresh)
            })
          }
        })
        return
      }
      // 公开课直接进入直播间
      if (item.course_type == 4) {
        this.$http.get(`/api/app/getPcRoomCode/course_id=${item.course_id}/chapter_id=0`).then(data => {
          window.location.href = data.chapterInfo.web_url
        })
        return
      }
      // 其他课程进入学习详情
      this.$router.push({
        name: 'MyStudyDetail',
        query: {
          course_id: item.course_id
        }
      })
    },
    // other
    getPlayInfo(item) {
      let tag1, tag2
      if (item.course_type == 2 || item.course_type == 3 || item.course_type == 4) {
        tag1 = '直播'
        tag2 = '直播'
      } else {
        tag1 = '上课'
        tag2 = '课'
      }
      let retStr = ''
      // 优先显示正在直播
      if (item.now_course_num > 0) {
        retStr = '正在' + tag1
      } else if (item.today_course_num > 0) {
        retStr = '今日有' + tag2
      }
      return retStr
    },
    isLoseEfficacy(item) {
      return !this.userInfo.is_vip && item.is_vip_course && !item.is_buy_order
    },
  }
}
</script>

<style lang="scss" scoped>
.my-study-list {
  padding: 20px 30px;
  .item {
    background-color: #fff;
    border-radius: 10px;
    padding: 45px 28px;
    margin-bottom: 30px;
    position: relative;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    .title {
      font-size: 32px;
      font-family: PingFangSC-Medium;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      vertical-align: top;
    }
    .time {
      margin-bottom: 60px;
      font-size: 24px;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      margin-top: 20px;

      .duration {
        margin-right: 20px;
        position: relative;
        * {
          vertical-align: middle;
        }
        .clock {
          width: 28px;
          height: 28px;
          margin-right: 10px;
        }
        &::after {
          content: "";
          display: block;
          width: 1px;
          height: 20px;
          position: absolute;
          top: 50%;
          right: -10px;
          transform: translateY(-50%);
          background-color: #999;
        }
      }
    }
    .info {
      display: flex;
      justify-content: space-between;
      .info1 {
        display: flex;
        .my-progress {
          margin: 10px 20px 0 0;
        }
        .rate {
          font-size: 24px;
          color: #8c8c8c;
        }
      }
      .info2 {
        font-size: 24px;
        color: $theme_color;
      }
    }
    .vip {
      position: absolute;
      top: 0;
      right: 25px;
      font-size: 24px;
      color: #262626;
      text-align: center;
      line-height: 40px;
      width: 76px;
      height: 40px;
      background: linear-gradient(
        90deg,
        rgba(206, 184, 156, 1) 0%,
        rgba(163, 130, 89, 1) 100%
      );
      border-radius: 0px 0px 4px 4px;
    }
    .lose {
      position: absolute;
      top: 60px;
      right: 20px;
      img {
        width: 116px;
        height: 94px;
      }
    }
  }
}
</style>