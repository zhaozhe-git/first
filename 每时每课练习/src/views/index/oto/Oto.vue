<template>
  <div class="oto-page">
    <Header :title="title" @toGet="goSearch">
      <template slot="right-sum">
        <img class="search" src="@/assets/images/search.png" alt />
      </template>
    </Header>
    <div class="oto-filter">
      <div class="of-head">
        <div :class="active==1?'active':''" @click="setFilter(1)">
          <font>选择上课时间</font>
          <i></i>
        </div>
        <div :class="active==2?'active':''" @click="setFilter(2)">
          <font>选择老师条件</font>
          <i></i>
        </div>
      </div>
      <div class="time-module" v-show="active==1">
        <div class="time-date">
          <p class="time-block">日期</p>
          <van-row type="flex" justify="space-around">
            <van-col v-for="(item,index) in week" :key="index">
              <span class="time-week">{{item}}</span>
            </van-col>
          </van-row>
          <div class="time-day">
            <p @click.stop="selectDay(item)" v-for="(item,index) in day_list" :key="index">
              <font
                :class="selectTime.day == item.day ? 'active': isToday == item.day ? 'today': item.disable == 0 ? 'disable':''"
              >
                {{item.day}}
                <span v-if="item.day == isToday" class="time-today">今天</span>
              </font>
            </p>
          </div>
        </div>
        <div class="time-rinle">
          <p class="time-block">时段</p>
          <div class="tr-ipt">
            <p @click="openPicker('startTime')">
              <input placeholder="开始时间" :value="studyTime.startTime" disabled="disabled" />
              <i></i>
            </p>
            <font>-</font>
            <p @click="openPicker('endTime')">
              <input placeholder="结束时间" :value="studyTime.endTime" disabled="disabled" />
              <i></i>
            </p>
          </div>
        </div>
      </div>
      <div class="teacher-module" v-show="active==2">
        <div class="tm-kind">
          <p>老师类型</p>
          <div class="tmk-item">
            <span
              :class="teachSearch.level_id == item.level_id ? 'active':''"
              v-for="item in teachLeve"
              :key="item.level_id"
              @click="teachSearch.level_id = item.level_id"
            >{{item.level_name}}</span>
          </div>
        </div>
        <div class="tm-kind">
          <p>只看</p>
          <van-checkbox-group v-model="ready">
            <van-checkbox name="1" shape="square" :checked-color="$theme_color">
              <img slot="icon" slot-scope="props" :src="props.checked ? select : unselect" />已关注
            </van-checkbox>
            <van-checkbox name="2" shape="square" :checked-color="$theme_color">
              <img slot="icon" slot-scope="props" :src="props.checked ? select : unselect" />上过课的
            </van-checkbox>
          </van-checkbox-group>
        </div>
        <div class="tm-kind">
          <p>性别</p>
          <div class="tmk-item">
            <span
              :class="teachSearch.sex === item.sex ? 'active':''"
              v-for="item in sexs"
              :key="item.sex"
              @click="teachSearch.sex = item.sex"
            >{{item.name}}</span>
          </div>
        </div>
        <div class="tm-kind" v-for="(item,index) in attrList" :key="index">
          <p>{{item.attr_name}}</p>
          <div class="tmk-item">
            <span
              :class="teachSearch.attr_val_id['attr'+index] == it.attr_val_id ? 'active':''"
              v-for="it in item.child"
              :key="it.attr_val_id"
              @click="selectId(it.attr_val_id,index)"
            >{{it.attr_val_name}}</span>
          </div>
        </div>
      </div>
      <div class="oto-btn" v-show="active!=0">
        <button @click="reset">重置</button>
        <button @click="search">确定</button>
      </div>
    </div>
    <p v-if="keywords" class="oto-title">"{{keywords}}"搜索结果</p>
    <List
      v-if="start"
      class="oto-content"
      ref="list"
      url="/api/app/otoCourse"
      method="get"
      :params="params"
      :on-getdata="onGetdata"
      :on-finished="onFinishdata"
      v-show="active == 0"
    >
      <div slot="item" class="oc-item" v-for="item in otoCourse" :key="item.teacher_id" @click="toOtoPlan(item)">
        <img :src="item.avatar" alt />
        <div>
          <p>
            <span>{{item.real_name}}</span>
            <font v-if="item.is_collect">已关注</font>
          </p>
          <p>{{item.sex == 1 ? '女':'男'}} {{item.teach_age}}年教龄</p>
        </div>
        <div class="Yuyue">预约</div>
        <!-- <router-link :to="{name: 'OtoPlan', query:{id: item.teacher_id}}">预约</router-link> -->

      </div>
    </List>
    <van-popup v-model="timeShow" position="bottom" :style="{ height: '40%' }">
      <van-datetime-picker
        v-model="currentTime"
        type="time"
        :min-hour="0"
        :max-hour="23"
        @confirm="successHanlder"
        @cancel="timeShow=false"
      />
    </van-popup>
    <van-dialog
      v-model="show"
      @confirm='toLogin'
      confirm-button-text="立即登录"

    >
      <i class="close" @click="show=false"></i>
      <img src="../../../assets/images/feiji.png">
      <p class="LoginText">赶紧登录一下吧</p>
      <p class="message">立即预约一对一辅导，浏览更多视频课程~</p>
    </van-dialog>
  </div>
