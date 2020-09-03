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
          <i class="q-card" @click="openModel(1)"></i>
          <i
            class="q-collect"
            :class="{'q-collect-active': questionList[nowIdx].collect_id}"
            @click="collect"
          ></i>
          <i class="q-wrong" @click="openModel(0)"></i>
        </div>
      </header>
    </div>
    <!-- 试卷信息 -->
    <section class="qc-part-info">
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
    <div class="question-box" id="question-box" v-if="!sheetVisible">
      <div class="item" v-if="questionList[nowIdx]">
        <div class="question" v-html="questionList[nowIdx].ques_stem"></div>
        <div class="option-info">
          <van-checkbox-group
            v-model="questionList[nowIdx].user_answer"
            v-if="questionList[nowIdx].ques_type==2"
          >
            <van-checkbox
              :disabled="isAnalysis || preview"
              v-for="(son,idx) in questionList[nowIdx].ques_option"
              :name="son.id"
              :key="son.id"
              shape="square"
            >
              <div class="option-msg">
                <p class="letters">{{letters[idx]}}、</p>
                <div class="msg" v-html="son.content"></div>
              </div>
            </van-checkbox>
          </van-checkbox-group>
          <div class="line-ques" v-else-if="questionList[nowIdx].ques_type == 4">
            <ul class="left">
              <li v-for="(son,idx) in questionList[nowIdx].ques_option.left" :key="idx">
                <div class="line-title">
                  <font>{{letters[idx]}}、</font>
                  <div class="msg" v-html="son.content"></div>
                </div>
                <div>
                  <p>答案：</p>
                  <van-radio-group v-model="questionList[nowIdx].user_answer[idx]">
                    <van-radio
                      :disabled="isAnalysis || preview"
                      :name="sonR.id"
                      v-for="(sonR,idxR) in questionList[nowIdx].ques_option.right"
                      :key="idxR"
                    >
                      <div class="option-msg">
                        <p class="letters">{{letters[idxR]}}</p>
                      </div>
                    </van-radio>
                  </van-radio-group>
                </div>
              </li>
            </ul>
            <ul class="right">
              <li
                class="line-title"
                v-for="(sonR,idxR) in questionList[nowIdx].ques_option.right"
                :key="idxR"
              >
                <span class="choose-label">选项{{letters[idxR]}}</span>
                <div class="msg" v-html="sonR.content"></div>
              </li>
            </ul>
          </div>
          <van-radio-group v-model="questionList[nowIdx].user_answer" v-else>
            <van-radio
              :disabled="isAnalysis || preview"
              :name="son.id"
              v-for="(son,idx) in questionList[nowIdx].ques_option"
              :key="son.id"
            >
              <div class="option-msg">
                <p class="letters">{{letters[idx]}}、</p>
                <div class="msg" v-html="son.content"></div>
              </div>
            </van-radio>
          </van-radio-group>
        </div>
        <div class="ques-btn">
          <van-button @click="prevQuestion" :class="{ 'ques-btn-disabel':nowIdx == 0}">上一题</van-button>
          <van-button
            @click="nextQuestion"
            :class="{ 'ques-btn-disabel':nowIdx == questionList.length}"
          >下一题</van-button>
        </div>
      </div>
    </div>
    <!-- 解析 -->
    <template v-if="isAnalysis">
      <div class="analysis-box">
        <div class="splite"></div>
        <div class="answer">
          <p>
            正确答案：
            <span v-if="questionList[nowIdx]">{{questionList[nowIdx].right_answer_letter}}</span>
          </p>
          <p>
            您的答案：
            <span v-if="questionList[nowIdx]">{{questionList[nowIdx].user_answer_letter}}</span>
          </p>
        </div>
        <div class="an-point">
          <p>
            考点：
            <span class="zanwu" v-if="questionList[nowIdx].point_name.length == 0">暂无考点</span>
          </p>
          <div class="an-option">
            <p v-for="(point,poIdx) in questionList[nowIdx].point_name" :key="poIdx">{{point}}</p>
          </div>
        </div>
        <div class="analysis">
          <p class="label">解析：</p>
          <p class="zanwu" v-if="!questionList[nowIdx].ques_analysis">暂无解析</p>
          <div class="msg" v-if="questionList[nowIdx]" v-html="questionList[nowIdx].ques_analysis"></div>
        </div>
      </div>
      <div
        class="answer-state"
        :class="questionList[nowIdx].is_right==1?'true':questionList[nowIdx].is_right==2?'false':''"
      ></div>
    </template>
    <!-- 答题卡 -->
    <van-popup v-model="sheetVisible" position="right" :style="{ height: '100%',width: '100%' }">
      <div class="header">
        <header>
          <span class="back" @click="closeModel">
            <img src="@/assets/images/return.png" />
          </span>
          <h3>{{showCard ? "答题卡":"题目纠错反馈"}}</h3>
        </header>
      </div>
      <div class="sheet-box">
        <template v-if="showCard">
          <div class="answer-sheet">
            <div class="box">
              <div class="as-info">
                <p>
                  <font v-if="type=='Exam'">{{packInfo.report_type == 2 ? '《正式考试》':'《模拟考试》'}}</font>
                  {{packInfo.package_name}}
                </p>
                <p>
                  <span>{{activedNumber}}</span>
                  /{{questionList.length}}
                </p>
              </div>
              <section class="sec-info" v-for="(pItem, pIndex) in secInfo" :key="pIndex">
                <p>第{{num[pItem.idx]}}部分：{{pItem.section_name}} {{pItem.section_description}}（共{{pItem.section_question_num}}道题）</p>
                <div>
                  <div
                    v-for="(item,index) in questionList"
                    :key="index"
                    v-if="pItem.idx == item.idx"
                  >
                    <p
                      v-if="item.ques_type==2 && !isAnalysis"
                      class="number"
                      :class="item.user_answer.length?'active':''"
                      @click="scrollQuestion(index)"
                    >{{index+1}}</p>
                    <p
                      v-else-if="item.ques_type==4 && !isAnalysis"
                      class="number"
                      :class="typeof item.user_answer[0] == 'number'?'active':''"
                      @click="scrollQuestion(index)"
                    >{{index+1}}</p>
                    <p
                      v-else-if="(item.ques_type==3 || item.ques_type==1) &&!isAnalysis"
                      class="number"
                      :class="item.user_answer?'active':''"
                      @click="scrollQuestion(index)"
                    >{{index+1}}</p>
                    <p
                      v-else-if="isAnalysis"
                      class="number"
                      :class="item.is_right==1?'true':item.is_right==2?'false':''"
                      @click="scrollQuestion(index)"
                    >{{index+1}}</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
          <button
            v-if="!isAnalysis && !preview"
            class="submit"
            type="button"
            @click="sumitNotice"
          >交卷并查看结果</button>
        </template>
        <template v-else-if="showCorrection">
          <div class="correct-type">
            <p>纠错类型</p>
            <van-radio-group v-model="correct.type">
              <van-radio v-for="item in correctType" :key="item.key" :name="item.key">{{item.value}}</van-radio>
            </van-radio-group>
          </div>
          <div class="cor-splite"></div>
          <div class="correct-text">
            <textarea v-model="correct.error_msg" placeholder="请输入题目纠错信息，最多不超过500个字"></textarea>
          </div>
          <van-button class="correct-btn" @click="correctSubmit">提交</van-button>
        </template>
      </div>
    </van-popup>
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
        共有{{this.questionList.length}}道题，还有{{this.questionList.length - this.activedNumber}}道题没做
      </p>
    </van-dialog>
  </div>
