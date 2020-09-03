<template>
  <div class="oto-plan">
    <div class="header">
      <header>
        <span class="back" @click="goBack">
          <img src="@/assets/images/white-return.png" />
        </span>
        <h3>预约课程</h3>
      </header>
    </div>
    <div class="teacher-info">
      <img :src="teacher.avatar" alt />
      <div>
        <p>
          <span>{{teacher.teacher_name}}</span>
        </p>
        <p>{{teacher.sex == 1 ? '女':'男'}} {{teacher.teach_age}}年教龄</p>
      </div>
      <router-link :to="{name: 'Teacher', query:{id: teacher.id}}">查看详情</router-link>
    </div>
    <div class="op-title">
      选择时间
      <span>（北京时间）</span>
    </div>
    <div class="op-time">
      <div class="opt-block">
        <p
          :class="item.disable==0 ? 'disabel': isSelect.day== item.day ? 'active':''"
          v-for="(item,index) in weekTime"
          :key="index"
          @click="selectDay(item)"
        >
          <span>{{week[index]}}</span>
          <span>{{item.month}}/{{item.day}}</span>
          <i v-show="isSelect.day== item.day"></i>
        </p>
      </div>
    </div>
    <div class="op-content" v-if="times.length && !notice">
      <div class="opc-parent" v-for="(item,index) in times" :key="index">
        <div class="opc-item" v-for="(it,idx) in item" :key="idx" @click="selectTime(it)">
          <p :class="oto_course.oto_course_id==it.oto_course_id ? 'active':''">
            <span>{{it.start_play | fomartTime('hh:mm')}}</span>
            <font v-if="it.invite_status == -1" class="greed">可预约</font>
            <font
              v-else
              :class="it.invite_status==2?'red':it.invite_status==0?'greed':''"
            >{{it.invite_status == 3 && !login ? '':invite_status_name[it.invite_status]}}</font>
          </p>
        </div>
      </div>
    </div>
    <div v-show="!times.length && !notice">
      <empty class="empty" :empty_type="{name: '暂无信息'}"></empty>
    </div>
    <div class="oto-error" v-show="notice">
      <p>
        <img src="@/assets/images/oto-sorry.png" alt />
        <span>抱歉。现在还不能约下周课程哦</span>
      </p>
      <p>约课规则：{{msg}}</p>
    </div>
    <p class="op-notice" v-show="oto_course.start_play && !notice">
      您已选择：
      <span>{{teacher.teacher_name}} {{oto_course.start_play | fomartTime("yyyy.MM.dd hh:mm")}}</span> 的课程
    </p>
    <van-button v-show="!notice" class="course-btn" @click="showModel">立即预约</van-button>
    <van-dialog
      class="oto-model"
      v-model="ensure"
      title="预约确认"
      @confirm="submit"
      :close-on-click-overlay="true"
    >
      <p class="op-dialog">
        预约老师：{{ensureData.teacher_name}}
        <span></span>
        价格：{{ensureData.section_price}}
      </p>
      <p
        class="op-dialog pb20"
      >预约时间：{{oto_course.start_play | fomartTime("yyyy.MM.dd")}} （{{ensureWeek}}）{{oto_course.start_play | fomartTime("hh:mm")}}</p>
    </van-dialog>
  </div>
</template>

