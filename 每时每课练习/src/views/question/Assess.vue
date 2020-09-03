<template>
  <div class="paper-package">
    <headers :title="title" @toGet="goSearh">
      <template slot="right-sum">
        <img class="search" src="@/assets/images/search.png" alt />
      </template>
    </headers>
    <div class="course-fitler">
      <van-dropdown-menu :active-color="$theme_color">
        <van-dropdown-item title="类型不限" ref="type">
          <ul class="course-sort">
            <li
              :class="searchParams.type == item.key ? 'active':''"
              v-for="item in type"
              :key="item.key"
              @click="selectType('type',item.key)"
            >{{item.value}}</li>
          </ul>
        </van-dropdown-item>
        <van-dropdown-item title="时间" ref="search_type">
          <ul class="course-sort">
            <li
              :class="searchParams.search_type == item.key ? 'active':''"
              v-for="item in search_type"
              :key="item.key"
              @click="selectType('search_type',item.key)"
            >{{item.value}}</li>
          </ul>
        </van-dropdown-item>
      </van-dropdown-menu>
    </div>
    <p v-if="searchParams.name" class="oto-title">"{{searchParams.name}}"搜索结果</p>
    <List
      ref="list"
      url="/api/app/examStatistics/detail"
      :onGetdata="getList"
      :params="searchParams"
      :onFormatter="onFormatter"
      :showText="list.length>0"
      method="get"
    >
      <Card slot="item" :list="list" comType="Assess"></Card>
    </List>
  </div>
</template>

<script>
import headers from "@/components/Header";
import List from "@/components/List";
import Card from "./QuestionCard";
export default {
  name: "Assess",
  components: {
    headers,
    List,
    Card
  },
  data() {
    return {
      title: {
        name: "测评记录",
        backUrl: "Practise"
      },
      type: [
        { key: "all", value: "全部" },
        { key: "practice", value: "套卷练习" },
        { key: "simulation", value: "仿真模考" },
        { key: "point", value: "考点专练" }
      ],
      search_type: [
        { key: "all", value: "全部" },
        { key: "today", value: "今天" },
        { key: "week", value: "7天" }
      ],
      searchParams: {
        type: "all",
        search_type: "all",
        name: "",
        init: function() {
          this.search_type = "all";
        }
      },
      list: [],
      firstIn: 0
    };
  },
  methods: {
    onFormatter(row) {
      row.forEach(item => {
        if (item.limit_time) {
          if (item.limit_time % 60) {
            item.limit_time =
              parseInt(item.limit_time / 60) +
              "分" +
              (item.limit_time % 60) +
              "秒";
          } else {
            item.limit_time = parseInt(item.limit_time / 60) + "分钟";
          }
        } else if (item.report_time_long) {
          if (item.report_time_long % 60) {
            item.report_time_long =
              parseInt(item.report_time_long / 60) +
              "分" +
              (item.report_time_long % 60) +
              "秒";
          } else {
            item.report_time_long =
              parseInt(item.report_time_long / 60) + "分钟";
          }
        }
        if (item.package_end_time) {
          let nowTime = Date.parse(new Date());
          if (item.package_end_time * 1000 < nowTime) {
            //已结束
            item.is_useful = 3;
          } else if (item.package_start_time * 1000 > nowTime) {
            //未开始
            item.is_useful = 2;
          } else {
            // 进心中
            item.is_useful = 1;
          }
        }
      });
    },
    goSearh() {
      this.$router.push({
        name: "Search",
        query: {
          name: "Assess"
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
