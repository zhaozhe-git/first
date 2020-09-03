<template>
  <div class="pack-card">
    <template v-if="list.length">
      <div class="pc-item" v-for="(item,index) in list" :key="index">
        <!-- 标题 -->
        <div class="pc-t" v-if="comType=='Assess'">
          <p class="pc-title">
            <font v-if="item.report_type == 1 || item.report_type == 2">
              <font :class="{'default': item.is_useful == 3}">[{{stateType[item.is_useful]}}]</font>
            </font>
            {{item.package_name}}
          </p>
          <span>
            <font>{{item.right_count}}</font>
            <font style="color: #8c8c8c;">/{{item.ques_count}}</font>
          </span>
        </div>
        <p class="pc-title" v-else>
          <span v-if="comType=='Exam'">《{{item.exam_type == 2 ? '正式考试':'模拟考试'}}》</span>
          <span>{{item.name}}</span>
        </p>
        <!-- 考试信息 -->
        <div class="pc-info" v-if="comType=='Package'">
          <p>
            <span>共{{item.question_num}}道题</span>
            <span>考试时长：{{que_time(item.limit_time)}}</span>
          </p>
        </div>
        <div class="pc-info" v-else-if="comType=='Exam'">
          <p v-if="examType == 0">
            <span class="theme-color">{{item.exam_type == 2 ? '正式考试':'模拟考试'}}</span>
            <span>考试时长：{{que_time(item.limit_time)}}</span>
          </p>
          <p>
            <span v-if="examType != 0">考试时长：{{que_time(item.limit_time)}}</span>
            <span>满分：{{item.limit_time}}</span>
            <span>通过分数：{{item.pass_score}}</span>
          </p>
          <p>考试时间：{{item.start_time | fomartTime('MM/dd hh:mm:ss')}} ~ {{item.end_time | fomartTime('MM/dd hh:mm:ss')}}</p>
          <p>考试次数：{{item.repeat_times}}次（已考{{item.have_done_count}}次）共{{item.question_num}}道题</p>
        </div>
        <div class="pc-info" v-else-if="comType == 'Assess'">
          <p v-if="item.report_type==3">
            <span>答题时长：{{item.report_time_long ? item.report_time_long: '暂无'}}</span>
          </p>
          <p v-else-if="item.report_type==4">
            <span>答题时长：{{item.report_time_long ? item.report_time_long: '暂无'}}</span>
            <span>正确率：{{item.correct_rate}}%</span>
          </p>
          <p v-else>
            <span>{{item.report_type==1 ? '模拟考试':"正式考试"}}</span>
            <span>考试次数：{{item.have_done_count}}/{{item.repeat_times}}</span>
            <span>考试时长：{{item.report_time_long ? item.report_time_long: '暂无'}}</span>
          </p>
          <p>
            <span>{{item.report_type == 4 ? '提交时间':'交卷时间'}}：{{item.created_at | fomartTime('yyyy-MM-dd hh:mm:ss')}}</span>
          </p>
        </div>
        <!-- 操作 -->
        <div class="footer">
          <!-- 套卷 -->
          <div v-if="comType=='Package'">
            <van-button v-if="item.report_id" @click="goPage('Result',item)">查看成绩</van-button>
            <van-button v-if="item.done_status == 1" @click="goPage('Ques',item)">再练一次</van-button>
            <van-button v-else @click="goPage('Ques',item)">开始做题</van-button>
          </div>
          <!-- 仿真 -->
          <div v-else-if="comType=='Exam'">
            <!-- 查看成绩 进行中 0<已考次数<考试最高次数、已考次数=考试最高次数  //  已逾期 已考次数!=0  -->
            <van-button
              v-if="(item.start_status == 1 || item.start_status == 3) && item.have_done_count > 0"
              @click="goPage('Result',item)"
            >查看成绩</van-button>
            <!-- 查看详情  进行中 已考次数=考试最高次数  // 已逾期 已考次数=0  -->
            <van-button
              v-if="(item.start_status == 1 && item.have_done_count == item.repeat_times) || (item.start_status == 3 && item.have_done_count == 0)"
              @click="goPage('Ques',item, 1)"
            >查看详情</van-button>
            <!-- 再考一次 进行中 0<已考次数<考试最高次数 -->
            <van-button
              v-if="item.start_status == 1  && item.have_done_count > 0 && item.have_done_count < item.repeat_times"
              @click="goPage('Ques',item)"
            >再考一次</van-button>
            <!-- 立即考试 进行中 已考次数为0  -->
            <van-button
              v-if="item.start_status == 1 && item.have_done_count == 0"
              @click="goPage('Ques',item)"
            >立即考试</van-button>
            <!-- 即将开始 未开始 -->
            <van-button class="default" v-if="item.start_status == 2">即将开始</van-button>
          </div>
          <!-- 测评 -->
          <div v-else-if="comType=='Assess'">
            <van-button class="default" v-if="item.report_type == 3 && item.is_release != 1">已结束</van-button>
            <van-button
              @click="goPage(item.report_type == 4 ? 'isAnalysis':'Result' ,item,1)"
            >{{item.report_type == 4 ?'查看解析':'查看成绩'}}</van-button>
            <van-button
              v-if="item.report_type == 4 || ((item.repeat_times > item.have_done_count) && item.is_useful == 1) || (item.report_type == 3 && item.is_release == 1)"
              @click="goPage('Ques',item,2)"
            >重新练习</van-button>
          </div>
        </div>
        <img class="exam-state" v-if="comType=='Exam'" :src="img[item.start_status]" />
        <img
          class="exam-nopass"
          src="@/assets/images/exam-no-pass.png"
          v-if="item.pass_status && item.pass_status == 2"
        />
        <img
          class="exam-nopass"
          src="@/assets/images/exam-pass.png"
          v-if="item.pass_status && item.pass_status == 1"
        />
      </div>
    </template>
    <template v-else>
      <empty :empty_type="empty_type"></empty>
    </template>
  </div>
