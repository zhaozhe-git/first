<template>
  <div class="result-page">
    <headers :title="title"></headers>
    <section class="rp-time">
      <p v-if="reportBase.name">
        <span v-if="type == 'Exam'">{{reportBase.report_type == 2 ? '《正式考试》':'《模拟考试》'}}</span>
        {{reportBase.name}}
      </p>
      <p>答题用时：{{reportBase.report_time_long | timeMeter(2)}}</p>
      <p v-if="type != 'Point'">交卷时间：{{reportBase.created_at | fomartTime('yyyy-MM-dd hh:mm:ss')}}</p>
      <p v-else>交卷时间：{{reportBase.created_at}}</p>
    </section>
    <section class="rp-score" v-if="type != 'Point'">
      <p>得分</p>
      <div
        class="rp-circle"
        :class="reportBase.point > reportBase.pass_score ? 'rp-circle-pass':'rp-circle-fail'"
      >
        <p class="rpc-score">{{reportBase.point}}</p>
        <p>分</p>
      </div>
      <div>
        <p>
          总分：
          <span>{{reportBase.score}}分</span>
        </p>
        <p>
          通过分数：
          <span>{{reportBase.pass_score}}分</span>
        </p>
      </div>
    </section>
    <section class="rp-statistics">
      <div class="rps-child">
        <div>
          <p>答对</p>
          <p class="green">{{reportBase.right_count}}</p>
        </div>
        <div>
          <p>错误</p>
          <p class="red">{{reportBase.wrong_count}}</p>
        </div>
        <div v-if="!($route.query.number == 0 && type == 'Point')">
          <p>未做</p>
          <p class="defaul">{{reportBase.not_count}}</p>
        </div>
      </div>
      <div class="rps-foot">
        <p>
          正确率
          <span>{{type == 'Point' ? (reportBase.correct_rate*100).toFixed(1):reportBase.correct_rate}}%</span>
        </p>
        <p>共{{reportBase.right_count + reportBase.wrong_count + reportBase.not_count}}道题</p>
      </div>
    </section>
    <section class="rp-anwser">
      <div class="rpa-head">
        <p>答题卡</p>
        <p class="notice">
          <i class="green"></i> 答对
        </p>
        <p class="notice">
          <i class="red"></i>答错
        </p>
        <p class="notice">
          <i class="default"></i>未做
        </p>
      </div>
      <div class="ques-card" v-if="type != 'Point'">
        <section class="sec-info" v-for="(pItem, pIndex) in reportBase.answer_card" :key="pIndex">
          <p>第{{num[pIndex+1]}}部分：{{pItem.section.section_name}} {{pItem.section.section_description}}（共{{pItem.section.section_question_num}}道题）</p>
          <div>
            <div v-for="(item,index) in pItem.answerCard" :key="index">
              <p
                class="number"
                :class="item.is_right==1?'true':item.is_right==2?'false':''"
              >{{index+1}}</p>
            </div>
          </div>
        </section>
      </div>
      <div class="ques-card" v-else>
        <section class="sec-info">
          <div>
            <div class="mar20" v-for="(item,index) in reportBase.reports" :key="index">
              <p
                class="number"
                :class="item.is_right==1?'true':item.is_right==2?'false':''"
              >{{index+1}}</p>
            </div>
          </div>
        </section>
      </div>
    </section>
    <div v-if="type == 'Exam'" class="course-two-btn">
      <van-button @click="goBack(1)" :class="{'defaults':!reportBase.wrong_count}">错题解析</van-button>
      <van-button @click="goBack(0)">全部解析</van-button>
    </div>
    <van-button v-else class="course-btn" @click="goBack(0)">答案解析</van-button>
  </div>
</template>

