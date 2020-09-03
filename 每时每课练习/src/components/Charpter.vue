<template>
  <div class="charpter">
    <van-collapse v-model="active" :border="false" v-if="list.length && list[0].child">
      <van-collapse-item
        v-for="(item,index) in list"
        :key="index"
        :title="item.title"
        :name="index"
        :border="false"
      >
        <section v-for="(it,idx) in item.child" :key="idx">
          <div class="charp-title" @click="play(it)">
            <span class="tree-see" v-if="it.is_try_see && item.course_type != 7">试看</span>
            <span
              class="huifang"
              v-if="(item.course_type == 2 || item.course_type == 3) && it.play_type == 4 "
            >回放</span>
            <span
              v-if="(item.course_type == 2 || item.course_type == 3) && it.play_type != 4"
              :class="it.play_type == 2 ?'active':'noplay'"
            >[{{play_state[it.play_type]}}]</span>
            {{it.periods_title}}
          </div>
          <p class="charp-time">
            {{it.teacher_name}}
            <span v-if="it.start_play">{{it.start_play}} - {{it.end_play}}</span>
          </p>
          <p
            class="com-p"
            v-for="file in it.datum_files"
            :key="file.id"
            @click="openFile(file)"
          >{{file.name}}</p>
        </section>
      </van-collapse-item>
    </van-collapse>
    <div v-else>
      <section class="period" v-for="(it,idx) in list" :key="idx">
        <div class="charp-title" @click="play(it)">
          <span class="tree-see" v-if="it.is_try_see && it.course_type != 7">试看</span>
          <span
            class="huifang"
            v-if="(it.course_type == 2 || it.course_type == 3) && it.play_type == 4 "
          >回放</span>
          <span
            v-if="(it.course_type == 2 || it.course_type == 3) && it.play_type != 4"
            :class="it.play_type == 2 ?'active':'noplay'"
          >[{{play_state[it.play_type]}}]</span>
          {{it.periods_title}}
        </div>
        <p class="charp-time">
          {{it.teacher_name}}
          <span v-if="it.start_play">{{it.start_play}} - {{it.end_play}}</span>
        </p>
        <p
          class="com-p"
          v-for="file in it.datum_files"
          :key="file.id"
          @click="openFile(file)"
        >{{file.name}}</p>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "Charpter",
  props: {
    charpters: {
      type: Array
    },
    detail: {
      type: Object
    }
  },
  data() {
    return {
      active: [],
      play_state: ["无状态", "未开始", "直播中", "暂无回放", "回放"]
    };
  },
  computed: {
    list() {
      let list = this.charpters;
      list.forEach((item, index) => {
        item.title = index + 1 + "、" + item.title;
        if (item.child) {
          item.child.forEach(it => {
            this.initData(it);
          });
        } else {
          this.initData(item);
        }
      });
      return list || [];
    }
  },
  methods: {
    initData(it) {
      if (it.teachers && it.teachers.length) {
        it.teacher_name = this.$pub.objToStr(
          it.teachers,
          "，",
          "teacher_name",
          2
        );
      }
      if (it.datum.length) {
        it.datum_files = [];
        it.datum.forEach(its => {
          its.file_name.split(";").forEach((item, index) => {
            it.datum_files.push({
              name: item,
              id: index + 1,
              datum_id: its.datum_id
            });
          });
        });
      }
    },
    play(it) {
      if (it.course_type == 7) {
        return;
      }
      if (it.course_type == 10) {
        // 图文
        this.$http.get(`/api/app/chapterInfo/${it.id}`).then(() => {
          this.$router.push({
            name: "PictureCourseDetail",
            query: {
              chapter_id: it.id,
              chapter_name: it.periods_title
            }
          });
        });
        return;
      }
      if (it.course_type == 5 || it.course_type == 8) {
        // 点播/音频
        this.$http
          .get(
            `/api/app/getPlayToken/video_id=${it.video_id}/course_id=${this.detail.id}`
          )
          .then(() => {
            this.$router.push({
              name: "Video",
              query: {
                video_id: it.video_id,
                id: this.detail.id
              }
            });
          });
      } else {
        //   公开，大班小班
        if (it.is_try_see || this.detail.is_buy || this.detail.is_join_study) {
          this.$http
            .get(
              `/api/app/getPcRoomCode/course_id=${this.detail.id}/chapter_id=${it.id}`
            )
            .then(res => {
              window.location.href = res.chapterInfo.web_url;
            });
        } else {
          this.$toast({
            message:
              this.detail.is_vip_user && this.detail.is_vip_course
                ? "请先加入学习"
                : "请先报名",
            duration: 1000
          });
        }
      }
    },
    openFile(file) {
      if (this.$pub.checkLogin()) {
        this.$http
          .get(`/api/app/chapterDatum/${file.datum_id}/${file.id}`)
          .then(res => {
            window.location.href = res.file_url;
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.charpter {
  padding: 0 30px 20px;
  section {
    padding-left: 40px;
    padding-bottom: 10px;
    .charp-title {
      position: relative;
      padding-left: 30px;
      line-height: 60px;
      font-size: 24px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(89, 89, 89, 1);
      &::after {
        content: "";
        position: absolute;
        left: 4px;
        top: 50%;
        transform: translateY(-50%);
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: $theme_color;
      }
      span {
        display: inline-block;
        margin-right: 10px;
        padding: 0 10px;
        height: 36px;
        border-radius: 4px;
        font-size: 24px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.85);
        line-height: 36px;
        text-align: center;
      }
      span.tree-see {
        background: $theme_color;
      }
      span.huifang {
        background: #ea7a2f;
      }
      span.active {
        color: $theme_color;
      }
      span.noplay {
        color: #8c8c8c;
      }
    }
    .charp-time {
      font-size: 24px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(140, 140, 140, 1);
      padding-bottom: 10px;
      padding-left: 50px;
      span {
        padding-left: 20px;
      }
    }
    .com-p {
      font-size: 24px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(89, 89, 89, 1);
      line-height: 56px;
      padding-left: 74px;
      background: url("../assets/images/charpter-pdf.png") no-repeat 50px 20px;
      background-size: 16px 16px;
    }
  }
  section.period {
    padding: 20px 0 0 0;
  }
}
</style>
