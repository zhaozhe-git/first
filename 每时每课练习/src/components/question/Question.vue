<template>
  <div class="question-pack">
    <!-- 题目 -->
    <div class="question-box" id="question-box">
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
              @click.stop
            >
              <img
                slot="icon"
                slot-scope="props"
                :src="props.checked ? check_icon.active : check_icon.inactive"
              />
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
                      @click.stop
                    >
                      <img
                        slot="icon"
                        slot-scope="props"
                        :src="props.checked ? line_icon.active : line_icon.inactive"
                      />
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
              @click.stop
            >
              <img
                slot="icon"
                slot-scope="props"
                :src="props.checked ? radio_icon.active : radio_icon.inactive"
              />
              <div class="option-msg">
                <p class="letters">{{letters[idx]}}、</p>
                <div class="msg" v-html="son.content"></div>
              </div>
            </van-radio>
          </van-radio-group>
        </div>
        <div class="ques-btn" v-show="showBtn">
          <van-button @click="prevQuestion" :class="{ 'ques-btn-disabel':nowIdx == 0}">上一题</van-button>
          <van-button @click="nextQuestion">{{nowIdx+1 == questionList.length?'答题卡':'下一题'}}</van-button>
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
          <p v-if="$route.query.type != 'Collect'">
            您的答案：
            <span
              :class="{'rights':questionList[nowIdx].user_answer_letter == questionList[nowIdx].right_answer_letter}"
              v-if="questionList[nowIdx]"
            >{{questionList[nowIdx].user_answer_letter}}</span>
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
    <!-- 反馈 -->
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
              <template v-if="point">
                <answer class="point-card" :list="questionList" :mode="mode" @setIndex="setNowIdx"></answer>
              </template>
              <template v-else>
                <section class="sec-info" v-for="(pItem, pIndex) in answercard" :key="pIndex">
                  <p>第{{num[pItem.idx]}}部分：{{pItem.section_name}} {{pItem.section_description}}（共{{pItem.section_question_num}}道题）</p>
                  <answer :list="pItem.child" :mode="mode" @setIndex="setNowIdx"></answer>
                </section>
              </template>
            </div>
          </div>
          <slot name="subBtn"></slot>
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
  </div>
</template>

