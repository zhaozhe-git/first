<template>
  <div class="my-study-detail">
    <Header :title="title">
      <div slot="right-sum" class="calendar" @click="onCalendar"></div>
    </Header>
    <div class="info" v-if="$pub.showProgress(courseData.course.course_type)">
      <span>共{{courseData.course.section_num}}课时</span>
      <MyProgress width="420" :percent="courseData.course.progress_rate"></MyProgress>
      <span>已学习{{courseData.course.progress_rate}}%</span>
    </div>
    <div class="content">
      <div class="periods" v-if="courseData.periods">
        <MyStudyDetailCell
          v-for="(item, index) in courseData.periods"
          :key="index"
          :data="item"
          :course="courseData.course"
        ></MyStudyDetailCell>
      </div>
      <van-collapse v-model="active" v-if="courseData.chapter">
        <van-collapse-item
          v-for="(item, index) in courseData.chapter"
          :key="index"
          :title="item.title"
          :name="index"
        >
          <div slot="right-icon">
            <img class="icon-up" :src="active.includes(index) ? imgArrow[0] : imgArrow[1]" alt />
          </div>
          <MyStudyDetailCell
            v-for="(citem, cindex) in item.child"
            :key="cindex"
            :data="citem"
            :course="courseData.course"
          ></MyStudyDetailCell>
        </van-collapse-item>
      </van-collapse>
    </div>
    <div class="bottom">
      <p class="btn" v-for="(item, index) in bottomBtns" :key="index" @click="actions(index)">
        <img class="icon" :src="item.icon" alt />
        <span class="name">{{item.name}}</span>
      </p>
    </div>
    <Evaluating ref="comment"></Evaluating>
  </div>
</template>

<script>
import Evaluating from "@/components/Evaluating";
import Header from "@/components/Header";
import MyProgress from "@/components/MyProgress";
import MyStudyDetailCell from "./MyStudyDetailCell";
export default {
  name: "my-study-detail",
  components: {
    Header,
    Evaluating,
    MyProgress,
    MyStudyDetailCell
  },
  data() {
    return {
      title: {
        name: ""
      },
      courseData: {
        course: {}
      },
      bottomBtns: [
        { icon: require("@/assets/images/study-comment.png"), name: "写评论" },
        { icon: require("@/assets/images/study-detail.png"), name: "课程详情" },
        { icon: require("@/assets/images/study-remove.png"), name: "移除列表" }
      ],
      active: [],
      imgArrow: [
        require("@/assets/theme-img/icon-up.png"),
        require("@/assets/images/icon-down.png")
      ],
      test: {}
    };
  },
  created() {
    this.$http
      .get(`/api/app/myStudy/course/${this.$route.query.course_id}`)
      .then(data => {
        this.courseData = data;
        this.title.name = data.course.title;
      });
  },
  methods: {
    // on event
    onCalendar() {
      this.$router.push({
        name: "StudyCalendar"
      });
    },
    actions(index) {
      if (index == 0) {
        this.$refs.comment.showBox({
          id: this.$route.query.course_id,
          type: 1
        });
      } else if (index == 1) {
        this.$router.push({
          name: "CourseDetail",
          query: {
            id: this.$route.query.course_id
          }
        });
      } else {
        this.$http
          .delete(`/api/app/myStudy/course/${this.$route.query.course_id}`)
          .then(() => {
            this.$toast({
              message: "成功",
              type: "success",
              duration: 1000,
              onClose: () => {
                this.$router.push({
                  name: "MyStudy"
                });
              }
            });
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.my-study-detail {
  .header {
    border-bottom: 1px solid #f5f5f5;
  }
  .calendar {
    width: 100px;
    height: 100%;
    background: url("~@/assets/images/icon-calendar.png") no-repeat right center;
    background-size: 32px 32px;
  }
  .info {
    font-size: 26px;
    color: #595959;
    height: 104px;
    line-height: 104px;
    border-bottom: 1px solid #f5f5f5;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .content {
    .periods .my-study-detail-cell {
      margin: 30px;
      &:last-child {
        margin-bottom: 100px;
      }
    }
    .van-collapse {
      margin-top: 20px;
      padding: 0 20px;
      &::after {
        display: none;
      }
      .van-collapse-item {
        border: none;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        margin-bottom: 40px;
        padding-bottom: 0;
        /deep/ .van-collapse-item__title {
          background: #f5f5f5;
          padding: 0 30px;
          line-height: 106px;
          height: 106px;
        }
        &:last-child {
          margin-bottom: 150px;
        }
      }
      /deep/ .van-hairline--top::after {
        position: relative;
      }
      .icon-up {
        width: 24px;
        height: 18px;
      }
    }
  }
  .bottom {
    width: 100%;
    height: 74px;
    background-color: #fff;
    position: fixed;
    bottom: 0;
    border-top: 1px solid #f5f5f5;
    z-index: 99;
    .btn {
      float: left;
      width: 33.3%;
      height: 100%;
      line-height: 64px;
      text-align: center;
      .icon {
        width: 24px;
        height: 24px;
        vertical-align: middle;
      }
      .name {
        font-size: 24px;
        color: #8c8c8c;
        vertical-align: middle;
        margin-left: 10px;
      }
    }
  }
}
</style>
