<template>
  <div class="my-study-detail-cell" @click="onItem">
    <div class="title">
      <span class="try-see" v-if="$pub.showTrySee(this.course.course_type) && data.is_try_see">试看</span>
      <span
        class="play-type"
        v-if="$pub.showPlayType(this.course.course_type)"
        :class="{'play-type-playing': data.play_type == 2, 
        'play-type-playback' : data.play_type == 4}"
      >[{{data.play_type_name}}]</span>
      <span class="name">{{data.periods_title}}</span>
    </div>
    <div class="teacher">
      <span class="name">{{data.teachers_name}}</span>
      <span class="time" v-if="$pub.showDuration(this.course.course_type)">{{data.time}}</span>
    </div>
    <div class="datum" v-if="data.datum.length">
      <div v-for="(datumitem, index) in data.datum" :key="index">
        <div class="wrapper" v-for="(fileitem, fileindex) in datumitem.fileNames" :key="fileindex">
          <p @click.stop="onDatum(datumitem.datum_id, fileindex)">{{fileitem}}</p>
        </div>
      </div>
    </div>
    <div class="progress-info" v-if="$pub.showProgress(this.course.course_type)">
      <MyProgress width="75%" :percent="data.progress_rate"></MyProgress>
      <span>已观看{{data.progress_rate}}%</span>
    </div>
  </div>
</template>

<script>
import { PlayType } from "@/util/enums";
import MyProgress from "@/components/MyProgress";
export default {
  name: "my-study-detail-cell",
  props: {
    data: {
      type: Object,
      required: true
    },
    course: {
      type: Object,
      required: true
    }
  },
  components: {
    MyProgress
  },
  data() {
    return {};
  },
  created() {
    this.initData();
  },
  methods: {
    // on event
    onDatum(id, index) {
      this.$http.get(`/api/app/chapterDatum/${id}/${index + 1}`).then(data => {
        window.location.href = data.file_url;
      });
    },
    onItem() {
      switch (this.course.course_type) {
        case 5:
        case 8: // 录播课进video
          {
            this.$router.push({
              name: "Video",
              query: {
                id: this.course.course_id,
                video_id: this.data.video_id,
                title: this.data.periods_title
              }
            });
          }
          break;
        case 7:
        case 9: // 进入课程详情
          {
            this.$router.push({
              name: "CourseDetail",
              query: {
                id: this.course.course_id
              }
            });
          }
          break;
        case 10: // 图文课展示内容
          {
            this.$router.push({
              name: "PictureCourseDetail",
              query: {
                chapter_id: this.data.id,
                chapter_name: this.data.periods_title
              }
            });
          }
          break;
        default:
          // 其余打开直播
          {
            this.$http
              .get(
                `/api/app/getPcRoomCode/course_id=${this.course.course_id}/chapter_id=${this.data.id}`
              )
              .then(data => {
                window.location.href = data.chapterInfo.web_url
              });
          }
          break;
      }
    },
    // other
    initData() {
      // play type name
      this.data.play_type_name = PlayType.getValue(this.data.play_type);
      if (
        this.course.course_type == 7 &&
        (this.data.play_type == 3 || this.data.play_type == 4)
      ) {
        this.data.play_type_name = "已结束";
      }
      // teachers name
      let ary = [];
      this.data.teachers.forEach(ci => {
        ary.push(ci.teacher_name);
      });
      this.data.teachers_name = ary.join();
      // time
      this.data.time = this.data.start_play + " - " + this.data.end_play;
      // datum
      this.data.datum &&
        this.data.datum.forEach(i => {
          i.fileNames = i.file_name.split(";");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.my-study-detail-cell {
  border: 4px solid #e9e9e9;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 30px;
  .title {
    padding-left: 30px;
    position: relative;
    .try-see {
      display: inline-block;
      width: 80px;
      height: 36px;
      border-radius: 5px;
      background-color: $theme_color;
      font-size: 24px;
      color: #fff;
      line-height: 36px;
      text-align: center;
      margin-right: 10px;
    }
    .play-type {
      margin-right: 10px;
      font-size: 24px;
      color: #8c8c8c;
    }
    .play-type-playback {
      color: #ea7a2f;
    }
    .play-type-playing {
      color: $theme_color;
    }
    .name {
      font-size: 24px;
      color: #595959;
    }
    * {
      vertical-align: middle;
    }
    &::before {
      content: "";
      display: block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: $theme_color;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .teacher {
    padding-left: 30px;
    margin-top: 15px;
    font-size: 24px;
    color: #8c8c8c;
    .time {
      margin-left: 20px;
    }
  }
  .datum {
    padding-left: 30px;
    margin-top: 20px;
    .wrapper {
      margin-bottom: 10px;
      p {
        display: inline-block;
        font-size: 24px;
        color: $theme_color;
        background-color: $theme_color_light;
        padding: 10px 20px;
        border-radius: 20px;
      }
    }
  }
  .progress-info {
    margin-top: 20px;
    font-size: 24px;
    color: #8c8c8c;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>