<script>
import headers from "@/components/Header";
export default {
  name: "Result",
  components: {
    headers
  },
  data() {
    return {
      title: {
        name: "成绩统计"
      },
      reportBase: {},
      detail: {},
      paper_id: this.$route.query.paper_id || 8, //套卷id
      report_id: this.$route.query.id || 1, //报告id
      type: this.$route.query.type || "Package",
      num: {
        "1": "一",
        "2": "二",
        "3": "三",
        "4": "四",
        "5": "五",
        "6": "六",
        "7": "七"
      }
    };
  },
  computed: {
    text() {
      return parseInt(this.reportBase.point) + "分";
    }
  },
  created() {
    if (this.type == "Point") {
      this.getPointReport();
    } else {
      this.getExamReport();
    }
  },
  methods: {
    /**
     * 仿真/套卷答题报告
     *  */

    getExamReport() {
      let url_type = "practice";
      if (this.type == "Exam") url_type = "simulation";
      this.$http
        .get(`/api/app/exam/${url_type}/reportBase/${this.report_id}`)
        .then(res => {
          this.reportBase = res;
          this.reportBase.point = Number(this.reportBase.point);
        });
    },
    /**
     * 考点报告
     */
    getPointReport() {
      this.$http
        .get(`/api/app/report/examPoint/${this.report_id}`)
        .then(res => {
          this.reportBase = res;
        });
    },
    /**
     * 查看解析
     */
    goBack(lookError) {
      let query = {
        id: this.paper_id,
        report_id: this.report_id,
        type: this.type
      };
      if (lookError) {
        if (!this.reportBase.wrong_count) {
          return;
        }
        query.error = 1;
      }
      this.$router.push({
        name: "Ques",
        query
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.defaults {
  color: #ccc;
}
.result-page {
  @extend %default-bg;
  padding-bottom: 90px;
  .rp-time {
    margin: 20px 30px;
    background: #fff;
    padding: 20px 30px;
    border-radius: 10px;
    p {
      padding-top: 4px;
      padding-left: 40px;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(89, 89, 89, 1);

      line-height: 60px;
      &:nth-child(1) {
        background: url("~@/assets/images/result-point.png") no-repeat left
          center;
        background-size: 26px 26px;
      }
      &:nth-child(2) {
        background: url("~@/assets/images/result-time.png") no-repeat left
          center;
        background-size: 23px 27px;
      }
      &:nth-child(3) {
        background: url("~@/assets/images/result-time-other.png") no-repeat left
          center;
        background-size: 26px 26px;
      }
    }
  }
  .rp-score {
    margin: 0 30px;
    background: #fff;
    padding: 30px;
    border-radius: 10px;
    & > p {
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(38, 38, 38, 1);
    }
    .rp-circle {
      width: 204px;
      height: 206px;
      margin: 30px auto;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      p {
        font-family: PingFang SC;
        &:nth-child(1) {
          font-size: 47px;
          font-weight: 500;
          margin-bottom: 6px;
        }
      }
    }
    .rp-circle-pass {
      background: url("../../assets/images/ques-result-pass.png") no-repeat;
      background-size: 100% 100%;
      p {
        &:nth-child(1) {
          color: rgba(12, 202, 164, 1);
        }
      }
    }
    .rp-circle-fail {
      background: url("../../assets/images/ques-result-refuse.png") no-repeat;
      background-size: 100% 100%;
      p {
        &:nth-child(1) {
          color: #f65b7a;
        }
      }
    }
    & > div {
      display: flex;
      justify-content: space-between;
      p {
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(140, 140, 140, 1);
        &:nth-child(1) span {
          color: #ff4157;
          font-size: 28px;
        }
        &:nth-child(2) span {
          color: #0ccaa4;
          font-size: 28px;
        }
      }
    }
  }
  .rp-statistics {
    margin: 20px 30px;
    background: #fff;
    padding: 30px 0;
    border-radius: 10px;
    .rps-child {
      display: flex;
      justify-content: center;
      div {
        padding: 12px 0;
        margin: 0 25px;
        width: 158px;
        height: 81px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(217, 217, 217, 1);
        border-radius: 10px;
        p {
          font-size: 24px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(140, 140, 140, 1);
          line-height: 40px;
          text-align: center;
        }
        p.green {
          color: #0ccaa4;
          font-size: 30px;
        }
        p.red {
          color: #ff4157;
          font-size: 30px;
        }
        p.defaul {
          color: #b7b7b7;
          font-size: 30px;
        }
      }
    }
    .rps-foot {
      display: flex;
      justify-content: space-between;
      padding: 50px 30px 0 30px;
      p {
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(140, 140, 140, 1);
        span {
          color: #ff4157;
          font-size: 28px;
        }
      }
    }
  }
  .rp-anwser {
    margin-top: 30px;
    background: #fff;
    .rpa-head {
      height: 86px;
      border-bottom: 1px solid rgba(234, 234, 234, 1);
      padding: 0 30px;
      line-height: 86px;
      display: flex;
      p {
        display: flex;
        align-items: center;
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 400;
        &:nth-child(1) {
          flex: 1;
          color: rgba(38, 38, 38, 1);
        }
      }
      .notice {
        color: #8c8c8c;
        font-size: 24px;
        i {
          display: inline-block;
          width: 24px;
          height: 24px;
          border-radius: 12px;
          margin: 0 10px 0 30px;
        }
        .green {
          background: rgba(12, 202, 164, 1);
        }
        .red {
          background: #ff4157;
        }
        .default {
          border: 1px solid rgba(183, 183, 183, 1);
        }
      }
    }
    .ques-card {
      padding-bottom: 30px;
    }
    .sec-info {
      & > p {
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(89, 89, 89, 1);
        line-height: 40px;
        padding: 20px 20px 0;
      }
      & > div {
        display: flex;
        flex-wrap: wrap;
        div {
          margin-top: 20px;
          width: 20%;
        }
      }
    }
    .number {
      margin: 0 auto;
      width: 54px;
      height: 54px;
      border: 1px solid #eaeaea;
      border-radius: 50%;
      text-align: center;
      font-size: 30px;
      color: #b8b8b8;
      line-height: 54px;
      cursor: pointer;
      flex-shrink: 0;
    }
    .active {
      background-color: $theme_color;
      border: 1px solid $theme_color;
      color: #fff;
    }
    .true {
      background-color: #0ccaa4;
      border: 1px solid #0ccaa4;
      color: #fff;
    }
    .false {
      background-color: #ff4157;
      border: 1px solid #ff4157;
      color: #fff;
    }
  }
  .course-btn {
    font-size: 30px;
  }
  .mar20 {
    margin-top: 20px;
  }
}
</style>
