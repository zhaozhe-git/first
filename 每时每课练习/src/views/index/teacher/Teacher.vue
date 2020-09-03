<template>
  <div class="teacher-page">
    <div class="header">
      <header>
        <span class="back" @click="backPage">
          <img src="@/assets/images/white-return.png" />
        </span>
        <h3>讲师详情</h3>
      </header>
    </div>
    <div class="teacher-info">
      <div class="ti-base">
        <img :src="teacher.avatar" alt />
        <div>
          <p>
            <span>{{teacher.teacher_name || teacher.real_name}}</span>
            <font v-if="teacher.level_name">{{teacher.level_name}}</font>
          </p>
          <p>
            {{teacher.sex == 1 ? '女':'男'}}
            <font v-if="teacher.level_name">{{teacher.teach_age}}年教龄</font>
          </p>
        </div>
        <button v-if="flag==2" @click="collTeacher">关注</button>
        <p class="has-collect" v-else-if="flag==1" @click="collTeacher">已关注</p>
      </div>
      <div class="ti-label">
        <span v-for="(it,idx) in teacher.tag_content" :key="idx">{{it}}</span>
      </div>
    </div>
    <div class="com-box">
      <van-tabs
        v-model="tab"
        :line-width="16"
        :line-height="2"
        :color="$theme_color"
        :title-active-color="$theme_color"
      >
        <van-tab title="讲师介绍">
          <ul class="teacher-tro">
            <li
              v-for="item in tro.attr"
              :key="item.id"
            >
              <div  v-if="item.attr_name!=='年级' && item.attr_name!=='学科'">
                <span>{{item.attr_name}}</span>
                <font>{{item.val}}</font>
              </div>
            </li>
            <li>
              <span>老师简介</span>
              <font>{{tro.intro}}</font>
            </li>
          </ul>
        </van-tab>
        <van-tab title="主讲课程">
          <List
            url="/api/app/teacher/mainCourse"
            method="post"
            :params="params"
            :on-getdata="onGetdata"
            :showText="false"
          >
            <course-item slot="item" :course="courses" :itemStyle="true"></course-item>
          </List>
        </van-tab>
        <van-tab title="学员评价" v-if="teacher.level_name">
          <section class="evaluate-item">
            <div v-if="tag_list.length">
              <i :class="showTag?'active':''" @click="showTag=!showTag"></i>
              <div :class="showTag?'evaluate-label label-active':'evaluate-label'">
                <span v-for="(item, index) in tag_list" :key="index">{{item.title}}({{item.count}})</span>
              </div>
            </div>
            <comment></comment>
          </section>
        </van-tab>
      </van-tabs>
    </div>
    <van-button
      v-show="teacher.level_name"
      class="course-btn"
      :to="{name: 'OtoPlan', query: {id: this.teacher_id}}"
    >立即预约</van-button>
  </div>
</template>

