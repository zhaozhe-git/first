<template>
  <div class="paper-package">
    <headers :title="title" @toGet="goSearh">
      <template slot="right-sum">
        <img class="search" src="@/assets/images/search.png" alt />
      </template>
    </headers>
    <div class="course-fitler">
      <van-dropdown-menu :active-color="$theme_color">
        <van-dropdown-item title="套卷分类" ref="classify_id">
          <van-tree-select
            :items="items"
            :main-active-index="mainActiveIndex"
            :active-id="activeId"
            @click-nav="onClickNav"
            @click-item="onClickItem"
          />
        </van-dropdown-item>
        <van-dropdown-item title="套卷状态" ref="done_status">
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
      url="/api/app/exam/packagePractice"
      :onGetdata="getList"
      :params="searchParams"
      :onFormatter="onFormatter"
      :showText="list.length>0"
      method="get"
    >
      <Card slot="item" :list="list"></Card>
    </List>
  </div>
</template>

<script>
import headers from "@/components/Header";
import List from "@/components/List";
import Card from "./QuestionCard";
export default {
  name: "PaperPackage",
  components: {
    headers,
    List,
    Card
  },
  data() {
    return {
      title: {
        name: "套卷练习",
        backUrl: "Practise"
      },
      state: [
        { key: "0", value: "全部" },
        { key: "1", value: "已做" },
        { key: "2", value: "未做" }
      ],
      searchParams: {
        done_status: 0,
        classify_id: 0,
        name: "",
        init: function() {
          this.done_status = 0;
          this.classify_id = 0;
        }
      },
      list: [],
      items: [],
      mainActiveIndex: 0,
      // 被选中元素的id
      activeId: "",
      firstIn: 0
    };
  },
  methods: {
    onFormatter(row) {
      row.forEach(item => {
        if (item.limit_time == -1) {
          item.limit_time = "无限制";
        } else {
          item.limit_time = parseInt(item.limit_time / 60) + "分钟";
          if (item.limit_time % 60) {
            item.limit_time = item.limit_time + (item.limit_time % 60) + "秒";
          }
        }
      });
    },
    goSearh() {
      this.$router.push({
        name: "Search",
        query: {
          name: "PaperPackage"
        }
      });
    },
    selectType(name, val) {
      this.$refs[name].toggle();
      this.searchParams[name] = val;
      this.clearName();
      this.$refs.list.reset();
    },
    onClickNav(index) {
      this.mainActiveIndex = index;
      if (!this.items[index].children) {
        this.selectType("classify_id", this.items[index].id);
      }
    },
    onClickItem(data) {
      this.activeId = data.id;
      this.selectType("classify_id", data.id);
    },
    getList(list) {
      this.list = list;
    },
    getClassify() {
      this.$http.get(`/api/app/exam/classify`).then(res => {
        res.rows.forEach(item => {
          item.text = item.label;
          item.children &&
            item.children.forEach(it => {
              it.text = it.label;
            });
        });
        res.rows.unshift({
          text: "全部",
          id: ""
        });
        this.items = res.rows;
      });
    },
    clearName() {
      if (this.searchParams.name) {
        this.searchParams.name = "";
      }
    }
  },
  created() {
    this.getClassify();
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
  .van-tree-select__nav {
    flex: 2;
  }
  .van-tree-select__content {
    flex: 3;
  }
}
</style>
