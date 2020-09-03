<template>
  <div class="study-calendar-list">
    <div class="item" v-for="(item, index) in coursesData" :key="index" @click="onClick(item)">
      <div class="info1">
        <span class="course-type">{{item.course_type_name}}</span>
        <span class="play-status" :class="{playing:item.live_status==1}">[{{item.live_status_name}}]</span>
        <span class="duration">{{item.live_time}}</span>
      </div>
      <div class="info2">
        <p v-if="item.course_type == 1">{{item.oto_desc}}</p>
        <p v-else>{{item.title}}</p>
      </div>
      <div class="info3"></div>
    </div>
  </div>
</template>

<script>
import { CourseType, LiveStatus } from "@/util/enums";
export default {
  name: "study-calendar-list",
  props: {
    courses: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    coursesData() {
      const ret = this.courses;
      ret.forEach(i => {
        i.course_type_name = CourseType.getValue(i.course_type);
        i.live_status_name = LiveStatus.getValue(i.live_status);
        if (i.course_type == 7) {
          // 面授课的三个状态：未开始、进行中、已结束
          if (i.live_status == 1) {
            i.live_status_name = "进行中";
          }
        } else if (i.live_status == 2) {
          // 其余课程将已结束状态再次细分为：回放、暂无回放
          i.live_status_name = i.is_play_back ? "回放" : "暂无回放";
        }
      });
      return ret;
    }
  },
  created() {},
  methods: {
    onClick(item) {
      if (item.course_type == 7) {
        this.$router.push({
          name: "CourseDetail",
          query: {
            id: item.course_basis_id
          }
        });
        return;
      }
      if (item.course_type == 1) {
        this.$http
          .get(`/api/app/oto/getLiveRoomCode/${item.course_basis_id}/0`)
          .then(data => {
            window.location.href = data.web_url;
          });
      } else {
        const chapterID = item.course_chapter_id || 0;
        this.$http
          .get(
            `/api/app/getPcRoomCode/course_id=${item.course_basis_id}/chapter_id=${chapterID}`
          )
          .then(data => {
            window.location.href = data.chapterInfo.web_url;
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.study-calendar-list {
  .item {
    padding: 20px 20px;
    background-color: #fff;
    margin: 20px;
    border-radius: 5px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    .info1 {
      margin-bottom: 20px;
      * {
        vertical-align: middle;
      }
      .course-type {
        background-color: $theme_color;
        font-size: 20px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        border-radius: 4px;
        padding: 2px 10px;
        margin-right: 20px;
      }
      .play-status {
        font-size: 25px;
        color: #8c8c8c;
        margin-right: 20px;
      }
      .duration {
        font-size: 24px;
        color: #595959;
      }
      .playing {
        color: $theme_color;
      }
    }
    .info2 {
      font-size: 30px;
      color: #595959;
    }
  }
}
</style>