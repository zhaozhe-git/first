<template>
  <div class="search-info">
    <header class="search-header">
      <span @click="goBack">
        <img src="../../assets/images/return.png" alt />
      </span>
      <span>
        <input
          class="input"
          v-model="input"
          placeholder="请输入内容"
          @focus="emptybool=false;searchbool=false"
        />
      </span>
      <span @click="goBack" v-if="input==''">取消</span>
      <span @click="gotosearch" v-if="input!=''" style="color: #000">搜索</span>
      <!-- <span @click="gotosearch" style="color: #000">搜索</span> -->
    </header>
    <!-- 历史搜索 -->
    <section class="history-search" v-if="input==''">
      <header class="his-header">
        <p>
          <span>历史搜索</span>
          <span>
            <i @click="empty_his"></i>
          </span>
        </p>
      </header>
      <div class="list">
        <span v-for="(item,index) in input_history" :key="index" @click="input=item;">{{item}}</span>
      </div>
    </section>

    <!-- 列表 -->
    <van-list v-model="loading" :finished="finished" @load="onLoad">
      <course-item v-if="classList.length" :course="classList"></course-item>
    </van-list>
    <empty :empty_type="empty_type" v-if="emptybool"></empty>
  </div>
</template>

<script>
import courseItem from "../../components/CourseItem";
import empty from "@/components/Empty";

export default {
  name: "Search",
  components: { empty, courseItem },
  data() {
    return {
      input: "",
      input_history: [],
      searchbool: false,
      emptybool: false,
      classList: [],
      empty_type: {
        name: "暂无搜索结果"
      },
      page: 1,
      name: this.$route.query.name,
      loading: false,
      finished: true
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
      this.$store.commit("SEARCH_INP", "");
    },
    empty_his() {
      this.$store.commit("SEARCH_EMPTY");
      this.input_history = [];
    },
    gosearch() {
      if (this.name) {
        this.input && this.$store.commit("OTO_KEY", this.input);
        this.$router.replace({
          name: this.name
        });
        return;
      }
      if (this.finished) {
        this.page = 0;
        this.finished = false;
      } else {
        this.page = 1;
        this.getCourse();
      }
    },
    getCourse() {
      this.$http
        .get("/api/app/courseBasis", {
          limit: 10,
          page: this.page,
          course_type: 0,
          keywords: this.input
        })
        .then(res => {
          this.loading = false;
          if (res.list.length == 0) {
            this.finished = true;
            if (this.page == 1) {
              this.emptybool = true;
            }
            return;
          }
          if (this.page == 1) {
            this.classList = res.list;
          } else {
            this.classList = this.classList.concat(res.list);
          }
          this.emptybool = false;
          this.searchbool = true;
        });
    },
    gotosearch() {
      this.gosearch();
      this.$store.commit("SEARCH_INP", this.input);
      this.$store.commit("ADD_SEARCH_HISTORY", this.input);
    },
    inp() {
      this.input = this.$store.state.search_input;
    },
    inp_his() {
      this.input_history = this.$store.state.search_history;
    },
    onLoad() {
      this.page++;
      this.getCourse();
    }
  },
  created() {
    // this.inp();
    this.inp_his();
    // if (this.input != "") {
    //   this.gotosearch();
    // }
  },
  watch: {
    input(val) {
      if (!val) {
        this.classList = [];
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.search-info {
  padding-bottom: 80px;
  .search-header {
    @extend %flex-center;
    height: 94px;
    border-bottom: 1px solid rgba(234, 234, 234, 1);
    background: #fff;
    span {
      &:nth-child(1) {
        flex: 1;
        @extend %flex-center;
        img {
          width: 18px;
          height: 32px;
          padding-left: 30px;
        }
      }
      &:nth-child(2) {
        flex: 6;
        input {
          height: 60px;
          padding-left: 56px;
          border: none;
          background: #e4e7ed;
          border-radius: 30px;
          font-size: 30px;
          width: 86%;
        }
      }
      &:nth-child(3) {
        flex: 1;
        font-size: 28px;
        color: #d2d2d1;
      }
    }
  }
  .history-search {
    margin: 30px 34px;
    .his-header {
      height: 80px;
      p {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        span {
          &:nth-child(1) {
            font-size: 30px;
            color: #333;
            font-weight: bold;
          }
          &:nth-child(2) {
            i {
              display: inline-block;
              background: url("../../assets/images/delete-history.png")
                no-repeat;
              background-size: 100% 100%;
              width: 28px;
              height: 28px;
            }
          }
        }
      }
    }
    .list {
      display: flex;
      flex-wrap: wrap;
      justify-content: left;
      span {
        margin: 20px 14px 0 14px;
        padding: 12px 20px;
        border-radius: 20px;
        background: rgba(247, 247, 247, 1);
        font-size: 24px;
        color: #333;
      }
    }
  }
  .search-status {
    margin: 20px;
    li {
      height: 102px;
      padding-left: 18px;
      line-height: 102px;
      font-size: 30px;
      color: #333;
      text-align: left;
      &:not(:last-child) {
        border-bottom: 0.5px solid rgba(234, 234, 234, 1);
      }
    }
  }
  .index-item-page {
    background: #f8f8f8;
  }
}
</style>
