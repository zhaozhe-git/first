<template>
  <div
    class="item"
    :class="{'no-pass':item.have_done_count>0&&(item.pass_status==2||item.passed==0),'pass':item.have_done_count>0&&(item.pass_status==1||item.passed==1)}"
  >
    <img class="status-img" v-if="item.start_status==1" src="@/assets/images/exam-ing.png" />
    <img class="status-img" v-else-if="item.start_status==2" src="@/assets/images/exam-will.png" />
    <img class="status-img" v-else-if="item.start_status==3" src="@/assets/images/exam-finish.png" />
    <div class="detail">
      <div class="name">《{{item.exam_type==1?'模拟考试':'正式考试'}}》{{item.name}}</div>
      <div>
        <label>考试时间：</label>
        <span>{{item.start_time|fomartTime("MM/dd hh:mm:ss")}}~{{item.end_time|fomartTime("MM/dd hh:mm:ss")}}</span>
      </div>
      <div>
        <span>考试时长：</span>
        <span>{{item.limit_time/60}}分钟</span>
        <label>满分：</label>
        <span>{{parseFloat(item.score)}}分</span>
        <label>通过分数：</label>
        <span>{{parseFloat(item.pass_score)}}分</span>
      </div>
      <div>
        <label>考试次数：</label>
        <span>{{item.repeat_times}}（已考{{item.have_done_count||0}}次）</span>
        <span>共{{item.question_num}}道题</span>
      </div>
    </div>
    <div class="operate" v-if="item.start_status==3">
      <router-link :to="{name:'Ques',query:{type:'Exam',preview:'preview',id:item.id}}">查看详情</router-link>
    </div>
    <div class="operate not" v-else-if="item.start_status==2">
      <a class="not" @click="$toast('该场考试尚未开始')">即将开始</a>
    </div>
    <div class="operate" v-else-if="item.start_status==1">
      <router-link
        v-if="item.have_done_count==0"
        :to="{name:'Ques',query:{type:'Exam',id:item.id}}"
      >立即考试</router-link>
      <router-link
        v-if="item.have_done_count>0"
        :to="{name:'Result',query:{id:item.report_id,paper_id:item.id,type:'Exam'}}"
      >查看成绩</router-link>
      <router-link
        v-if="item.have_done_count>0&&item.have_done_count<item.repeat_times"
        :to="{name:'Ques',query:{type:'Exam',id:item.id}}"
      >再考一次</router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: "ExamSimulationItem",
  props: {
    item: {
      type: Object
    }
  }
};
</script>
<style lang="scss" scoped>
.item {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 16px 0px rgba(10, 0, 24, 0.08);
  border-radius: 10px;
  padding: 0 30px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  &:nth-child(3n) {
    margin-right: 0;
  }
  &.no-pass {
    background-repeat: no-repeat;
    background-size: 88px 71px;
    background-position: 558px 60px;
    background-image: url("~@/assets/images/exam-no-pass.png");
  }
  &.pass {
    background-repeat: no-repeat;
    background-size: 88px 71px;
    background-position: 558px 60px;
    background-image: url("~@/assets/images/exam-pass@3x.png");
  }
  .status-img {
    position: absolute;
    right: 0;
    top: 0;
    width: 72px;
  }
  .detail {
    padding-top: 16px;
    font-size: 24px;
    color: #8c8c8c;
    > div {
      margin-bottom: 17px;
      &:last-child {
        margin-bottom: 0;
      }
      &:nth-child(3) {
        label {
          margin-left: 60px;
        }
      }
    }
    .name {
      font-size: 28px;
      color: #262626;
      font-weight: bold;
      padding-top: 30px;
      margin-bottom: 48px;
      line-height: 40px;
    }
  }
  .line {
    height: 1px;
    background-color: #eeeeee;
  }
  .operate {
    text-align: right;
    padding: 30px 0;
    a {
      border: 1px solid $theme_color;
      color: $theme_color;
      width: 156px;
      height: 56px;
      border-radius: 28px;
      display: inline-block;
      text-align: center;
      line-height: 56px;
      font-size: 24px;
      cursor: pointer;
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
      &.not {
        border-color: #8c8c8c;
        color: #595959;
      }
    }
  }
}
</style>