<script>
import answer from "./QuestionAnswer";
import { CorrectType } from "../../util/enums";
export default {
  name: "QuestionPack",
  components: {
    answer
  },
  props: {
    // 题目列表
    questions: {
      type: Array,
      default() {
        return [];
      }
    },
    // 解析
    isAnalysis: {
      type: Boolean,
      default: false
    },
    // 试卷信息
    packInfo: {
      type: Object
    },
    // 模块信息
    secInfo: {
      type: Array,
      default() {
        return [];
      }
    },
    setCurrentIndex: {
      type: Function
    },
    showBtn: {
      type: Boolean,
      default: true
    },
    point: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    questionList() {
      return this.questions;
    },
    // 已做题数
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
    // 答题卡
    answercard() {
      // 套卷 仿真
      if (this.secInfo.length > 0) {
        this.secInfo.forEach(item => {
          item.child = [];
          for (let i in this.questionList) {
            let it = this.questionList[i];
            if (it.idx == item.idx) {
              item.child.push(it);
            } else {
              if (item.child.length > 0) {
                break;
              } else {
                continue;
              }
            }
          }
        });
        return this.secInfo;
      } else {
        // 考点
        return this.questionList;
      }
    },
    // 答题卡模式
    mode() {
      if (this.isAnalysis) {
        return 2;
      } else {
        return 1;
      }
    }
  },
  data() {
    return {
      nowIdx: 0,
      sheetVisible: false,
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
      },
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
      preview: this.$route.query.preview ? true : false, //预览
      type: this.$route.query.type || "Package", //类型
      radio_icon: {
        active: require("@/assets/images/question-radio-hover.png"),
        inactive: require("@/assets/images/question-raido.png")
      },
      check_icon: {
        active: require("@/assets/images/question-checkbox-hover.png"),
        inactive: require("@/assets/images/question-checkbox.png")
      },
      line_icon: {
        active: require("@/assets/images/question-checked.png"),
        inactive: require("@/assets/images/question-uncheck.png")
      }
    };
  },
  methods: {
    // 上一题
    prevQuestion() {
      if (this.nowIdx <= 0) {
        this.$toast({
          message: "当前已是第一题！",
          duration: 800
        });
      } else {
        this.nowIdx--;
        this.setCurrentIndex();
      }
    },
    // 下一题
    nextQuestion() {
      if (this.nowIdx >= this.questionList.length - 1) {
        this.openModel(1);
      } else {
        this.nowIdx++;
        this.setCurrentIndex();
      }
    },
    closeModel() {
      this.sheetVisible = false;
      this.showCard = false;
      this.showCorrection = false;
    },
    /**
     *  1 答题卡、0反馈
     *  */
    openModel(flag) {
      this.sheetVisible = true;
      if (flag) {
        this.showCard = true;
      } else {
        this.showCorrection = true;
      }
    },
    // 反馈
    correctSubmit() {
      if (this.correct.type == 4 && this.correct.error_msg == "") {
        this.$toast("其他情况请填写原因");
        return;
      }
      this.$http
        .post(`/api/app/myExam/correction`, {
          ques_id: this.questionList[this.nowIdx].id
            ? this.questionList[this.nowIdx].id
            : this.questionList[this.nowIdx].ques_id
            ? this.questionList[this.nowIdx].ques_id
            : this.$route.query.id,
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
    },
    // 获取用户做题答案
    getAnswer() {
      let answer = {};
      for (let value of this.questionList) {
        if (
          typeof value.user_answer == "string" ||
          typeof value.user_answer == "number"
        ) {
          // 单选和判断
          if (value.user_answer) {
            answer[value.id + ""] = { user_answer: [value.user_answer] };
          } else {
            if (this.$route.query.number != 0) {
              answer[value.id + ""] = { user_answer: [] };
            }
          }
        } else {
          // 连线
          if (value.ques_type == 4) {
            let ans = {};
            value.user_answer.forEach((opt, oIdx) => {
              if (opt.length == 0) {
                ans[oIdx + 1 + ""] = "";
              } else {
                ans[oIdx + 1 + ""] = opt;
              }
            });
            let no_anwser = 0;
            for (let i in ans) {
              if (ans[i]) {
                no_anwser = 1;
                break;
              }
            }
            if (no_anwser) {
              answer[value.id + ""] = { user_answer: ans };
            } else {
              if (this.$route.query.number != 0) {
                answer[value.id + ""] = { user_answer: [] };
              }
            }
          } else {
            // 多选题
            let user_an = value.user_answer.sort();
            if (this.$route.query.number != 0) {
              answer[value.id + ""] = { user_answer: user_an };
            } else {
              // 考点顺序做题需要过滤未做的题目
              if (value.user_answer.length > 0) {
                answer[value.id + ""] = { user_answer: user_an };
              }
            }
          }
        }
        if (answer[value.id + ""]) {
          answer[value.id + ""].report_type = value.ques_type;
        }
      }
      return JSON.stringify(answer);
    },
    setNowIdx(index) {
      this.nowIdx = index;
      this.setCurrentIndex();
      this.closeModel();
    },
    getNowIdx() {
      return this.nowIdx;
    },
    getDoneNumber() {
      return this.activedNumber;
    }
  },
  mounted() {
    let _this = this;
    $(".question-box,.analysis-box").on("click", "img", function() {
      let src = $(this).attr("src");
      _this.$imgPreview([src]);
    });
  }
};
</script>

<style lang='scss' scoped>
@import "~@/css/question";
.point-card {
  margin-top: 30px;
}
.sheet-box {
  width: 100%;
  min-height: calc(100% - 90px);
  position: relative;
  .answer-sheet {
    overflow: hidden;
    padding-bottom: 100px;
    .box {
      background-color: #fff;
      box-sizing: border-box;
      .as-info {
        display: flex;
        justify-content: space-between;
        min-height: 50px;
        border-bottom: 1px solid #eaeaea;
        padding: 15px 20px;
        p {
          line-height: 50px;
          font-size: 28px;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(89, 89, 89, 1);
          min-width: 100px;
          span {
            font-size: 40px;
            color: #0097fa;
          }
          &:nth-child(2) {
            text-align: right;
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
          line-height: 36px;
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
        background-color: $ques_color;
        border: 1px solid $ques_color;
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
  button:active {
    background: $ques_color;
    color: #fff;
    border: none;
  }
}
</style>
