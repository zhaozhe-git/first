<template>
  <div class="has-head-content exam-box">
    <!-- 头部 -->
    <div class="header">
      <header>
        <span class="back" @click="exit(0)">
          <img src="@/assets/images/return.png" />
        </span>
        <div class="h-title">
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
        <p>{{questionList[nowIdx].title}}</p>
        <p>
          <font>{{nowIdx+1}}</font>
          <span>/{{questionList.length}}</span>
        </p>
      </div>
    </section>
    <!-- 题目 -->
    <div class="question-box" id="question-box" v-if="!sheetVisible">
      <div class="item" v-if="questionList[nowIdx]">
        <div class="question">
          <div class="point">
            <span class="type">{{questionList[nowIdx].quesType}}</span>
            <span class="number" v-if="questionList[nowIdx].score">{{questionList[nowIdx].score}}分</span>
            <span class="idx">{{nowIdx+1}}、</span>
            <div style="display:inline;" v-html="questionList[nowIdx].ques_stem"></div>
          </div>
        </div>
        <div class="option-info">
          <van-checkbox-group
            v-model="questionList[nowIdx].user_answer"
            v-if="questionList[nowIdx].ques_type==2"
          >
            <van-checkbox
              :disabled="questionList[nowIdx].is_done"
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
                  <font>{{idx+1}})、</font>
                  <div class="msg" v-html="son.content"></div>
                </div>
                <div>
                  <p>答案：</p>
                  <van-radio-group v-model="questionList[nowIdx].user_answer[idx]">
                    <van-radio
                      :disabled="questionList[nowIdx].is_done"
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
              :disabled="questionList[nowIdx].is_done"
              :name="son.id"
              v-for="(son,idx) in questionList[nowIdx].ques_option"
              :key="son.id"
              @click="onDone"
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
        <div class="ques-btn">
          <van-button @click="prevQuestion" :class="{ 'ques-btn-disabel':nowIdx == 0}">上一题</van-button>
          <van-button
            v-if="(questionList[nowIdx].ques_type == 2 || questionList[nowIdx].ques_type == 4) && !questionList[nowIdx].is_done"
            @click="onDone"
          >确认</van-button>
          <van-button @click="nextQuestion">{{nowIdx+1 == questionList.length?'答题卡':'下一题'}}</van-button>
        </div>
        <div class="ques-btn pad10">
          <van-button class="remove" @click="isRemove">
            <img src="@/assets/images/error-remove.png" />
            <span>移除错题</span>
          </van-button>
          <van-button class="look" @click="questionList[nowIdx].open = !questionList[nowIdx].open">
            <img src="@/assets/images/error-answer.png" />
            <span>查看答案</span>
          </van-button>
        </div>
      </div>
    </div>
    <!-- 解析 -->
    <template>
      <div class="analysis-box" v-show="questionList[nowIdx].open">
        <div class="splite"></div>
        <div class="answer">
          <p>
            正确答案：
            <span v-if="questionList[nowIdx]">{{questionList[nowIdx].right_answer_letter}}</span>
          </p>
          <p>
            您的答案：
            <span
              v-if="questionList[nowIdx]"
              :class="{'rights':questionList[nowIdx].user_answer_letter == questionList[nowIdx].right_answer_letter}"
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
                <p>{{questionList[0].title}}</p>
                <p>
                  <span>{{activedNumber}}</span>
                  /{{questionList.length}}
                </p>
              </div>
              <div class="as-card">
                <div v-for="(item,index) in questionList" :key="index">
                  <p
                    class="number"
                    :class="item.is_right==1?'true':item.is_right==2?'false':''"
                    @click="scrollQuestion(index)"
                  >{{index+1}}</p>
                </div>
              </div>
            </div>
          </div>
          <button class="submit" type="button" @click="exit(1)">结束巩固</button>
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
  </div>
</template>