<script>
import empty from "@/components/Empty";
export default {
  name: "OtoPlan",
  components: {
    empty
  },
  data() {
    return {
      teacher_id: this.$route.query.id,
      teacher: {},
      week: [
        "周一",
        "周二",
        "周三",
        "周四",
        "周五",
        "周六",
        "周日",
        "周一",
        "周二",
        "周三",
        "周四",
        "周五",
        "周六",
        "周日"
      ],
      weekTime: [],
      isSelect: {},
      notice: false,
      times: [],
      invite_status_name: ["可预约", "已约满", "已预约", "已过期"],
      oto_course: {},
      ensure: false,
      ensureData: {},
      ensureWeek: 0,
      msg: "",
      login: false
    };
  },
  methods: {
    goBack() {
      this.$store.commit("BACK_NORMAL", 0);
      this.$router.go(-1);
    },
    selectDay(val) {
      if (val.disable == 0) {
        return;
      }
      this.isSelect = val;
      this.getPlan();
    },
    selectTime(it) {
      if (it.invite_status == 0 || it.invite_status == -1) {
        this.oto_course = it;
      }
    },
    getPlan() {
      let is_next_week = 1;
      if (this.isSelect.currentWeek) is_next_week = 0;
      let weekday = this.getWeek();
      this.$http
        .post(`/api/app/teacher/invite`, {
          teacher_id: this.teacher_id,
          week_day: weekday,
          is_next: is_next_week
        })
        .then(res => {
          if (res.code && res.code == 203) {
            this.notice = true;
            this.msg = res.msg;
            return;
          }
          if (this.notice) this.notice = false;
          let times = [];
          if (res.otoCourseList.length) {
            let len = 0;
            if (res.otoCourseList.length % 4 == 0) {
              len = parseInt(res.otoCourseList.length / 4);
            } else {
              len = parseInt(res.otoCourseList.length / 4) + 1;
            }
            for (let i = 0; i < len; i++) {
              let arr = [];
              for (let j = i * 4; j < (i + 1) * 4; j++) {
                if (res.otoCourseList[j]) {
                  arr.push(res.otoCourseList[j]);
                } else {
                  break;
                }
              }
              times.push(arr);
            }
          }
          this.times = times;
        });
    },
    getTeacher() {
      this.$http.get(`/api/app/teacher/${this.teacher_id}`).then(res => {
        this.teacher = res.teacher;
      });
    },
    initTime() {
      let { days, day } = this.$pub.initDays();
      days.forEach(item => {
        if (item.day == day) {
          this.isSelect = item;
        }
        if (item.day < 10) item.day = "0" + item.day;
        if (item.month < 10) item.month = "0" + item.month;
      });
      this.weekTime = days;
      this.getPlan();
    },
    showModel() {
      if (this.$pub.checkLogin()) {
        if (this.oto_course.start_play) {
          this.$http
            .post(`/api/app/oto/inviteConfirm`, {
              oto_course_id: this.oto_course.oto_course_id
            })
            .then(res => {
              if (res.code == 203) {
                this.$toast({
                  message: res.msg,
                  type: "error",
                  duration: 1000
                });
              } else {
                this.ensureData = res;
                this.ensureWeek = this.week[this.getWeek() - 1];
                this.ensure = true;
              }
            });
        } else {
          this.$toast("请选择预约时间");
        }
      }
    },
    getWeek() {
      let date = `${this.isSelect.year}/${this.isSelect.month}/${this.isSelect.day}`;
      let weekday = new Date(date).getDay();
      if (weekday == 0) weekday = 7;
      return weekday;
    },
    submit() {
      this.ensure = false;
      if (this.ensureData.section_price / 1 == 0) {
        this.$http
          .post(`/api/app/order/shopInfo`, {
            shop_id: this.oto_course.oto_course_id,
            type: 1
          })
          .then(res => {
            
            if(res.type==1){
              this.$confirm(res.msg, '提示', {
			          confirmButtonText: '去充值',
			          cancelButtonText: '取消',
			          type: 'warning'
			        }).then(() => {
			        	if (this.$store.state.app) {
			        		 this.$pub.appAction("appcurrency");
			        	}
			        	else
			        	{
			        		this.$router.replace({
		              name: "MyCurrency"});
			        	}
			        }).catch(() => {
			         //alert(2);        
              });
              return false
            }
            if (this.$store.state.app) {
              this.$store.commit("BACK_NORMAL", 1);
              this.$pub.appAction("appointSuccess")
              return false;
            }
            this.$toast({
              message: "成功",
              type: "success",
              duration: 1000,
              onClose: () => {
                this.$router.push({
                  name: "Record"
                });
                // this.selectDay(this.isSelect);
              }
            });
          });
      } else {
        this.$http
          .post(`/api/app/order/shopInfo`, {
            shop_id: this.oto_course.oto_course_id,
            type: 1
          })
          .then(res => {
            if(res.type==1){
              this.$dialog.confirm({
                title:'提示',
                message: res.msg,
                confirmButtonText: '去充值',
                cancelButtonText: '取消'
              }).then(() => {
			        	if (this.$store.state.app) {
			        		 this.$pub.appAction("appcurrency");
			        	}
			        	else
			        	{
			        		this.$router.replace({
		              name: "MyCurrency"});
			        	}
			        }).catch(() => {
			         //alert(2);        
              });
              // this.$confirm(res.msg, '提示', {
			        //   confirmButtonText: '去充值',
			        //   cancelButtonText: '取消',
			        //   type: 'warning'
			        // }).then(() => {
			        // 	if (this.$store.state.app) {
			        // 		 this.$pub.appAction("appcurrency");
			        // 	}
			        // 	else
			        // 	{
			        // 		this.$router.replace({
		          //     name: "MyCurrency"});
			        // 	}
			        // }).catch(() => {
			        //  //alert(2);        
              // });
              return false
            }
            if (this.$store.state.app) {
              this.$store.commit("BACK_NORMAL", 1);
              this.$pub.appAction("appointSuccess")
              return false
            }
            this.$toast({
              message: "购买成功",
              type: "success",
              duration: 1000,
              onClose: () => {
                this.$router.push({
                  name: "Record"
                });
              }
            });

          });
      }
    }
  },
  created() {
    this.getTeacher();
    this.initTime();
    if (localStorage.adminToken) {
      this.login = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.oto-plan {
  min-height: 100vh;
  background: #f0f2f5;
  padding-bottom: 160px;
  box-sizing: border-box;
}
.header {
  height: 200px;
  line-height: 88px;
  background: linear-gradient(
    180deg,
    rgba(99, 183, 254, 1) 0%,
    rgba(78, 125, 227, 1) 100%
  );
  header {
    @extend %flex-center;
    height: 88px;
    width: 100%;
    padding-right: 50px;
    box-sizing: border-box;
  }
  .header_box {
    width: 100%;
    height: 100%;
  }
  .back {
    @extend %flex-center;
    width: 50px;
    height: 100%;
    padding-left: 20px;
    img {
      width: 18px;
      height: 32px;
    }
  }
  h3 {
    flex: 2;
    text-align: center;
    font-size: 36px;
    color: #fff;
  }
}
.teacher-info {
  margin: -114px auto 0;
  height: 162px;
  width: 710px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background: #fff;
  border-radius: 8px;
  box-sizing: border-box;
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
  a {
    flex: none;
    width: 152px;
    height: 56px;
    line-height: 56px;
    background: #fff;
    border-radius: 31px;
    font-size: 26px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: $theme_color;
    border: none;
    text-align: center;
    border: 1px solid $theme_color;
  }
}
.op-title {
  font-size: 30px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(89, 89, 89, 1);
  line-height: 100px;
  position: relative;
  padding-left: 50px;
  height: 100px;
  span {
    font-size: 24px;
  }
}
.op-title::after {
  position: absolute;
  content: "";
  left: 24px;
  top: 34px;
  width: 6px;
  height: 32px;
  background: $theme_color;
}
.op-time {
  margin: 0 auto;
  width: 710px;
  height: 148px;
  background: rgba(255, 255, 255, 1);
  border-radius: 8px;
  padding: 0 20px;
  overflow: auto;
  display: flex;
  box-sizing: border-box;
  .opt-block {
    height: 124px;
    border-bottom: 1px solid #f1f1f1;
    display: flex;
    p {
      @extend %flex-center;
      flex-direction: column;
      width: 112px;
      font-size: 26px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: #595959;
      position: relative;
      span {
        &:first-child {
          margin-bottom: 14px;
        }
      }
      i {
        position: absolute;
        bottom: 0px;
        left: 50%;
        width: 42px;
        height: 8px;
        background: rgba(65, 105, 255, 1);
        border-radius: 4px;
        transform: translateX(-50%);
      }
    }
    p.active {
      color: $theme_color;
    }
    p.disabel {
      color: #b7b7b7;
    }
  }
}
.op-content {
  width: 710px;
  max-height: 536px;
  background: rgba(255, 255, 255, 1);
  border-radius: 8px;
  margin: 24px auto 0;
  overflow-y: auto;
  .opc-parent {
    height: 130px;
    border-bottom: 1px solid #f1f1f1;
    display: flex;
    .opc-item {
      width: 25%;
      height: 100%;
      padding-top: 10px;
      box-sizing: border-box;
      p {
        margin: 0 auto;
        width: 108px;
        height: 108px;
        @extend %flex-center;
        flex-direction: column;
        border-radius: 16px;
        span {
          margin-bottom: 20px;
          color: #595959;
          font-size: 28px;
          font-family: PingFangSC-Medium;
          font-weight: 500;
        }
        font {
          color: #b7b7b7;
          font-size: 26px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
        }
        font.red {
          color: #e02020;
        }
        font.greed {
          color: $theme_color;
        }
      }
      p.active {
        background: rgba(245, 245, 245, 1);
      }
    }
  }
}
.empty {
  padding-top: 40px;
}
.oto-error {
  margin-top: 120px;
  p {
    &:first-child {
      @extend %flex-center;
      height: 120px;
      img {
        width: 66px;
        height: 60px;
        margin-right: 40px;
      }
      span {
        font-size: 32px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(89, 89, 89, 1);
      }
    }
    &:last-child {
      font-size: 24px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(140, 140, 140, 1);
      text-align: center;
    }
  }
}
.op-notice {
  position: fixed;
  bottom: 120px;
  width: 100%;
  text-align: center;
  font-size: 24px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(89, 89, 89, 1);
  span {
    color: $theme_color;
  }
}
.op-dialog {
  font-size: 30px;
  font-family: PingFangSC-Light;
  font-weight: 300;
  color: rgba(89, 89, 89, 1);
  text-align: center;
  line-height: 60px;
  span {
    padding-left: 50px;
  }
}
.pb20 {
  padding-bottom: 30px;
}
</style>