</template>

<script>
import Header from "@/components/Header";
import List from "@/components/List";
export default {
  name: "Oto",
  components: {
    Header,
    List
  },
  data() {
    return {
      title: {
        name: "一对一辅导",
        // backUrl: "Index"
      },
      show: false,
      active: 0,
      week: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      day_list: [],
      isToday: 0,
      studyTime: {
        startTime: "",
        endTime: "",
        init: function() {
          this.startTime = "";
          this.endTime = "";
        }
      },
      selectTime: {
        year: "",
        month: "",
        day: ""
      },
      teachSearch: {
        level_id: "",
        attr_val_id: {},
        is_collect: 0,
        is_attended: 0,
        sex: "",
        init: function() {
          this.sex = "";
          this.attr_val_id = {};
          this.level_id = "";
        }
      },
      timeShow: false,
      currentTime: "",
      teachLeve: [],
      attrList: [],
      sexs: [{ name: "男", sex: 0 }, { name: "女", sex: 1 }],
      ready: [],
      select: require("../../../assets/theme-img/checkbox-select.png"),
      unselect: require("../../../assets/images/un-select.png"),
      otoCourse: [],
      params: {},
      keywords: "",
      user_arrt_id: "",
      start: false
    };
  },
  watch: {
    ready: {
      handler(val) {
        if (val.includes("2")) {
          this.teachSearch.is_attended = 1;
        } else {
          this.teachSearch.is_attended = 0;
        }
        if (val.includes("1")) {
          this.teachSearch.is_collect = 1;
        } else {
          this.teachSearch.is_collect = 0;
        }
      },
      deep: true
    },
    $route(val) {
      if (val.name == "Oto") {
        if (this.$store.state.keywords) {
          this.keywords = this.$store.state.keywords;
          this.studyTime.init();
          this.selectTime = {};
          this.ready = [];
          this.teachSearch.init();
          this.params = {
            teacher_name: this.keywords
          };
          this.$store.commit("OTO_KEY");
        } else {
          if (this.params.teacher_name) {
            this.params.teacher_name = "";
            this.keywords = "";
          }
        }
        this.$refs.list.reset();
      }
    }
  },
  methods: {
    toOtoPlan(item){
      if(!localStorage.adminToken){
        this.show = true;
        return;
      }
      // this.$alert(localStorage.adminToken)
      this.$router.push({
        name: 'OtoPlan', 
        query:{id: item.teacher_id}
      })
    },
    goSearch() {
      this.$router.push({
        name: "Search",
        query: {
          name: "Oto"
        }
      });
    },
    setFilter(num) {
      if (num == this.active) {
        this.active = 0;
      } else {
        this.active = num;
      }
    },
    // 时间
    selectDay(val) {
      if (val.disable == 0) {
        return;
      }
      this.selectTime = val;
    },
    setDay() {
      let { days, day } = this.$pub.initDays();
      this.isToday = day;
      this.day_list = days;
    },
    openPicker(name) {
      this.currentTime = this.studyTime[name];
      this.timeChoose = name;
      this.timeShow = true;
    },
    successHanlder(val) {
      this.studyTime[this.timeChoose] = val;
      this.timeShow = false;
    },
    // 老师
    getotoCourseOptions() {
      this.$http.get(`/api/app/otoCourseOptions`).then(res => {
        this.teachLeve = res.otoTeacherLevel;
        this.attrList = res.attrList;
        // 默认选定该学员所在年级
        if (this.user_arrt_id) {
          res.attrList.forEach((it, idx) => {
            if (it.attr_name == "年级") {
              this.$set(
                this.teachSearch.attr_val_id,
                "attr" + idx,
                this.user_arrt_id
              );
              return;
            }
          });
        }
      });
    },
    selectId(id, index) {
      this.$set(this.teachSearch.attr_val_id, "attr" + index, id);
    },
    reset() {
      if (this.active == 1) {
        this.studyTime.init();
        this.selectTime = {};
      } else {
        this.ready = [];
        this.teachSearch.init();
      }
      this.search();
    },
    search() {
      this.keywords = "";
      this.active = "";
      this.params = this.getParams();
      this.$refs.list.reset();
    },
    getParams() {
      let startDay = "";
      if (this.selectTime.year) {
        startDay =
          this.selectTime.year +
          "-" +
          this.selectTime.month +
          "-" +
          this.selectTime.day;
      }
      let params = {
        start_time: this.studyTime.startTime
          ? startDay + " " + this.studyTime.startTime
          : startDay
          ? startDay + " 00:00:00"
          : "",
        end_time: this.studyTime.endTime
          ? startDay + " " + this.studyTime.endTime
          : startDay
          ? startDay + " 23:59:59"
          : "",
        level_id: this.teachSearch.level_id,
        is_collect: this.teachSearch.is_collect,
        is_attended: this.teachSearch.is_attended,
        sex: this.teachSearch.sex,
      };
      params.attr_val_id = this.$pub.objToStr(
        this.teachSearch.attr_val_id,
        ","
      );
      return params;
    },
    onGetdata(data) {
      this.otoCourse = data;
 
    },
    onFinishdata() {
      if(this.otoCourse.length==0 || this.params["attr_val_id"]){
        this.params.attr_val_id = 0;
        this.$refs.list.reset();
      }
    },
    toLogin(){
      this.$router.push({
        name:'Login'
      })
    }
  },
  async created() {
    if (localStorage.adminToken) {
      let userInfo = await this.$http.get(`/api/app/userInfo`);
      let user_arrt = userInfo.attr;
      for (let i = 0; i < user_arrt.length; i++) {
        if (user_arrt[i].attr_id == 1) {
          this.user_arrt_id = user_arrt[i].attr_val_id;
          this.params["attr_val_id"] = this.user_arrt_id;
          break;
        }
      }
    }
    this.start = true;
    this.setDay();
    this.getotoCourseOptions();
  }
};
</script>