<script>
import { QuesType, CorrectType } from "@/util/enums";
export default {
  name: "ErrorList",
  data() {
    return {
      id: this.$route.query.id || -1,
      detach: this.$route.query.detach == 1 ? true : false,
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
      submitStatus: 1, // 1: 确认交卷，2: 题目未答完
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
        return "还有题目未做完，是否结束巩固？";
      } else if (this.submitStatus == 4) {
        return "确定要将本题移除错题吗？";
      } else if (this.submitStatus == 5) {
        return "是否结束巩固？";
      }
    }
  },
  created() {
    if (this.report_id) {
      this.getAnalysis();
    } else {
      this.Exam();
    }
  },
  methods: {
    /**
     * 返回上一页面
     * @param {Boolean} flag 退出提示
     * */

    exit(flag) {
      if (flag) {
        for (let i in this.questionList) {
          if (!this.questionList[i].is_done) {
            this.submitStatus = 3;
            this.visible = true;
            return;
          }
        }
        this.submitStatus = 5;
        this.visible = true;
      } else {
        this.$router.go(-1);
      }
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
    },
    // 下一题
    nextQuestion() {
      if (this.nowIdx >= this.questionList.length - 1) {
        this.openModel(1);
      } else {
        this.nowIdx++;
      }
    },
    //套卷练习
    Exam() {
      this.$http
        .get(
          `/api/app/myExam/errorRecord/${this.id}/${
            this.$route.query.time ? this.$route.query.time : -1
          }`
        )
        .then(res => {
          this.setQues(res);
        })
        .catch(res => console.log(res));
    },
    /**
     * 试题出来
     * */
    setQues(res) {
      let arr = res; //试题list
      for (let j = 0; j < arr.length; j++) {
        let quesType =
          arr[j].ques_type == 1
            ? "单选"
            : arr[j].ques_type == 2
            ? "多选"
            : arr[j].ques_type == 3
            ? "判断"
            : "连线";
        arr[j].quesType = quesType;
        arr[j].right_answer_letter = "";
        arr[j].right_answer_letter = this.rightLetters(
          arr[j].ques_option,
          "answer"
        );
        let point_arr = [];
        // arr[j].point_name = arr[j].point_name.replace(/\s+/g, "");
        if (arr[j].point_name) {
          point_arr = arr[j].point_name.split(",");
        }
        arr[j].point_name = point_arr;
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
        arr[j].is_done = false;
        arr[j].open = false;
      }
      this.questionList = arr;
    },
    /**
     * 单选选择后的处理/点击确定后的处理方案
     */
    onDone() {
      this.questionList[this.nowIdx].user_answer_letter = "";
      if (this.questionList[this.nowIdx].user_answer) {
        this.questionList[this.nowIdx].user_answer_letter = this.rightLetters(
          this.questionList[this.nowIdx].user_answer,
          "user"
        );
      }
      if (
        this.questionList[this.nowIdx].user_answer_letter ==
        this.questionList[this.nowIdx].right_answer_letter
      ) {
        this.questionList[this.nowIdx].is_right = 1;
        // 是否开启自动移除错题
        if (this.detach) {
          this.removeError();
        }
      } else if (this.questionList[this.nowIdx].user_answer_letter == "") {
        this.questionList[this.nowIdx].is_right = 3;
      } else {
        this.questionList[this.nowIdx].is_right = 2;
      }
      this.questionList[this.nowIdx].is_done = true;
      this.questionList[this.nowIdx].open = true;
    },
    /**
     * 提示框
     * */
    dialogOk() {
      if (this.submitStatus == 1 || this.submitStatus == 2) {
        this.examSubmit();
      } else if (this.submitStatus == 3 || this.submitStatus == 5) {
        this.$router.go(-1);
      } else if (this.submitStatus == 4) {
        this.removeError();
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
        let list = arr;
        if (this.questionList[this.nowIdx].ques_type == 4) {
          //  连线题用户答案 目前考虑的仅为一对一情况
          list.forEach((item, idx) => {
            if (item) {
              answer += idx + 1 + ":" + this.letters[item - 1] + "，";
            } else {
              answer += idx + 1 + ":" + "，";
            }
          });
        } else if (this.questionList[this.nowIdx].ques_type == 2) {
          // 多选
          list = list.sort();
          list.forEach(item => {
            answer += this.letters[item - 1] + "，";
          });
        } else {
          answer = this.letters[list - 1] + ",";
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
            ques_id: this.questionList[this.nowIdx].ques_id,
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
    isRemove() {
      this.submitStatus = 4;
      this.visible = true;
    },
    removeError() {
      this.$http
        .get(`/api/app/myExam/detach/${this.questionList[this.nowIdx].id}`)
        .then(res => {
          if (this.questionList.length == 1) {
            this.$router.go(-1);
            return;
          }
          this.questionList.splice(this.nowIdx, 1);
          if (this.nowIdx == this.questionList.length) {
            this.nowIdx = this.nowIdx - 1;
          }
        });
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
          ques_id: this.questionList[this.nowIdx].ques_id,
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
  mounted() {
    let _this = this;
    $(".question-box,.analysis-box").on("click", "img", function() {
      let src = $(this).attr("src");
      _this.$imgPreview([src]);
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "~@/css/question";
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
    padding: 10px 30px;
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
    .remove,
    .look {
      @extend %flex-center;
      img {
        width: 24px;
        height: 24px;
        margin-right: 10px;
      }
    }
    .look img {
      width: 20px;
    }
  }
  .pad10 {
    padding-top: 10px;
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
        .as-card {
          display: flex;
          flex-wrap: wrap;
          overflow-y: scroll;
          max-height: 75vh;
          & > div {
            width: 20%;
          }
        }
        .number {
          margin: 50px auto 0;
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
    .submit {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100px;
      background-color: $ques_color;
      border: none;
      text-align: center;
      font-size: 28px;
      color: #fff;
      line-height: 100px;
      outline: none;
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
  color: $ques_color;
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