</template>

<script>
import empty from "@/components/Empty";
export default {
  name: "QuestionCard",
  components: {
    empty
  },
  props: {
    comType: {
      type: String,
      default: "Package"
    },
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    examType: {
      default: 0
    }
  },
  data() {
    return {
      img: {
        "1": require("@/assets/images/exam-ing.png"),
        "2": require("@/assets/images/exam-will.png"),
        "3": require("@/assets/images/exam-finish.png")
      },
      empty_type: {
        name: "请稍候，套卷正在赶来的路上啦"
      },
      stateType: {
        "1": "进行中",
        "2": "未开始",
        "3": "已结束"
      }
    };
  },
  methods: {
  	que_time(time){
  		if(time>0)
  		{
  			return time;
  		}
  		else
  		{
  			return '无限制';
  		}
  	},
    goPage(name, item,type, preview = 0) {
      let query = {};
      if (this.comType != "Assess") {
        query.type = this.comType;
      } else {
        switch (item.report_type) {
          case 1:
          case 2:
            query.type = "Exam";
            break;
          case 3:
            query.type = "Package";
            break;
          case 4:
            // 测评考点  如果name=isAnalysis 表示跳转考点解析； name=Ques 跳转做题 但是提交完成后为直接展示解析
            query.type = "Point";
            if (name == "isAnalysis") {
              query.report_id = item.report_id;
            } else {
              query.isShowAn = 1;
              query.id = item.report_id;
            }
            break;
          default:
            break;
        }
      }
      if (name == "Result") {
        query.id = item.report_id;
        query.paper_id = item.id ? item.id : item.package_id;
      } else if (name == "isAnalysis") {
        name = "Ques";
        query.id = item.package_id;
      } else {
        if (preview) {
          query.preview = 1;
        }
        query.id = item.id
          ? item.id
          : item.paper_id
          ? item.paper_id
          : item.package_id;
      }
      if(item.report_type==4&&type ==2)
      {
      	query.id=item.report_id;
      }
      query.point_name=item.package_name;
      this.$router.push({
        name,
        query
      });
    }
  },
  created() {
    if (this.comType == "Package") {
      this.empty_type.name = "请稍候，套卷正在赶来的路上啦";
    } else if (this.comType == "Exam") {
      this.empty_type.name = "请稍候，模考正在赶来的路上啦";
    } else {
      this.empty_type.name = "该时段您没有留下测评记录哦！";
    }
  }
};
</script>

<style lang='scss' scoped>
.theme-color {
  color: $theme_color;
}
.pack-card {
  padding: 0 30px;
  .pc-item {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 16px 0px rgba(10, 0, 24, 0.08);
    border-radius: 10px;
    padding: 30px;
    font-family: PingFang SC;
    font-weight: 400;
    margin-top: 30px;
    position: relative;
    .pc-t {
      display: flex;
      justify-content: space-between;
      p {
        width: 500px;
      }
      span {
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(74, 112, 255, 1);
        line-height: 40px;
      }
    }
    .pc-title {
      font-size: 28px;
      color: rgba(38, 38, 38, 1);
      line-height: 40px;
      padding-bottom: 10px;
      width: 600px;
      font {
        color: #0097fa;
      }
      .default {
        color: #8c8c8c;
      }
    }
    .pc-info {
      p {
        line-height: 46px;
        font-size: 24px;
        color: rgba(140, 140, 140, 1);
        span {
          padding-right: 40px;
        }
      }
    }
    .footer {
      display: flex;
      flex-direction: row-reverse;
      padding-top: 20px;
      div {
        button {
          width: 156px;
          height: 56px;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(65, 105, 255, 1);
          border-radius: 28px;
          font-size: 24px;
          text-align: center;
          line-height: 56px;
          color: rgba(65, 105, 255, 1);
          margin-left: 17px;
        }
        .default {
          border-color: #d9d9d9;
          color: #595959;
        }
      }
    }
    .exam-state {
      position: absolute;
      right: 0;
      top: 0;
      width: 85px;
      height: 83px;
    }
    .exam-nopass {
      position: absolute;
      right: 30px;
      top: 65px;
      width: 88px;
      height: 71px;
    }
  }
}
</style>