</template>

<script>
import { CorrectType } from "../../util/enums";
export default {
  name: "Ques",
  data() {
    return {
      report_id: this.$route.query.report_id || 0, //解析
      id: this.$route.query.id || 1,
      type: this.$route.query.type || "Package", //类型
      preview: this.$route.query.preview ? true : false, //预览
      sheetVisible: false, // 展示答题卡
      nowIdx: 0, // 当前题目下标
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
        "10": "K",
        "11": "L",
        "12": "M",
        "13": "N",
        "14": "O",
        "15": "P",
        "16": "Q",
        "17": "R",
        "18": "S",
        "19": "T",
        "20": "U",
        "21": "V",
        "22": "W",
        "23": "X",
        "24": "Y",
        "25": "Z"
      }, // 字母表
      num: {
        "1": "一",
        "2": "二",
        "3": "三",
        "4": "四",
        "5": "五",
        "6": "六",
        "7": "七"
      },
      visible: false, // 弹窗是否展示
      stopTimeModel: false,
      submitStatus: 1, // 1: 确认交卷，2: 题目未答完
      analysisInfo: {}, // 考试解析信息
      secInfo: [],
      packInfo: {},
      showCard: false,
      showCorrection: false,
      correctType: CorrectType.getOptions(),
      correct: {
        type: "",
        error_msg: "",
        init: function() {
          this.type = "";
          this.error_msg = "";
        }
      }
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
    // 已做题目数量
    activedNumber() {
      var number = 0;
      if (this.questionList.length) {
        for (let value of this.questionList) {
          if (value.ques_type == 2) {
            if (value.user_answer.length) {
              number++;
            }
          } else if (value.ques_type == 4) {
            //   简单判断
            if (typeof value.user_answer[0] == "number") {
              number++;
            }
          } else {
            if (value.user_answer) {
              number++;
            }
          }
        }
      }
      return number;
    },
    // 交卷提示语句
    submitMsg() {
      if (this.submitStatus == 1) {
        return "确认交卷吗？";
      } else if (this.submitStatus == 2) {
        return (
          "您还有" +
          (this.questionList.length - this.activedNumber) +
          "道题未做，确认交卷吗？"
        );
      } else if (this.submitStatus == 3) {
        return "确定退出？退出后未完成的将不会保存，是否确定？";
      }
    },
    // 模块信息
    currentSection() {
      if (this.questionList.length && this.questionList[this.nowIdx].idx) {
        for (let i in this.secInfo) {
          if (this.secInfo[i].idx == this.questionList[this.nowIdx].idx)
            return this.secInfo[i];
        }
      } else {
        return "";
      }
    },
    typeUrl() {
      if (this.type == "Exam") return "simulation";
      if (this.type == "Package") return "practice";
    }
  },
  created() {
    if (this.report_id) {
      this.isAnalysis = true;
      this.getAnalysis();
    } else {
      this.getQues();
    }
  },
  methods: {
    // 返回上一页面
    exit() {
      this.submitStatus = 3;
      this.visible = true;
    },
    // 上一题
    prevQuestion() {
      if (this.nowIdx <= 0) {
        this.$toast({
          message: "当前已是第一题！",
          duration: 800
        });
      } else {
        this.nowIdx--;
      }
      if (!this.isAnalysis && !this.preview) {
        this.keepData();
      }
    },
    // 下一题
    nextQuestion() {
      if (this.nowIdx >= this.questionList.length - 1) {
        if (this.isAnalysis || this.preview) {
          this.$toast({
            message: "当前已是最后一题！",
            duration: 800
          });
          return;
        }
        this.openModel(1);
      } else {
        this.nowIdx++;
        if (!this.isAnalysis && !this.preview) {
          this.keepData();
        }
      }
    },
    // 获取题目
    getQues() {
      if (
        sessionStorage.ques &&
        this.id == JSON.parse(sessionStorage.ques).id
      ) {
        this.setData();
      } else {
        if (sessionStorage.ques) this.removeData();
        this.Exam();
      }
    },
    //套卷练习
    Exam() {
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
          this.keepData();
        })
        .catch(res => console.log(res));
    },
    // 解析
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
    // 试题处理
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
      for (let j = 0; j < arr.length; j++) {
        let quesType =
          arr[j].ques_type == 1
            ? "单选"
            : arr[j].ques_type == 2
            ? "多选"
            : arr[j].ques_type == 3
            ? "判断"
            : "连线";
        let quesTitle = `<div class="point"><span class="type">${quesType}</span><span class="number">${
          arr[j].score
        }分</span><span class="idx">${j + 1}、</span></div>`;
        arr[j].ques_stem = quesTitle + arr[j].ques_stem;
        if (this.isAnalysis) {
          arr[j].user_answer_letter = "";
          arr[j].right_answer_letter = "";
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
          let point_arr = [];
          arr[j].point_name = arr[j].point_name.replace(/\s+/g, "");
          if (arr[j].point_name) {
            point_arr = arr[j].point_name.split(",");
          }
          arr[j].point_name = point_arr;
          if (arr[j].ques_type == 2) {
            let user_answer = [];
            if (arr[j].user_answer) {
              let list = JSON.parse(arr[j].user_answer);
              list.forEach(option => {
                user_answer.push(option.id);
              });
            }
            arr[j].user_answer = user_answer;
          } else if (arr[j].ques_type == 4) {
            let user_answer = [];
            if (arr[j].user_answer) {
              let list = JSON.parse(arr[j].user_answer);
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
            let user_answer = "";
            if (arr[j].user_answer) {
              let list = JSON.parse(arr[j].user_answer);
              user_answer = list[0].id;
            }
            arr[j].user_answer = user_answer;
          }
        } else {
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
      this.secInfo = secInfo;
      this.questionList = arr;
    },
    dialogOk() {
      if (this.submitStatus == 1 || this.submitStatus == 2) {
        this.examSubmit();
      } else if (this.submitStatus == 3) {
        this.$router.go(-1);
      }
    },
    // 提交试题
    sumitNotice() {
      if (!this.visible) {
        if (this.questionList.length > this.activedNumber) {
          this.submitStatus = 2;
        } else {
          this.submitStatus = 1;
        }
        this.visible = true;
      }
    },
    examSubmit() {
      let params = {
        paper_id: this.id,
        report_time_long: this.packInfo.limit_time
          ? this.packInfo.limit_time - this.time
          : 0
      };
      let answer = {};
      for (let value of this.questionList) {
        // var obj = {};
        // obj.ques_id = value.id;
        if (
          typeof value.user_answer == "string" ||
          typeof value.user_answer == "number"
        ) {
          answer[value.id + ""] = { user_answer: [value.user_answer] };
        } else {
          if (value.ques_type == 4) {
            let ans = {};
            value.user_answer.forEach((opt, oIdx) => {
              if (opt.length == 0) {
                ans[oIdx + 1 + ""] = "";
              } else {
                ans[oIdx + 1 + ""] = opt;
              }
            });
            answer[value.id + ""] = { user_answer: ans };
          } else {
            answer[value.id + ""] = { user_answer: value.user_answer };
          }
        }
        answer[value.id + ""].report_type = value.ques_type;
      }
      params.question = JSON.stringify(answer);
      this.$http
        .post(`/api/app/exam/${this.typeUrl}/storeReport`, params)
        .then(res => {
          this.$router.replace({
            name: "Result",
            query: {
              id: res.report_id,
              paper_id: res.paper_id,
              type: this.type
            }
          });
        });
    },
    // 滚动到指定题目
    scrollQuestion(idx) {
      this.nowIdx = idx;
      this.closeModel();
    },
    /* 
    /* arr: 目标数组  type：对象
    */
    rightLetters(arr, type) {
      let answer = "";
      if (type == "user") {
        let list = JSON.parse(arr);
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
              answer += item.id + ":" + this.letters[item.is_right] + "，";
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
    // 倒计时
    getTime() {
      if (this.stopTimeModel) this.stopTimeModel = false;
      // if (!this.time) this.time = this.packInfo.limit_time;
      this.sendTimer = setInterval(() => {
        if (
          this.time >= this.packInfo.limit_time &&
          this.packInfo.limit_time > 0
        ) {
          this.examSubmit();
        } else {
          this.time++;
          sessionStorage.ques_time = this.time;
        }
      }, 1000);
    },
    // 暂停
    stopTime() {
      clearTimeout(this.sendTimer);
      this.sendTimer = null;
      this.stopTimeModel = true;
    },
    // 收藏
    collect() {
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
            ques_id: this.questionList[this.nowIdx].id,
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
    keepData() {
      let ques = {
        questionList: this.questionList,
        secInfo: this.secInfo,
        packInfo: this.packInfo,
        nowIdx: this.nowIdx,
        id: this.id
      };
      sessionStorage.ques = JSON.stringify(ques);
    },
    setData() {
      let ques = JSON.parse(sessionStorage.ques);
      this.questionList = ques.questionList;
      this.secInfo = ques.secInfo;
      this.packInfo = ques.packInfo;
      this.nowIdx = ques.nowIdx;
      if (!this.preview) {
        this.time = sessionStorage.ques_time;
        this.getTime();
      }
    },
    removeData() {
      sessionStorage.ques && sessionStorage.removeItem("ques");
      sessionStorage.ques_time && sessionStorage.removeItem("ques_time");
    },
    closeModel() {
      this.sheetVisible = false;
      this.showCard = false;
      this.showCorrection = false;
    },
    openModel(flag) {
      this.sheetVisible = true;
      if (flag) {
        this.showCard = true;
      } else {
        this.showCorrection = true;
      }
    },
    correctSubmit() {
      if (this.correct.type == 4 && this.correct.error_msg == "") {
        this.$toast("其他情况请填写原因");
        return;
      }
      this.$http
        .post(`/api/app/myExam/correction`, {
          ques_id: this.questionList[this.nowIdx].id,
          ...this.correct
        })
        .then(() => {
          this.$toast({
            message: "提交成功",
            type: "success",
            duration: 800,
            onClose: () => {
              this.closeModel();
              this.correct.init();
            }
          });
        });
    }
  },
  beforeDestroy() {
    clearInterval(this.sendTimer);
    this.sendTimer = null;
  },
  destroyed() {
    this.removeData();
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
      margin-right: 30px;
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
.exam-tab {
  position: relative;
  width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  background-color: #fff;
  border: 1px solid #e7e9e9;
  .message {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 75px;
    span {
      margin-right: 40px;
      font-size: 16px;
      color: #999;
    }
    .icon {
      display: block;
      margin: 0 10px 0 2px;
      width: 12px;
      height: 12px;
      border: 1px solid #b8b8b8;
      transform: rotate(45deg);
    }
  }
  .point {
    position: absolute;
    top: 0;
    right: 100px;
    padding: 0 15px 20px;
    // background: url("~@/assets/images/exam_show_point_bg.png") right bottom no-repeat;
    // background-size: 64px 24px;
    font-size: 60px;
    color: #c5160f;
    line-height: 60px;
  }
}
.exam-box {
  width: 100%;
  background-color: #fff;
  padding-bottom: 50px;
  overflow: hidden;
  .qc-part-info {
    padding: 10px 30px 30px;
    border-bottom: 1px solid #f0f2f5;
    & > div {
      line-height: 70px;
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
    }
  }
  .question-box {
    width: 100%;
    background-color: #fff;
    // &::-webkit-scrollbar {
    //   display: none;
    // }
    & /deep/ .video-wrap {
      position: relative;
      display: inline-block;
      video {
        width: 240px;
        height: 180px;
        background-color: #000;
        &::-webkit-media-controls {
          display: none !important;
        }
      }
      i {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 1101001;
        transform: translate(-50%, -50%);
        display: block;
        padding: 10%;
        width: 20%;
        background: url("~@/assets/images/icon_exam_video_pause.png") center
          no-repeat;
        background-size: 100% 100%;
        pointer-events: none;
      }
    }
    & /deep/ .audio-wrap {
      position: relative;
      display: inline-block;
      height: 30px;
      video {
        width: 100px;
        height: 30px;
        border-radius: 15px;
        background-color: $theme_color;
        outline: none;
        &::-webkit-media-controls {
          display: none !important;
        }
      }
      i {
        position: absolute;
        top: 5px;
        left: 10px;
        z-index: 1101001;
        display: block;
        width: 20px;
        height: 20px;
        background: url("~@/assets/images/icon_exam_wave.png") center no-repeat
          $theme_color;
        background-size: 100% 100%;
        pointer-events: none;
      }
      &::after {
        content: "";
        position: absolute;
        top: 5px;
        left: 10px;
        z-index: 11000;
        display: block;
        width: 20px;
        height: 20px;
        background: url("~@/assets/images/icon_exam_wave_active.png") center
          no-repeat;
        background-size: 100% 100%;
        pointer-events: none;
      }
    }
    .item {
      position: relative;
      width: 100%;
      padding: 40px 30px 0;
      box-sizing: border-box;
      .question {
        width: 100%;
        font-size: 30px;
        color: #333;
        line-height: 47px;
        // display: inline-flex;
        // flex-wrap: wrap;
        & /deep/ .point {
          display: inline;
          // justify-content: flex-start;
          // align-items: center;
          .type {
            display: inline-block;
            width: 80px;
            height: 35px;
            border-radius: 15px 0 15px 0;
            background-color: $theme_color;
            text-align: center;
            font-size: 22px;
            color: #fff;
            line-height: 35px;
          }
          .number {
            display: inline;
            margin: 0 10px;
            font-size: 24px;
            color: #999;
          }
          .idx {
            font-size: 30px;
            color: #333;
          }
        }
        /deep/ p {
          display: inline;
        }
        /deep/ img {
          max-width: 60px;
        }
      }
      .option-info {
        & /deep/ .van-radio {
          display: flex;
          margin: 40px 0;
          align-items: stretch;
          .van-radio__icon {
            width: 44px;
            height: 44px;
            .van-icon {
              width: 100%;
              height: 100%;
              background-color: #fff;
              border-color: #e6e6e6;
            }
          }
          .van-radio__icon--checked {
            .van-icon {
              position: relative;
              border-color: $theme_color;
              background-color: $theme_color;
              font-size: 30px;
              &:before {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                content: "\F0C7";
              }
            }
          }
          .van-radio__label {
            margin-left: 25px;
            font-size: 28px;
            color: #222;
            line-height: 28px;
            white-space: normal;
            .option-msg {
              display: flex;
              .letters {
                flex: none;
                line-height: 42px;
              }
              .msg {
                line-height: 42px;
              }
              img {
                width: 80px;
              }
            }
          }
        }
        & /deep/ .van-checkbox {
          display: flex;
          margin: 40px 0;
          .van-checkbox__icon {
            width: 40px;
            height: 40px;
            .van-icon {
              width: 100%;
              height: 100%;
              background-color: #fff;
              border-color: #e6e6e6;
              border-radius: 4px;
            }
          }
          .van-checkbox__icon--checked {
            .van-icon {
              position: relative;
              border-color: $theme_color;
              background-color: $theme_color;
              font-size: 30px;
              &:before {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                content: "\F0C7";
              }
            }
          }
          .van-checkbox__label {
            margin-left: 25px;
            font-size: 28px;
            color: #222;
            line-height: 28px;
            white-space: normal;
            .option-msg {
              display: flex;
              img {
                width: 80px;
              }
            }
          }
        }
        .line-ques {
          display: flex;
          justify-content: space-between;
          & > ul {
            width: 311px;
            li {
              padding: 12px 20px 16px;
              background: rgba(255, 255, 255, 1);
              border: 1px solid rgba(217, 217, 217, 1);
              border-radius: 10px;
              line-height: 32px;
              margin-top: 20px;
              & > div {
                display: flex;
                align-items: center;
                margin-top: 10px;
                & > p {
                  font-size: 24px;
                  color: #595959;
                  flex: none;
                }
                .van-radio-group {
                  display: flex;
                  flex-wrap: wrap;
                  .van-radio {
                    margin: 0;
                    align-items: center;
                    /deep/ .van-radio__icon {
                      width: 24px;
                      height: 24px;
                    }
                    /deep/ .van-radio__label {
                      font-size: 18px;
                      margin-left: 10px;
                      margin-right: 10px;
                    }
                  }
                }
              }
            }
            .line-title {
              font-size: 22px;
              font-family: PingFang SC;
              font-weight: 400;
              color: rgba(89, 89, 89, 1);
              .choose-label {
                display: inline-block;
                width: 70px;
                height: 27px;
                background: rgba(255, 255, 255, 1);
                border: 1px solid rgba(0, 151, 250, 1);
                border-radius: 4px;
                font-size: 16px;
                font-family: PingFang SC;
                font-weight: 400;
                color: rgba(0, 151, 250, 1);
                line-height: 27px;
                text-align: center;
                margin-right: 10px;
              }
            }
            .msg {
              display: inline;
              /deep/ p {
                display: inline;
              }
              /deep/ img {
                max-width: 60px;
              }
            }
          }
        }
      }
      .false {
        // background: url("~@/assets/images/icon_exam_false.png") center no-repeat;
        // background-size: 32px 32px;
      }
      .true {
        // background: url("~@/assets/images/icon_exam_true.png") center no-repeat;
        // background-size: 32px 32px;
      }
    }
  }
  .analysis-box {
    margin-top: 50px;
    .splite {
      height: 10px;
      background: #f0f2f5;
      width: 100%;
    }
    .answer {
      display: flex;
      width: 100%;
      padding: 0 30px;
      p {
        width: 50%;
        padding: 20px 0;
        line-height: 60px;
        margin-right: 60px;
        font-size: 28px;
        color: #666;
        &:nth-child(1) span {
          color: #22bfa7;
        }
        &:nth-child(2) span {
          color: #ff4157;
        }
      }
    }
    .an-point {
      padding: 30px 30px 0;
      & > p {
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(140, 140, 140, 1);
        line-height: 60px;
      }
      .an-option {
        display: flex;
        p {
          margin-right: 30px;
          margin-bottom: 30px;
          line-height: 48px;
          padding: 0 24px;
          height: 48px;
          background: linear-gradient(
            30deg,
            rgba(0, 151, 250, 1),
            rgba(0, 150, 249, 1)
          );
          border-radius: 24px;
          font-size: 24px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
        }
      }
    }
    .analysis {
      margin-top: 30px;
      padding: 0 30px;
      overflow: hidden;
      .label {
        float: left;
        width: 90px;
        font-size: 28px;
        color: #666;
        line-height: 36px;
      }
      .msg {
        margin-left: 100px;
        width: auto;
        font-size: 28px;
        color: #222;
        line-height: 36px;
      }
    }
  }
  .answer-state {
    position: absolute;
    top: 140px;
    left: 0;
    width: 32px;
    height: 32px;
  }
  .ques-btn {
    display: flex;
    justify-content: space-between;
    padding: 50px 0 20px;
    button {
      width: 181px;
      height: 65px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(217, 217, 217, 1);
      border-radius: 10px;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(89, 89, 89, 1);
      line-height: 65px;
    }
    button.ques-btn-disabel {
      background: rgba(245, 245, 245, 1);
      border: none;
      color: rgba(183, 183, 183, 1);
    }
  }
  .sheet-box {
    width: 100%;
    .answer-sheet {
      overflow: hidden;
      .box {
        background-color: #fff;
        box-sizing: border-box;
        .as-info {
          display: flex;
          justify-content: space-between;
          height: 80px;
          border-bottom: 1px solid #eaeaea;
          padding: 0 20px;
          p {
            line-height: 80px;
            font-size: 28px;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(89, 89, 89, 1);
            span {
              font-size: 40px;
              color: #0097fa;
            }
          }
        }
        .sec-info {
          & > p {
            font-size: 28px;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(89, 89, 89, 1);
            padding: 30px 20px;
          }
          & > div {
            display: flex;
            flex-wrap: wrap;
            div {
              width: 20%;
            }
          }
        }
        .number {
          margin: 0 auto;
          width: 80px;
          height: 80px;
          border: 1px solid #eaeaea;
          border-radius: 50%;
          text-align: center;
          font-size: 30px;
          color: #b8b8b8;
          line-height: 78px;
          cursor: pointer;
          flex-shrink: 0;
        }
        .active {
          background-color: $theme_color;
          border: 1px solid $theme_color;
          color: #fff;
        }
        .true {
          background-color: #47ad76;
          border: 1px solid #47ad76;
          color: #fff;
        }
        .false {
          background-color: #f06000;
          border: 1px solid #f06000;
          color: #fff;
        }
      }
    }
    .submit {
      position: fixed;
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
    .answer-status {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      margin-top: 20px;
      padding: 0 10px;
      background-color: #fff;
      border: 1px solid #eaecec;
      border-radius: 5px;
      p {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 14px;
        color: #333;
        span {
          display: block;
          width: 14px;
          height: 14px;
          margin-right: 5px;
          border: 1px solid #e8e8e8;
          border-radius: 2px;
        }
      }
      .true {
        span {
          border: 1px solid #47ad76;
          background-color: #47ad76;
        }
      }
      .false {
        span {
          border: 1px solid #f06000;
          background-color: #f06000;
        }
      }
    }
    .correct-type {
      padding: 0 30px;
      & > p {
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(140, 140, 140, 1);
        line-height: 60px;
        padding-top: 20px;
      }
      /deep/ .van-radio-group {
        display: flex;
        flex-wrap: wrap;
        .van-radio {
          margin-right: 55px;
          height: 80px;
        }
        .van-radio__icon {
          line-height: 30px;
          height: auto;
          margin-right: 4px;
        }
        .van-radio__label {
          font-size: 28px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(89, 89, 89, 1);
        }
      }
    }
    .cor-splite {
      height: 20px;
      background: rgba(240, 242, 245, 1);
    }
    .correct-text {
      padding: 26px 30px;
      textarea {
        width: 100%;
        height: 374px;
        border: 1px solid rgba(217, 217, 217, 1);
        border-radius: 10px;
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 40px;
        padding: 20px;
        box-sizing: border-box;
      }
    }
    .correct-btn {
      position: absolute;
      bottom: 80px;
      left: 30px;
      width: 690px;
      height: 88px;
      border: 1px solid $theme_color;
      font-size: 34px;
      font-family: PingFang SC;
      font-weight: 400;
      color: $theme_color;
      text-align: center;
      line-height: 88px;
      border-radius: 5px;
    }
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
</style>
