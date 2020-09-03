<template>
  <div class="question-index">
    <headers :title="title" :returnShow="false"></headers>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <section class="question-classify">
        <div v-for="(item,index) in classify" :key="index" @click="toPage(item.path)">
          <div>
            <img :src="item.img" />
          </div>
          <p>{{item.title}}</p>
        </div>
      </section>
      <section class="sim-list">
        <h1>近期模考</h1>
        <div class="sort">
          <span class="default" :class="{'active':sort==''}" @click="changeSort('')">默认排序</span>
          <span :class="{'active':sort!=''}" @click="changeSort(sort=='desc'?'asc':'desc')">
            <span style="margin-right:10px;">时间</span>
            <img src="@/assets/images/up@2x.png" v-if="sort=='asc'" />
            <img src="@/assets/images/down@2x.png" v-else-if="sort=='desc'" />
          </span>
          <div style="clear:both;"></div>
        </div>
        <List
          ref="list"
          url="/api/app/exam/testIndex"
          method="get"
          :params="{sort:sort}"
          :onGetdata="onGetdata"
          :showText="list.length>0"
        >
          <template slot="item">
            <div class="list" v-if="list.length>0">
              <ExamSimulationItem v-for="(item,index) in list" :key="index" :item="item"></ExamSimulationItem>
            </div>
            <div class="empty" v-else>
              <img src="@/assets/images/empty@2x.png" />
              <div>暂无模考安排，敬请期待</div>
            </div>
          </template>
        </List>
      </section>
    </van-pull-refresh>
  </div>
</template>

<script>
import headers from "@/components/Header";
import ExamSimulationItem from "../../components/ExamSimulationItem.vue";
import List from "../../components/List.vue";
export default {
  name: "question",
  components: {
    headers,
    ExamSimulationItem,
    List
  },
  data() {
    return {
      title: {
        name: "练习"
      },
      isLoading: false,
      classify: [
        {
          img: require("@/assets/images/exam-point.png"),
          title: "考点专练",
          path: "Point"
        },
        {
          img: require("@/assets/images/paper-package.png"),
          title: "套卷练习",
          path: "PaperPackage"
        },
        {
          img: require("@/assets/images/exam.png"),
          title: "仿真模考",
          path: "Exam"
        },
        {
          img: require("@/assets/images/wrong-test.png"),
          title: "错题练习",
          path: "ErrorQues"
        },
        {
          img: require("@/assets/images/assess.png"),
          title: "测评记录",
          path: "Assess"
        },
        {
          img: require("@/assets/images/question-collocet.png"),
          title: "习题收藏",
          path: "QuesCollect"
        }
      ],
      sort: "",
      list: []
    };
  },
  methods: {
    onRefresh() {
      this.$refs.list.reset();
      this.isLoading = false;
    },
    toPage(name) {
      this.$router.push({
        name
      });
    },
    onGetdata(list) {
      list.forEach(e => {
        if (e.is_start == 0) {
          e.start_status = 2;
        } else if (e.is_start == 1) {
          e.start_status = 1;
        } else if (e.is_start == 2) {
          e.start_status = 3;
        }
        e.have_done_count = e.answer_amount || 0;
      });
      this.list = list;
    },
    changeSort(sort) {
      this.sort = sort;
      this.$refs.list.reset();
    }
  },
  created() {
    if (this.$store.state.app) {
      this.$pub.appAction("homeTabVisibleChange", { visible: 1 });
    }
  },
  destroyed() {
    if (this.$store.state.app) {
      this.$pub.appAction("homeTabVisibleChange", { visible: 0 });
    }
  }
};
</script>

<style lang="scss" scoped>
.question-index {
  @extend %default-bg;
  padding-bottom: 130px;
  .question-classify {
    display: flex;
    flex-wrap: wrap;
    background: rgba(255, 255, 255, 1);
    border-radius: 10px;
    margin: 20px;
    padding: 10px 0;
    > div {
      padding-top: 20px;
      width: 25%;
      div {
        margin: 0 auto;
        width: 80px;
        height: 80px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 24px 0px rgba(10, 0, 24, 0.07);
        border-radius: 40px;
        @extend %flex-center;
        img {
          height: 32px;
          &:nth-child(1) {
            width: 34px;
          }
          &:nth-child(2) {
            width: 29px;
          }
          &:nth-child(3) {
            width: 36px;
          }
          &:nth-child(4) {
            width: 33px;
          }
          &:nth-child(5) {
            width: 35px;
          }
          &:nth-child(6) {
            width: 35px;
          }
        }
      }
      p {
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(89, 89, 89, 1);
        line-height: 70px;
        text-align: center;
      }
    }
  }
  .sim-list {
    background-color: white;
    padding: 28px 30px;
    color: #8c8c8c;
    h1 {
      font-size: 30px;
      margin-bottom: 29px;
    }
    .sort {
      font-size: 26px;
      margin-bottom: 45px;
      > span.active {
        color: $theme_color;
      }
      > span:first-child {
        float: left;
      }
      > span:nth-child(2) {
        float: right;
      }
    }
  }
  .empty {
    text-align: center;
    font-size: 24px;
    color: #8c8c8c;
    img {
      width: 176px;
      margin-bottom: 30px;
    }
  }
}
</style>
