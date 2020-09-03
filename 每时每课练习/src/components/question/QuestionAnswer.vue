<template>
  <div class="answer-component">
    <div v-for="(item,index) in list" :key="index">
      <p
        v-if="item.ques_type==2 && mode==1"
        class="number"
        :class="item.user_answer.length?'active':''"
        @click="setIndex(item.ques_num-1)"
      >{{item.ques_num}}</p>
      <p
        v-else-if="item.ques_type==4 && mode==1"
        class="number"
        :class="typeof item.user_answer[0] == 'number'?'active':''"
        @click="setIndex(item.ques_num-1)"
      >{{item.ques_num}}</p>
      <p
        v-else-if="(item.ques_type==3 || item.ques_type==1) && mode == 1"
        class="number"
        :class="item.user_answer?'active':''"
        @click="setIndex(item.ques_num-1)"
      >{{item.ques_num}}</p>
      <p
        v-else-if="mode == 2"
        class="number"
        :class="item.is_right==1?'true':item.is_right==2?'false':''"
        @click="setIndex(item.ques_num-1)"
      >{{item.ques_num}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "answer",
  props: {
    list: {
      type: Array
    },
    mode: {
      default: 1 // 1 做题 2解析
    }
  },
  data() {
    return {};
  },
  methods: {
    setIndex(index) {
      this.$emit("setIndex", index);
    }
  }
};
</script>

<style lang="scss" scoped>
.answer-component {
  display: flex;
  flex-wrap: wrap;
  div {
    width: 20%;
    margin-bottom: 30px;
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
</style>