<script>
import comment from "@/components/CommentItem";
import courseItem from "@/components/CourseItem";
import List from "@/components/List";
export default {
  name: "Teacher",
  components: {
    courseItem,
    comment,
    List
  },
  data() {
    return {
      teacher_id: this.$route.query.id,
      teacher: {},
      tro: {
        intro: "",
        attr: []
      },
      tab: 0,
      courses: [],
      tag_list: [],
      showTag: false,
      flag: 2,
      params: {
        teacher_id: this.$route.query.id
      }
    };
  },
  methods: {
    onLoad() {
      this.page++;
      this.getCourse();
    },
    backPage() {
      if (this.$store.state.app && this.$route.query.back == 1) {
        this.$pub.appAction("closeAppPage");
      } else {
        this.$router.go(-1);
      }
    },
    getTeacher() {
      this.$http.get(`/api/app/teacher/${this.teacher_id}`).then(res => {
        this.teacher = res.teacher;
        this.flag = res.flag;
      });
    },
    getInfo() {
      this.$http.get(`/api/app/teacher/info/${this.teacher_id}`).then(res => {
        res.attr.forEach(item => {
          item.val = this.$pub.objToStr(
            item.attr_value,
            "、",
            "attr_value_name"
          );
        });
        this.tro = res;
      });
    },
    onGetdata(data) {
      this.courses = data;
    },
    getComment() {
      this.$http
        .post(`/api/app/teacher/comment`, {
          teacher_id: this.teacher_id,
          page: 1,
          limit: 2
        })
        .then(res => {
          console.log("++++", res);
          this.tag_list = res.tag;
        });
    },
    collTeacher() {
      this.$http
        .get(`/api/app/teacher/collect/${this.teacher_id}`)
        .then(res => {
          window.console.log("shahs",this.$toast)
          this.$toast({
            message: res.flag == 1 ? "已关注" : "已取消",
            type: "success",
            duration: 1000,
            onClose: () => {
              this.getTeacher();
            }
          });
        });
    }
  },
  created() {
    this.getInfo();
    this.getTeacher();
    this.getComment();
    if (this.$store.state.app) {
      setTimeout(() => {
        this.$pub.appAction("setAppStatusBarColor", {
          color: "#FF63B6FE"
        });
      }, 100);
    }
  }
};
</script>

<style lang="scss" scoped>
.teacher-page {
  min-height: 100vh;
  background: #f0f2f5;
  padding-bottom: 120px;
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
  width: 710px;
  padding: 0 30px;
  background: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  .ti-base {
    height: 152px;
    display: flex;
    align-items: center;
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
    button {
      width: 124px;
      height: 56px;
      background: rgba(235, 238, 254, 1);
      border-radius: 31px;
      font-size: 26px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(65, 105, 255, 1);
      color: $theme_color;
      border: 0;
      span {
        margin-left: 5px;
      }
    }
    .has-collect {
      font-size: 30px;
      color: #b7b7b7;
    }
  }
  .ti-label {
    padding-bottom: 30px;
    span {
      display: inline-block;
      width: 144px;
      height: 48px;
      line-height: 48px;
      background: rgba(255, 228, 211, 1);
      border-radius: 24px;
      font-size: 24px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(234, 122, 47, 1);
      margin-right: 20px;
      margin-bottom: 20px;
      text-align: center;
      overflow: hidden;
      &:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
}
.t-title {
  font-size: 30px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(38, 38, 38, 1);
  padding: 30px 0;
}
.com-box {
  margin-top: 20px;
  background: #fff;
}
.teacher-tro {
  padding: 0 30px;
  li {
    display: flex;
    // justify-content: space-between;
    line-height: 80px;
    font-size: 26px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(140, 140, 140, 1);
    padding-top: 20px;
    span {
      margin-left: 10px;
      margin-right: 40px;
    }
    font {
      // max-width: 400px;
      padding-top: 10px;
      line-height: 60px;
      flex: 1;
    }
  }
}
.evaluate-item {
  margin: 0 20px;
  padding: 30px 0;
  position: relative;
  .evaluate-label {
    padding: 0 40px 10px 20px;
    height: 60px;
    overflow: hidden;
    span {
      font-size: 24px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(234, 122, 47, 1);
      display: inline-block;
      width: 180px;
      height: 50px;
      border: 1px solid rgba(234, 122, 47, 1);
      border-radius: 4px;
      margin-right: 25px;
      margin-bottom: 16px;
      line-height: 50px;
      text-align: center;
      border-radius: 6px;
      overflow: hidden;
    }
  }
  .label-active {
    height: auto;
  }
  i {
    position: absolute;
    right: 20px;
    top: 34px;
    width: 36px;
    height: 36px;
    background: url("../../../assets/images/icon-drop.png") no-repeat;
    background-size: 100% 100%;
  }
  i.active {
    background: url("../../../assets/images/icon-up.png") no-repeat;
    background-size: 100% 100%;
  }
}
</style>
