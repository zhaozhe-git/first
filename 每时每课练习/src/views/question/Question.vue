<template>
  <div class="has-head-content exam-box">
    <!-- 头部 -->
    <div class="header">
      <header>
        <span class="back" @click="exit">
          <img src="@/assets/images/return.png" />
        </span>
        <div class="h-title">
          <div class="q-time" @click="stopTime" v-if="time">
            <img src="@/assets/images/question-time.png" />
            <p>{{time | timeMeter}}</p>
          </div>
          <i class="q-card" @click="$refs.question.openModel(1)"></i>
          <i
            class="q-collect"
            :class="{'q-collect-active': questionList[nowIdx].collect_id}"
            @click="collect"
          ></i>
          <i class="q-wrong" @click="$refs.question.openModel(0)"></i>
        </div>
      </header>
    </div>
    <!-- 试卷信息 -->
    <section
      class="qc-part-info"
      :class="{'no-section': !currentSection}"
      v-if="packInfo.package_name"
    >
      <div>
        <p>
          <span v-if="type=='Exam'">{{packInfo.report_type == 2 ? '《正式考试》':'《模拟考试》'}}</span>
          {{packInfo.package_name}}
        </p>
        <p>
          <font>{{nowIdx+1}}</font>
          <span>/{{questionList.length}}</span>
        </p>
      </div>
      <p
        v-if="currentSection"
      >第{{num[currentSection.idx]}}部分：{{currentSection.section_name}} {{currentSection.section_description}}（共{{currentSection.section_question_num}}道题）</p>
    </section>
    <!-- 题目 -->
    <question
      ref="question"
      :questions="questionList"
      :isAnalysis="isAnalysis"
      :packInfo="packInfo"
      :secInfo="secInfo"
      :point="point"
      :showBtn="showBtn"
      :setCurrentIndex="setCurrentIndex"
      class="questions"
    >
      <button
        v-if="!isAnalysis && !preview"
        class="submit"
        type="button"
        slot="subBtn"
        @click="sumitNotice"
      >交卷并查看结果</button>
    </question>
    <!-- 提示 -->
    <van-dialog class="dialogs" v-model="visible" show-cancel-button @confirm="dialogOk">
      <p class="submit-p">{{submitMsg}}</p>
    </van-dialog>
    <van-dialog
      class="dialogs-other"
      confirm-button-text="点击任意位置继续"
      v-model="stopTimeModel"
      close-on-click-overlay
    >
      <p class="submit-p">
        休息一下
        <br />
        共有{{this.questionList.length}}道题，还有{{this.questionList.length-this.done}}道题没做
      </p>
    </van-dialog>
    <van-dialog
      class="dialogs"
      v-model="exitShow"
      show-cancel-button
      confirm-button-text="继续答题"
      cancel-button-text="退出答题"
      @cancel="$router.go(-1)"
      @confirm="exitShow=false"
    >
      <p class="submit-p">您已做0道题，是否退出答题</p>
    </van-dialog>
  </div>
</template>

