<template>
  <div class="paper-package">
    <headers :title="title" @toGet="goSearh">
      <template slot="right-sum">
        <img class="search" src="@/assets/images/search.png" alt />
      </template>
    </headers>
    <div class="course-fitler">
      <van-dropdown-menu :active-color="$theme_color">
        <van-dropdown-item title="考试类型" ref="exam_type">
          <ul class="course-sort">
            <li
              :class="searchParams.exam_type == item.key ? 'active':''"
              v-for="item in exam_type"
              :key="item.key"
              @click="selectType('exam_type',item.key)"
            >{{item.value}}</li>
          </ul>
        </van-dropdown-item>
        <van-dropdown-item title="考试状态" ref="start_status">
          <ul class="course-sort">
            <li
              :class="searchParams.start_status == item.key ? 'active':''"
              v-for="item in start_status"
              :key="item.key"
              @click="selectType('start_status',item.key)"
            >{{item.value}}</li>
          </ul>
        </van-dropdown-item>
        <van-dropdown-item title="参考状态" ref="done_status">
          <ul class="course-sort">
            <li
              :class="searchParams.done_status == item.key ? 'active':''"
              v-for="item in state"
              :key="item.key"
              @click="selectType('done_status',item.key)"
            >{{item.value}}</li>
          </ul>
        </van-dropdown-item>
      </van-dropdown-menu>
    </div>
    <p v-if="searchParams.name" class="oto-title">"{{searchParams.name}}"搜索结果</p>
    <List
      ref="list"
      url="/api/app/exam/packageSimulation"
      :onGetdata="getList"
      :params="searchParams"
      :onFormatter="onFormatter"
      :showText="list.length>0"
      method="get"
    >
      <Card slot="item" :list="list" comType="Exam" :examType="searchParams.exam_type"></Card>
    </List>
  </div>
</template>

<script>
import headers from "@/components/Header";
import List from "@/components/List";
import Card from "./QuestionCard";
export default {
  name: "Exam",
  components: {
    headers,
    List,
    Card
  },
  data() {
    return {
      title: {
        name: "仿真模考",
        backUrl: "Practise"
      },
      state: [
        { key: "0", value: "全部" },
        { key: "1", value: "已做" },
        { key: "2", value: "未做" }
      ],
      start_status: [
        { key: "0", value: "全部" },
        { key: "2", value: "未开始" },
        { key: "1", value: "进行中" },
        { key: "3", value: "已结束" }
      ],
      exam_type: [
        { key: "0", value: "全部" },
        { key: "1", value: "模拟考试" },
        { key: "2", value: "正式考试" }
      ],
      searchParams: {
        exam_type: 0,
        done_status: 0,
        start_status: 0,
        name: "",
        init: function() {
          this.done_status = 0;
          this.start_status = 0;
          this.exam_type = 0;
        }
      },
      list: [],
      firstIn: 0
    };
  },
  methods: {
    onFormatter(row) {
      row.forEach(item => {
        item.limit_time = parseInt(item.limit_time / 60) + "分钟";
        if (item.limit_time % 60) {
          item.limit_time = item.limit_time + (item.limit_time % 60) + "秒";
        }
      });
    },
    goSearh() {
      this.$router.push({
        name: "Search",
        query: {
          name: "Exam"
        }
      });
    },
    selectType(name, val) {
      this.$refs[name].toggle();
      this.searchParams[name] = val;
      this.clearName();
      this.$refs.list.reset();
    },
    getList(list) {
      this.list = list;
    },
    clearName() {
      if (this.searchParams.name) {
        this.searchParams.name = "";
      }
    }
  },
  activated() {
    if (!this.firstIn) {
      this.firstIn = 1;
      return;
    }
    if (this.$store.state.keywords) {
      this.searchParams.init();
      this.searchParams.name = this.$store.state.keywords;
      this.$store.commit("OTO_KEY");
    } else {
      this.clearName();
    }
    this.$refs.list.reset();
  }
};
</script>

<style lang='scss' scoped>
.paper-package {
  .search {
    width: 38px;
    height: 40px;
    margin-top: 20px;
  }
  .oto-title {
    font-size: 28px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(140, 140, 140, 1);
    padding-top: 30px;
    padding-left: 20px;
  }
}
</style>
