<template>
  <div class="paper-package">
    <headers :title="title" @toGet="goSearh">
      <template slot="right-sum">
        <img class="search" src="@/assets/images/search.png" alt />
      </template>
    </headers>
    <div class="course-fitler">
      <van-dropdown-menu :active-color="$theme_color">
        <van-dropdown-item title="题目类型" ref="ques_type">
          <ul class="course-sort">
            <li
              :class="searchParams.ques_type == item.key ? 'active':''"
              v-for="item in ques_type"
              :key="item.key"
              @click="selectType('ques_type',item.key)"
            >{{item.value}}</li>
          </ul>
        </van-dropdown-item>
      </van-dropdown-menu>
    </div>
    <p v-if="searchParams.mix_keyword" class="oto-title">"{{searchParams.mix_keyword}}"搜索结果</p>
    <empty :empty_type="empty_type" v-show="list.length == 0"></empty>
    <List
      ref="list"
      url="/api/app/collect"
      :onGetdata="getList"
      :params="searchParams"
      :onFormatter="onFormatter"
      :showText="list.length>0"
      method="get"
    >
      <template slot="item">
        <van-swipe-cell v-for="(item,index) in list" :key="index">
          <div class="collect-list">
            <div class="cl-content" v-html="item.ques_stem"></div>
            <div class="btn">
              <van-button :to="{name: 'Ques', query:{type: 'Collect', id: item.ques_id}}">查看详情</van-button>
            </div>
          </div>
          <template slot="right">
            <van-button
              @click="onDelete(item.collect_id)"
              class="btn-delete"
              square
              type="danger"
              text="取消收藏"
            />
          </template>
        </van-swipe-cell>
      </template>
    </List>
  </div>
</template>

<script>
import { QuesType } from "@/util/enums";
import headers from "@/components/Header";
import List from "@/components/List";
import Card from "./QuestionCard";
import empty from "@/components/Empty";
export default {
  name: "Assess",
  components: {
    headers,
    List,
    Card,
    empty
  },
  data() {
    return {
      title: {
        name: "习题收藏",
        backUrl: "Practise"
      },
      ques_type: QuesType.getOptions(),
      searchParams: {
        type: 3,
        ques_type: "",
        mix_keyword: "",
        init: function() {
          this.ques_type = "";
        }
      },
      list: [],
      firstIn: 0,
      empty_type: {
        name: "暂无收藏记录"
      }
    };
  },
  methods: {
    onFormatter(row) {
      row.forEach(item => {
        let typeName = QuesType.getValue(item.ques_type) + "题";
        item.ques_stem = `<p class="ques-type">[${typeName}]</p>${item.ques_stem}`;
      });
    },
    goSearh() {
      this.$router.push({
        name: "Search",
        query: {
          name: "QuesCollect"
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
      if (this.searchParams.mix_keyword) {
        this.searchParams.mix_keyword = "";
      }
    },
    onDelete(id) {
      this.$http.put(`/api/app/collect/cancel/${id}/3`).then(res => {
        this.$toast({
          message: "取消成功",
          duration: 800,
          onClose: () => {
            this.$refs.list.reset();
          }
        });
      });
    }
  },
  activated() {
    if (!this.firstIn) {
      this.firstIn = 1;
      return;
    }
    if (this.$store.state.keywords) {
      this.searchParams.init();
      this.searchParams.mix_keyword = this.$store.state.keywords;
      this.$store.commit("OTO_KEY");
    } else {
      this.clearName();
    }
    this.$refs.list.reset();
  },
  mounted() {
    let _this = this;
    $(document).on("click", "img", function(params) {
      let src = $(this).attr("src");
      if (src.search("uploads/image") > 0) {
        _this.$imgPreview([src]);
      }
    });
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
  /deep/ .van-dropdown-menu__item {
    width: 33.3%;
    flex: none;
  }
  .btn-delete {
    width: 120px;
    height: 100%;
    font-size: 28px;
    padding: 0 40px;
  }
  .collect-list {
    min-height: 212px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 16px 0px rgba(10, 0, 24, 0.08);
    border-radius: 10px;
    padding: 20px 30px;
    margin: 20px 30px 10px;
    box-sizing: border-box;
    .cl-content {
      min-height: 80px;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(38, 38, 38, 1);
      /deep/ p {
        display: inline;
        line-height: 40px;
      }
      /deep/ img {
        max-width: 120px;
      }
      /deep/ .ques-type {
        color: #0097fa;
        padding: 0 4px;
      }
    }
    .btn {
      display: flex;
      flex-direction: row-reverse;
      button {
        width: 156px;
        height: 56px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid $theme_color;
        border-radius: 28px;
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 400;
        color: $theme_color;
        text-align: center;
        line-height: 56px;
      }
    }
  }
}
</style>