<script>
import question from "@/components/question/Question";
export default {
  name: "Ques",
  components: {
    question
  },
  inject: ["reload"],
  data() {
    return {
      report_id: this.$route.query.report_id || 0, //解析
      id: this.$route.query.id,
      type: this.$route.query.type || "Package", //类型
      preview: this.$route.query.preview ? true : false, //预览
      nowIdx: 0,
      letters: {
        "0": "A",
        "1": "B",
        "2": "C",
        "3": "D",
        "4": "E",
        "5": "F",
        "6": "G",
        "7": "H",
        "8": "I",
        "9": "J",
        "10": "K"
      },
      num: {
        "1": "一",
        "2": "二",
        "3": "三",
        "4": "四",
        "5": "五",
        "6": "六",
        "7": "七"
      },
      questionList: [
        {
          ques_stem: "",
          question_stem_text: "",
          ques_type: 2,
          ques_option: [
            {
              id: 1,
              content: "",
              is_right: 1
            },
            {
              id: 2,
              content: "",
              is_right: 1
            },
            {
              id: 3,
              content: "",
              is_right: 2
            },
            {
              id: 4,
              content: "",
              is_right: 2
            }
          ],
          score: "10.0",
          user_answer: [],
          is_right: 2,
          point_name: ""
        }
      ], // 题目列表
      startTime: "", // 开始答题时间
      time: 0, // 倒计时秒
      sendTimer: null, // 计时器
      isAnalysis: false,
      visible: false, // 弹窗是否展示
      stopTimeModel: false,
      submitStatus: 1, // 1: 确认交卷，2: 题目未答完
      analysisInfo: {}, // 考试解析信息
      secInfo: [],
      packInfo: {},
      done: 0,
      number: this.$route.query.number,
      point: false,
      showBtn: true,
      exitShow: false
    };
  },
  watch: {
    stopTimeModel(val) {
      if (val == false) {
        this.getTime();
      }
    }
  },
  computed: {
    // 交卷提示语句
    submitMsg() {
      if (this.submitStatus == 1) {
        return "确认交卷吗？";
      } else if (this.submitStatus == 2) {
        return (
          "您还有" +
          (this.questionList.length - this.done) +
          "道题未做，确认交卷吗？"
        );
      } else if (this.submitStatus == 3) {
        return "确定退出？退出后未完成的将不会保存，是否确定？";
      } else if (this.submitStatus == 4) {
        return "考试即将结束，五分钟后自动提交";
      }
    },
    typeUrl() {
      if (this.type == "Exam") return "simulation";
      if (this.type == "Package") return "practice";
      if (this.type == "Point") return "point";
    },
    currentSection() {
      if (this.questionList.length && this.questionList[this.nowIdx].idx) {
        for (let i in this.secInfo) {
          if (this.secInfo[i].idx == this.questionList[this.nowIdx].idx)
            return this.secInfo[i];
        }
      } else {
        return "";
      }
    }
  },
  created() {
    this.refreshPage();
  },
  methods: {
  	isText(_value) {//字符串是空就输出空，防止undefined
        _value = ""+_value;
        if (_value == "null" || _value == null || _value == "" || _value == "undefined") {
            return '';
        }
        return _value;
    },
    // 返回上一页面
    exit() {
      if (this.isAnalysis || this.preview) {
        this.$router.go(-1);
      } else {
        this.submitStatus = 3;
        this.visible = true;
      }
    },
    //套卷/仿真
    requestExam() {
      let params = {};
      if (this.type == "Exam") {
        if (this.preview) {
          params.action = "preview";
        } else {
          params.action = "start";
        }
      }
      this.$http
        .get(`/api/app/exam/${this.typeUrl}/showQuestion/${this.id}`, params)
        .then(res => {
          this.packInfo = res.package;
          if (!this.preview) {
            this.getTime();
          }
          this.setQues(res);
        })
        .catch(res => console.log(res));
    },
    // 考点
    examPoint() {
      this.$http.get(`/api/app/point/info/${this.id}`).then(res => {
        this.packInfo = { package_name: res[0] };
      });
      // 再练一次
      if (this.$route.query.isShowAn == 1) {
        this.$http.get(`/api/app/exam/point/reset/${this.id}`).then(res => {
          if(this.isText(res.question)!='')
          {
          	 this.getTime();
          	 this.questionList = this.createQuestion(res.question);
          }
          else
          {
          	this.$toast("没有试题");
	          	setTimeout(function(){
	          		window.history.go(-1);
	          	return false;
	          	},800);
          }
        });
      } else {
        this.$http
          .get(`/api/app/examPoint/questions/${this.id}/${this.number}`)
          .then(res => {
          	this.getTime();
            this.questionList = this.createQuestion(res);
          });
      }
    },
    // 习题收藏
    getCollect() {
      this.$http.get(`/api/app/myCollect/detail/${this.id}`).then(res => {
        this.questionList = this.createQuestion([res]);
      });
    },
    // 套卷/仿真解析
    getAnalysis() {
      this.$http
        .get(`/api/app/exam/${this.typeUrl}/reportDetail`, {
          report_id: this.report_id,
          paper_id: this.id,
          is_right: this.$route.query.error ? "2" : ""
        })
        .then(res => {
          this.packInfo = res.package;
          this.setQues(res);
        });
    },
    /**
     * 考点解析
     */
    getPointAn() {
      this.$http.get(`/api/app/point/info/${this.id}`).then(res => {
        this.packInfo = { package_name: res[0] };
      });
      this.$http
        .get(`/api/app/examPoint/answer/analysis/${this.report_id}`)
        .then(res => {
          this.questionList = this.createQuestion(res);
        });
    },
    /**
     *  仿真/套卷处理  此部分处理移到组件内会导致卡顿 暂无处理思路
     */
    setQues(res) {
      let arr = [], //试题list
        secInfo = []; //模块信息
      res.detail.forEach((item, index) => {
        item.section.idx = index + 1;
        secInfo.push(item.section);
        item.question.forEach(it => {
          it.idx = index + 1;
          arr.push(it);
        });
      });
      this.secInfo = secInfo;
      this.questionList = this.createQuestion(arr);
    },
    /**
     * 对话框确认按钮
     */
    dialogOk() {
      if (this.submitStatus == 1 || this.submitStatus == 2) {
        this.examSubmit();
      } else if (this.submitStatus == 3) {
        this.$router.go(-1);
      } else if (this.submitStatus == 4) {
        this.visible = false;
      }
    },
    // 提交试题
    sumitNotice() {
      this.getDoneQuestion();
      if (this.$route.query.isShowAn == 1 && this.done == 0) {
        this.exitShow = true;
        return;
      }
      // 测评记录考点类型进来之后的逻辑
      if (!this.visible) {
        if (this.questionList.length > this.done) {
          this.submitStatus = 2;
        } else {
          this.submitStatus = 1;
        }
        this.visible = true;
      }
    },
    /**
     * 交卷
     */
    examSubmit() {
      let question = this.$refs.question.getAnswer();
      let params = {
        paper_id: this.id,
        report_time_long: this.time,
        question
      };
      this.$http
        .post(`/api/app/exam/${this.typeUrl}/storeReport`, params)
        .then(res => {
          if (this.$route.query.isShowAn == 1) {
            // 如果是从测评进来的考点直接转换为考试解析
            this.$router.replace({
              name: "Ques",
              query: {
                id: res.paper_id,
                report_id: res.report_id,
                type: this.type,
                is_reset: 1
              }
            });
            // 调用根组件刷新方法
            this.reload();
          } else {
            // 正常交卷
            this.$router.replace({
              name: "Result",
              query: {
                id: res.report_id,
                paper_id: res.paper_id,
                type: this.type,
                number: this.number ? this.number : 0
              }
            });
          }
        });
    },
    /**
     * 生成试题
     */
    createQuestion(arr) {
      for (let j = 0; j < arr.length; j++) {
        let quesType =
          arr[j].ques_type == 1
            ? "单选"
            : arr[j].ques_type == 2
            ? "多选"
            : arr[j].ques_type == 3
            ? "判断"
            : "连线";
        let score = "";
        if (!this.point) {
          score = `<span class="number">${arr[j].score}分</span>`;
        }
        let quesTitle = `<div class="point"><span class="type">${quesType}</span>${score}<span class="idx">${j +
          1}、</span></div>`;
        arr[j].ques_stem = quesTitle + arr[j].ques_stem;
        arr[j].ques_num = j + 1;
        if (this.isAnalysis) {
          // 是否为解析
          arr[j].user_answer_letter = ""; // 用户答案
          arr[j].right_answer_letter = ""; // 标准答案
          arr[j].right_answer_letter = this.rightLetters(
            arr[j].ques_option,
            "answer"
          );
          if (arr[j].user_answer) {
            arr[j].user_answer_letter = this.rightLetters(
              arr[j].user_answer,
              "user"
            );
          }
          // 解析考点数据处理
          let point_arr = [];
          if (arr[j].point_name) {
            arr[j].point_name = arr[j].point_name.replace(/\s+/g, "");
            point_arr = arr[j].point_name.split(",");
          } else if (arr[j].point) {
            arr[j].point = arr[j].point.replace(/\s+/g, "");
            point_arr = arr[j].point.split(",");
          }
          arr[j].point_name = point_arr;
          if (arr[j].ques_type == 2) {
            // 多选
            let user_answer = [];
            if (arr[j].user_answer) {
              let list = this.jsonToString(arr[j].user_answer);
              list.forEach(option => {
                user_answer.push(option.id);
              });
            }
            arr[j].user_answer = user_answer;
          } else if (arr[j].ques_type == 4) {
            // 连线题
            let user_answer = [];
            if (arr[j].user_answer) {
              let list = this.jsonToString(arr[j].user_answer);
              arr[j].ques_option.left.forEach((ans, i) => {
                user_answer.push("");
                for (let idx in list) {
                  if (list[idx].id == ans.id) {
                    user_answer[i] = list[idx].answer;
                    break;
                  }
                }
              });
            }
            arr[j].user_answer = user_answer;
          } else {
            // 单选和判断
            let user_answer = "";
            if (arr[j].user_answer) {
              let list = this.jsonToString(arr[j].user_answer);
              user_answer = list[0].id;
            }
            arr[j].user_answer = user_answer;
          }
        } else {
          // 做题 格式化题目答案类型
          if (arr[j].ques_type == 2) {
            arr[j].user_answer = [];
          } else if (arr[j].ques_type == 4) {
            arr[j].user_answer = [];
            arr[j].ques_option.left &&
              arr[j].ques_option.left.forEach(ans => {
                arr[j].user_answer.push("");
              });
          } else {
            arr[j].user_answer = "";
          }
        }
      }
      return arr;
    },
    /* 
    /* arr: 目标数组  type：对象
    */
    rightLetters(arr, type) {
      let answer = "";
      if (type == "user") {
        let list = this.jsonToString(arr);
        if (list[0].answer) {
          //  连线题用户答案 目前考虑的仅为一对一情况
          list.forEach(item => {
            if (item.answer) {
              answer += item.id + ":" + this.letters[item.answer - 1] + "，";
            } else {
              answer += item.id + ":" + "，";
            }
          });
        } else {
          list.forEach(item => {
            answer += this.letters[item.id - 1] + "，";
          });
        }
      } else if (type == "answer") {
        let list = arr;
        if (list.left) {
          // 连线题
          list.left.forEach(item => {
            if (item.is_right)
              answer += item.id + ":" + this.letters[item.is_right - 1] + "，";
          });
        } else {
          list.forEach(item => {
            if (item.is_right == 1) {
              answer += this.letters[item.id - 1] + "，";
            }
          });
        }
      }
      answer = answer.substr(0, answer.length - 1);
      return answer;
    },
    /**
     * 倒计时
     */
    getTime() {
      if (this.stopTimeModel) this.stopTimeModel = false;
      this.sendTimer = setInterval(() => {
        if (
          this.time == this.packInfo.limit_time &&
          this.packInfo.limit_time > 0
        ) {
          // 2秒提示
          clearTimeout(this.sendTimer);
          this.sendTimer = null;
          this.$toast({
            message: "考试已结束，即将跳转考试成绩单！",
            duration: 2000,
            onClose: () => {
              this.examSubmit();
            }
          });
        } else {
          // 剩余五分钟提示
          if (
            this.packInfo.limit_time > 0 &&
            this.time + 300 == this.packInfo.limit_time
          ) {
            this.submitStatus = 4;
            this.visible = true;
            // 三秒自动隐藏提示框
            setTimeout(() => {
              if (this.submitStatus == 4 && this.visible == true) {
                this.visible = false;
              }
            }, 3000);
          }
          this.time++;
        }
      }, 1000);
    },
    /**
     * 时间暂停
     */
    stopTime() {
      clearTimeout(this.sendTimer);
      this.sendTimer = null;
      this.stopTimeModel = true;
      this.getDoneQuestion();
    },
    /**
     * 收藏题目
     */
    collect() {
      this.setCurrentIndex();
      if (this.questionList[this.nowIdx].collect_id) {
        this.$http
          .put(
            `/api/app/collect/cancel/${this.questionList[this.nowIdx].collect_id}/3`
          )
          .then(res => {
            this.questionList[this.nowIdx].collect_id = 0;
            this.$toast({
              message: "已取消",
              duration: 800
            });
          });
      } else {
        this.$http
          .post(`/api/app/collect`, {
            ques_id: this.questionList[this.nowIdx].id
              ? this.questionList[this.nowIdx].id
              : this.questionList[this.nowIdx].ques_id
              ? this.questionList[this.nowIdx].ques_id
              : this.id,
            type: 3
          })
          .then(res => {
            this.questionList[this.nowIdx].collect_id = res;
            this.$toast({
              message: "收藏成功",
              type: "success",
              duration: 800
            });
          });
      }
    },
    /**
     * 获取已做题目数量
     */
    getDoneQuestion() {
      this.done = this.$refs.question.getDoneNumber();
    },
    /**
     * 设置当前所做题目下标
     */
    setCurrentIndex() {
      this.nowIdx = this.$refs.question.getNowIdx();
    },
    /**
     *  String->JSON
     */
    jsonToString(aim) {
      if (typeof aim == "string") {
        return JSON.parse(aim);
      } else {
        return aim;
      }
    },
    /**
     * 页面onload执行方法
     */
    refreshPage() {
      if (this.report_id) {
        this.isAnalysis = true;
        if (this.type == "Point") {
          // 考点解析
          this.point = true;
          this.getPointAn();
        } else {
          // 套卷/考试解析
          this.getAnalysis();
        }
      } else {
        if (this.type == "Point") {
          // 考点做题
          this.point = true;
          this.examPoint();
        } else if (this.type == "Collect") {
          // 单题展示
          this.point = true;
          this.showBtn = false;
          this.isAnalysis = true;
          this.getCollect();
        } else {
          // 仿真/套卷做题
          this.requestExam();
        }
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.sendTimer);
    this.sendTimer = null;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.header {
  height: 89px;
  line-height: 88px;
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 88px;
    width: 100%;
    box-sizing: border-box;
    position: fixed;
    z-index: 9;
    background: #fff;
    border-bottom: 1px solid #f0f2f5;
  }
  .header_box {
    width: 100%;
    height: 100%;
  }
  .back {
    @extend %flex-center;
    width: 50px;
    height: 100%;
    padding-left: 20px;
    img {
      width: 18px;
      height: 32px;
    }
  }
  h3 {
    text-align: center;
    flex: 1;
    padding-right: 50px;
    box-sizing: border-box;
    font-size: 32px;
  }
  .h-title {
    display: flex;
    align-items: center;
    .q-time {
      display: flex;
      align-items: center;
      margin-right: 60px;
      img {
        width: 30px;
        height: 29px;
      }
      p {
        font-size: 30px;
        font-family: PingFang SC;
        font-weight: 300;
        color: rgba(89, 89, 89, 1);
        padding-left: 10px;
      }
    }
    i {
      height: 88px;
      width: 80px;
    }
    .q-card {
      background: url("~@/assets/images/question-card.png") no-repeat center
        center;
      background-size: 27px 27px;
    }
    .q-collect {
      background: url("~@/assets/images/collections_grey.png") no-repeat center
        center;
      background-size: 28px 27px;
    }
    .q-collect-active {
      background: url("~@/assets/theme-img/icon-star.png") no-repeat center
        center;
      background-size: 28px 27px;
    }
    .q-wrong {
      background: url("~@/assets/images/question-wrong.png") no-repeat center
        center;
      background-size: 26px 28px;
      width: 80px;
    }
  }
}
.exam-box {
  width: 100%;
  background-color: #fff;
  padding-bottom: 50px;
  overflow: hidden;
  .qc-part-info {
    padding: 20px 30px 40px;
    border-bottom: 1px solid #f0f2f5;
    & > div {
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      p {
        font-size: 28px;
        color: rgba(89, 89, 89, 1);
        font {
          font-size: 40px;
          color: #0097fa;
        }
      }
    }
    & > p {
      font-size: 24px;
      color: rgba(140, 140, 140, 1);
      line-height: 33px;
      padding-top: 10px;
    }
  }
  .no-section {
    padding-bottom: 10px;
  }
}

.submit-p {
  font-size: 30px;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(89, 89, 89, 1);
  line-height: 48px;
  text-align: center;
  padding: 60px;
}
.dialogs /deep/ .van-dialog__confirm.van-button {
  background: #fff;
  color: $theme_color;
}
.dialogs-other /deep/ .van-dialog__confirm.van-button {
  background: #fff;
  color: #b7b7b7;
}
.zanwu {
  font-size: 26px;
  color: #595959;
  line-height: 40px;
}
.submit {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background-color: $theme_color;
  border: none;
  text-align: center;
  font-size: 28px;
  color: #fff;
  line-height: 100px;
  outline: none;
}
</style>
