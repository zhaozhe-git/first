<template>
  <div class="paper-package">
    <headers :title="title" @toGet="goSearh">
      <template slot="right-sum">
        <img class="search" src="@/assets/images/search.png" alt />
      </template>
    </headers>
    <div class="course-fitler">
      <van-dropdown-menu :active-color="$theme_color" class="special-item">
        <van-dropdown-item title="类型不限" ref="ques_source">
          <ul class="course-sort">
            <li
              :class="searchParams.ques_source == item.key ? 'active':''"
              v-for="item in ques_source"
              :key="item.key"
              @click="selectType('ques_source',item.key)"
            >{{item.value}}</li>
          </ul>
        </van-dropdown-item>
        <van-dropdown-item title="巩固全部错题" disabled></van-dropdown-item>
        <van-dropdown-item title="移除错题" disabled></van-dropdown-item>
      </van-dropdown-menu>
      <div class="all-error">
        <div @click="goPack">
          <i class="all-icon"></i>
          <p>巩固全部错题</p>
        </div>
        <div @click="visible=true">
          <i class="remove-icon"></i>
          <p :class="{'theme-color':detach==1}">移除错题</p>
        </div>
      </div>
    </div>
    <p v-if="searchParams.keywords" class="oto-title">"{{searchParams.keywords}}"搜索结果</p>
    <empty :empty_type="empty_type" v-show="list.length == 0"></empty>
    <List
      ref="list"
      url="/api/app/myExam/errorRecord"
      :onGetdata="getList"
      :params="searchParams"
      :onFormatter="onFormatter"
      :showText="list.length>0"
      method="post"
    >
      <div slot="item" class="pack-card">
        <van-swipe-cell v-for="(item,index) in list" :key="index">
          <div class="pc-item">
            <div class="pc-t">
              <p class="pc-title">
                <font v-if="item.ques_source == 1 || item.ques_source == 2">
                  <font
                    :class="{'ques-color':item.status == 1}"
                  >{{item.status == 1 ? '[进行中]':'[已结束]'}}</font>
                </font>
                {{item.name ? item.name : item.package_name}}
              </p>
              <span>{{item.error_count}}道错题</span>
            </div>
            <div class="pc-info">
              <p
                v-if="item.ques_source == 1 || item.ques_source == 2"
              >{{item.ques_source==1 ? '模拟考试':"正式考试"}}</p>
              <p>
                <span>提交时间：{{item.created_at}}</span>
              </p>
            </div>
            <!-- 操作 -->
            <div class="footer">
              <div>
                <van-button @click="goPage('ErrorList',item)">巩固错题</van-button>
              </div>
            </div>
          </div>
          <template slot="right">
            <van-button
              @click="onDelete(item.paper_id)"
              class="btn-delete"
              square
              type="danger"
              text="移除"
            />
          </template>
        </van-swipe-cell>
      </div>
    </List>
    <van-dialog class="dialogs" v-model="visible" show-cancel-button @confirm="dialogOk">
      <p class="submit-p">是否做对题目后自动移除该错题</p>
    </van-dialog>
  </div>
</template>

