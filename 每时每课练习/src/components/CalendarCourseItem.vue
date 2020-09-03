<template>
  <el-card class="calendar-course-item" shadow="hover">
    <div class="duration">{{courseData.duration}}</div>
    <div class="info1">
      <span class="course-type">{{courseData.course_type_name}}</span>
      <span
        class="play-status"
        :class="{playing:courseData.live_status==1}"
      >[{{courseData.live_status_name}}]</span>
      <span v-if="courseData.course_type == 1" class="period-title">约课学员：{{courseData.nickname}}</span>
      <span v-else class="period-title">{{courseData.period_title}}</span>
    </div>
    <div class="info2">
      <span
        v-if="courseData.course_type == 1"
        class="course-title"
      >学员可在约课前{{courseData.advance_time}}分钟进入教室</span>
      <span v-else class="course-title">{{courseData.course_title}}</span>
    </div>
    <div class="btn">
      <el-button
        type="primary"
        size="small"
        v-if="courseData.course_type == 7"
        @click="onDetail"
      >查看详情</el-button>
      <el-button
        class="enter"
        type="primary"
        size="small"
        v-else-if="courseData.live_status == 1 || courseData.live_status == 2"
        @click="onPlay"
      >进入直播</el-button>
      <el-button
        type="primary"
        size="small"
        v-else-if="courseData.live_status == 3 && courseData.is_playback"
        @click="onPlay"
      >查看回放</el-button>
      <p class="no-replay" v-else-if="courseData.live_status == 3 && !courseData.is_playback">暂无回放</p>
    </div>
  </el-card>
</template>

<script>
import { CourseType, LiveStatus } from '@/util/enums'
export default {
  name: 'calendar-course-item',
  props: {
    course: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    courseData() {
      const ret = this.course
      ret.duration = new Date(ret.start_play * 1000).format('hh:mm') + ' - ' + new Date(ret.end_play * 1000).format('hh:mm')
      ret.course_type_name = CourseType.getValue(ret.course_type)
      ret.live_status_name = LiveStatus.getValue(ret.live_status)
      return ret
    }
  },
  methods: {
    onDetail() {
      const { href } = this.$router.resolve({
        path: `/course/${this.courseData.course_basis_id}`,
        query: {
          tab: 1
        }
      })
      window.open(href, '_blank')
    },
    onPlay() {
      if (this.courseData.course_type == 1) {
        this.$http.get(`/api/lector/teacher/getLiveRoomCode/${this.courseData.course_basis_id}/0`).then(data => {
          // client_url,说明可以唤起客户端
          if (data.client_url) {
            const { href } = this.$router.resolve({
              name: 'DownloadClient',
              query: {
                url: data.client_url
              }
            })
            window.open(href, '_blank')
          } else {
            window.open(data.web_url, '_blank')
          }
        })
      } else {
        const chapterID = this.courseData.course_chapter_id || 0
        this.$http.get(`/api/lector/teacher/entrance/${this.courseData.course_basis_id}/${this.courseData.course_type}/${chapterID}`).then(data => {
          // client_url,说明可以唤起客户端
          if (data.client_url) {
            const { href } = this.$router.resolve({
              name: 'DownloadClient',
              query: {
                url: data.client_url
              }
            })
            window.open(href, '_blank')
          } else {
            window.open(data.web_url, '_blank')
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/varibles.scss";
.calendar-course-item {
  margin-bottom: 20px;
  position: relative;
  .duration {
    font-size: 14px;
    color: #595959;
    margin-bottom: 10px;
  }
  .info1 {
    margin-bottom: 10px;
    .course-type {
      background-color: $primary_color;
      width: 41px;
      height: 17px;
      border-radius: 3px;
      font-size: 11px;
      color: #fff;
      padding: 0 5px;
      margin-right: 10px;
    }
    .play-status {
      font-size: 14px;
      color: #8c8c8c;
      margin-right: 10px;
    }
    .playing {
      color: $primary_color;
    }
    .period-title {
      font-size: 14px;
      color: #595959;
    }
  }
  .info2 {
    .course-title {
      font-size: 14px;
      color: #b7b7b7;
    }
  }
  .btn {
    position: absolute;
    top: 50%;
    right: 24px;
    transform: translateY(-50%);
    .enter {
      background-color: $primary-color-light !important;
      border: none;
      color: $primary-color;
    }
    .no-replay {
      font-size: 14px;
      color: #8c8c8c;
    }
  }
}
</style>