<style lang="scss">
.oto-page {
  min-height: 100vh;
  background: #f0f2f5;
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
  .oto-filter {
    border-top: 2px solid #f5f5f5;
    .of-head {
      display: flex;
      height: 84px;
      background: #fff;
      div {
        width: 50%;
        @extend %flex-center;
        font {
          font-size: 30px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(140, 140, 140, 1);
        }
        i {
          width: 18px;
          height: 10px;
          background: url("../../../assets/images/icon-down.png") no-repeat;
          background-size: 100% 100%;
          margin-left: 10px;
        }
      }
      div.active {
        font {
          color: $theme_color;
        }
        i {
          background: url("../../../assets/theme-img/icon-up.png") no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .time-module {
      margin: 20px;
      .time-block {
        font-size: 24px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(89, 89, 89, 1);
        padding: 30px 0 20px 20px;
      }
      .time-date {
        background: #fff;
        border-radius: 8px;
        .time-week {
          font-size: 20px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(89, 89, 89, 1);
        }
        .time-day {
          display: flex;
          flex-wrap: wrap;
          padding-top: 20px;
          p {
            width: 14.28%;
            height: 120px;
            @extend %flex-center;
            font {
              width: 64px;
              height: 64px;
              border-radius: 50%;
              font-size: 38px;
              font-family: PingFangSC-Medium;
              font-weight: 500;
              color: rgba(89, 89, 89, 1);
              text-align: center;
              line-height: 64px;
              position: relative;
              span {
                width: 60px;
                position: absolute;
                bottom: -60px;
                left: 4px;
                font-size: 24px;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                color: rgba(183, 183, 183, 1);
              }
            }
            font.active {
              background: $theme_color;
              color: #fff;
            }
            font.today {
              background: #ebeefe;
              color: $theme_color;
            }
            font.disable {
              color: #b7b7b7;
            }
          }
        }
      }
      .time-rinle {
        margin-top: 20px;
        height: 188px;
        background: rgba(255, 255, 255, 1);
        border-radius: 8px;
        .tr-ipt {
          display: flex;
          margin-left: 26px;
          p {
            width: 290px;
            height: 64px;
            background: rgba(255, 255, 255, 1);
            border-radius: 8px;
            border: 2px solid rgba(191, 191, 191, 1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            input {
              border: none;
              width: 200px;
              height: 50px;
              line-height: 50px;
              font-size: 26px;
              padding-left: 20px;
            }
            i {
              width: 24px;
              height: 24px;
              background: url("../../../assets/images/icon-time.png") no-repeat;
              background-size: 100% 100%;
              margin-right: 16px;
            }
          }
          font {
            width: 70px;
            height: 64px;
            line-height: 64px;
            text-align: center;
            color: rgba(183, 183, 183, 1);
            font-size: 28px;
          }
        }
      }
    }
    .teacher-module {
      padding: 0 30px 80px;
      background: #fff;
      border-top: 1px solid #f1f1f1;
      .tm-kind {
        padding-bottom: 20px;
        border-bottom: 1px solid #f1f1f1;
        p {
          padding: 32px 0 20px;
          font-size: 24px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(89, 89, 89, 1);
        }
        .tmk-item {
          span {
            margin: 0 46px 14px 0;
            display: inline-block;
            width: 138px;
            height: 66px;
            background: rgba(245, 245, 245, 1);
            border-radius: 6px;
            font-size: 26px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: #646464;
            text-align: center;
            line-height: 66px;
            &:nth-child(4n + 0) {
              margin-right: 0;
            }
          }
          span.active {
            color: $theme_color;
            background: #ebeefe;
          }
        }
        .van-checkbox__icon img {
          width: 30px;
          height: 30px;
        }
      }
      .van-checkbox-group {
        display: flex;
        .van-checkbox {
          margin-right: 60px;
        }
      }
    }
    .oto-btn {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 88px;
      button {
        width: 50%;
        display: inline-block;
        line-height: 88px;
        height: 88px;
        font-size: 34px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        text-align: center;
        color: $theme_color;
        background: #fff;
        border: none;
        &:nth-child(2) {
          background: $theme_color;
          color: #fff;
        }
      }
    }
  }
  .oto-content {
    padding: 0 20px;
    .oc-item {
      display: flex;
      align-items: center;
      padding: 0 30px;
      background: #fff;
      border-radius: 8px;
      height: 162px;
      margin-top: 20px;
      img {
        width: 80px;
        height: 80px;
        margin-right: 24px;
        border-radius: 50%;
        flex: none;
      }
      div {
        flex: 1;
        p {
          font-family: PingFangSC-Regular;
          font-weight: 400;
          &:nth-child(1) {
            padding-bottom: 6px;
            span {
              font-size: 30px;
              color: rgba(89, 89, 89, 1);
              line-height: 42px;
              padding-right: 10px;
            }
            font {
              font-size: 22px;
              color: rgba(234, 122, 47, 1);
            }
          }
          &:nth-child(2) {
            font-size: 24px;
            color: rgba(183, 183, 183, 1);
            line-height: 34px;
          }
        }
      }
      .Yuyue {
        flex: none;
        width: 140px;
        height: 62px;
        line-height: 62px;
        background: rgba(235, 238, 254, 1);
        border-radius: 31px;
        font-size: 28px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: $theme_color;
        border: none;
        text-align: center;
      }
    }
  }
    .van-dialog{
      width:566px;
      height:691px;
      background:rgba(255,255,255,1);
      border-radius:30px;

      .van-dialog__content,.van-dialog__footer{
        text-align: center;
      }      
      .close{
        width: 24px;
        height: 24px;
        position: absolute;
        top: 23px;
        right: 26px;
        background-image: url('../../../assets/images/icon_member_account_close.png');
        background-size: 100%;
        background-position: center;
      }
      img{
        width: 565px;
        height: 400;
        margin-top: 29px;
      }
      .LoginText{
        font-size:30px;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height: 44px;
      }
      .message{
        font-size:24px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(153,153,153,1);
        line-height: 38px;
      }
      .van-button{
        width:472px;
        height:80px;
        background:rgba(235,97,0,1);
        border-radius:40px;
        font-size:30px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height: 80px;
        margin-top: 57px;
      }
    }
  .van-picker__toolbar {
    height: 88px;
  }
}

</style>