<script>
import headers from "@/components/Header";
import List from "@/components/List";
import Card from "./QuestionCard";
import empty from "@/components/Empty";
export default {
  name: "ErrorQues",
  components: {
    headers,
    List,
    Card,
    empty
  },
  data() {
    return {
      title: {
        name: "错题记录",
        backUrl: "Practise"
      },
      ques_source: [
        { key: "-1", value: "全部" },
        { key: "3", value: "套卷练习" },
        { key: "4", value: "考点专练" },
        { key: "5", value: "仿真模考" }
      ],
      searchParams: {
        ques_source: -1,
        keywords: "",
        init: function() {
          this.ques_source = -1;
        }
      },
      list: [],
      firstIn: 0,
      visible: false,
      detach: 0,
      empty_type: {
        name: "暂无错题记录"
      }
    };
  },
  methods: {
    onFormatter(row) {
      row.forEach(item => {
        item.limit_time = parseInt(item.limit_time / 60) + "分";
        if (item.limit_time % 60) {
          item.limit_time = item.limit_time + (item.limit_time % 60) + "秒";
        }
      });
    },
    goSearh() {
      this.$router.push({
        name: "Search",
        query: {
          name: "ErrorQues"
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
      if (this.searchParams.keywords) {
        this.searchParams.keywords = "";
      }
    },
    goPack() {
      if (this.list.length == 0) {
        return;
      }
      this.$router.push({
        name: "ErrorList"
      });
    },
    /**
     *  自动移除错题开关   0 关闭  1开启 根据现在的detach状态来切换
     * */
    dialogOk() {
      this.$http
        .get(`/api/app/myExam/autoDetach/${this.detach == 1 ? 0 : 1}`)
        .then(res => {
          this.$toast({
            message: this.detach == 1 ? "已关闭" : "已开启",
            type: "success",
            duration: 800,
            onClose: () => {
              if (this.detach) {
                this.detach = 0;
              } else {
                this.detach = 1;
              }
            }
          });
        });
    },
    /**
     * 跳转错题详情页面
     * @param {String} name 路由
     * @param {String} item 参数  paper_id:试卷id; time:时间, detach 自动纠错
     * */
    goPage(name, item) {
      let query = {};
      query.type = "ErrorQues";
      query.id = item.paper_id;
      let time = new Date(item.created_at).getTime() / 1000;
      query.time = time;
      query.detach = this.detach;
      this.$router.push({
        name,
        query
      });
    },
    /**
     * 移除错题记录  筛选出该次试卷的所有错题并移除
     *  */
    async onDelete(id) {
      let ids = "";
      let list = await this.$http.get(`/api/app/myExam/errorRecord/${id}`);
      list.forEach(item => {
        ids += item.id + ",";
      });
      ids = ids.substr(0, ids.length - 1);
      await this.$http.get(`/api/app/myExam/detach/${ids}`);
      this.$toast({
        message: "取消成功",
        duration: 800,
        onClose: () => {
          this.$refs.list.reset();
        }
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
      this.searchParams.keywords = this.$store.state.keywords;
      this.$store.commit("OTO_KEY");
    } else {
      this.clearName();
    }
    this.$refs.list.reset();
  },
  created() {
    this.$http
      .post(`/api/app/myExam/errorRecord`, this.searchParams)
      .then(res => {
        this.detach = res.switch;
      });
  }
};
</script>

<style lang='scss' scoped>
.theme-color {
  color: $theme_color !important;
}
.ques-color {
  color: $ques_color !important;
}
.special-item
  /deep/
  .van-dropdown-menu__item:nth-child(2)
  .van-dropdown-menu__title::after,
.special-item
  /deep/
  .van-dropdown-menu__item:nth-child(3)
  .van-dropdown-menu__title::after {
  display: none;
}
.search {
  width: 38px;
  height: 40px;
  margin-top: 20px;
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
  color: $theme_color;
}
.course-fitler {
  .all-error {
    background: #fff;
    position: fixed;
    width: 490px;
    height: 84px;
    right: 0;
    top: 86px;
    z-index: 999;
    display: flex;
    & > div {
      width: 60%;
      height: 100%;
      @extend %flex-center;
      i {
        width: 40px;
        padding-right: 10px;
        height: 100%;
        display: inline-block;
      }
      .all-icon {
        background: url("~@/assets/images/error-all.png") no-repeat center
          center;
        background-size: 28px 28px;
      }
      .remove-icon {
        background: url("~@/assets/images/error-remove-icon.png") no-repeat
          center center;
        background-size: 24px 27px;
      }
      p {
        font-size: 30px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(140, 140, 140, 1);
      }
    }
  }
}
.btn-delete {
  width: 120px;
  height: 100%;
  font-size: 28px;
  padding: 0 40px;
}
.pack-card {
  padding: 10px 20px 0;
  .pc-item {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 16px 0px rgba(10, 0, 24, 0.08);
    border-radius: 10px;
    padding: 30px;
    font-family: PingFang SC;
    font-weight: 400;
    margin: 20px 10px 10px;
    position: relative;
    .pc-t {
      display: flex;
      justify-content: space-between;
      p {
        width: 500px;
      }
      span {
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(74, 112, 255, 1);
        line-height: 40px;
      }
    }
    .pc-title {
      font-size: 28px;
      color: rgba(38, 38, 38, 1);
      line-height: 40px;
      padding-bottom: 10px;
      width: 600px;
      font {
        font {
          color: #8c8c8c;
        }
      }
    }
    .pc-info {
      p {
        line-height: 46px;
        font-size: 24px;
        color: rgba(140, 140, 140, 1);
        span {
          padding-right: 40px;
        }
      }
    }
    .footer {
      display: flex;
      flex-direction: row-reverse;
      padding-top: 20px;
      div {
        button {
          width: 156px;
          height: 56px;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(65, 105, 255, 1);
          border-radius: 28px;
          font-size: 24px;
          text-align: center;
          line-height: 56px;
          color: rgba(65, 105, 255, 1);
          margin-left: 17px;
        }
        .default {
          border-color: #d9d9d9;
          color: #d9d9d9;
        }
      }
    }
    .exam-state {
      position: absolute;
      right: 0;
      top: 0;
      width: 85px;
      height: 83px;
    }
    .exam-nopass {
      position: absolute;
      right: 30px;
      top: 65px;
      width: 88px;
      height: 71px;
    }
  }
}
.oto-title {
  font-size: 28px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(140, 140, 140, 1);
  padding-top: 30px;
  padding-left: 20px;
}
</style>
