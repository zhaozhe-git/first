<template>
  <div class="course-detail">
    <div class="header">
      <header>
        <span class="back" @click="$router.go(-1)">
          <img src="@/assets/images/return.png" />
        </span>
        <div class="h-title">
          <h3 v-if="top < 30">课程详情</h3>
          <p v-else>
            <span :class="{'active':active=='tro'}" @click="scrollTo('tro')">课程介绍</span>
            <span :class="{'active':active=='list'}" @click="scrollTo('list')">课程大纲</span>
            <span :class="{'active':active=='com'}" @click="scrollTo('com')">课程评价</span>
          </p>
        </div>
        <p class="right-tabs">
          <span class="cao" @click="share">
            <img src="../../assets/images/share.png" alt />
          </span>
        </p>
      </header>
    </div>
    <div class="cd-body" v-show="detail.title">
      <div class="cd-info">
        <p class="info-title">{{detail.title}}</p>
        <i class="info-collect" :class="{'ic-active':detail.is_collect}" @click="collect"></i>
        <!-- 非面授 -->
        <p class="info-price" v-if="!detail.is_free">
          <img class="price-ico" :src="$store.state.config.price_ico" />
          <font>{{detail.price | toFixPrice}}</font>
          <img
            v-if="detail.underlined_price"
            class="price-ico"
            :src="$store.state.config.price_ico"
          />
          <font
            v-if="detail.underlined_price"
            class="underline"
          >{{detail.underlined_price | toFixPrice}}</font>
        </p>
        <p class="info-price cd-free" v-else>免费</p>
        <div v-if="detail.course_type != 7">
          <p class="info-com">共{{detail.total_periods}}课时 | {{detail.sales_num}}人已报名</p>
          <p
            v-if="$pub.showPlayType(detail.course_type)"
            class="info-com"
          >开课时间：{{detail.start_play_date | fomartTime('yyyy.MM.dd hh:mm')}} - {{detail.end_play_date | fomartTime('yyyy.MM.dd hh:mm')}}</p>
        </div>
        <!-- 面授 -->
        <div style="padding-top: 10px;" v-else>
          <p
            class="info-com"
            v-if="detail.store_num"
          >报名上限：{{detail.store_num}}人 | 剩余名额：{{detail.stock}}</p>
          <p class="info-com">报名截止时间：{{detail.enter_end_date | fomartTime('yyyy.MM.dd hh:mm')}}</p>
          <p
            class="info-com"
          >开课时间：{{detail.start_play_date | fomartTime('yyyy.MM.dd hh:mm')}} - {{detail.end_play_date | fomartTime('yyyy.MM.dd hh:mm')}}</p>
          <p class="info-com">开课地点：{{detail.province_name + detail.district_name +detail.address}}</p>
        </div>
      </div>
      <div class="cd-actives" v-if="couponList.length || detail.is_vip_course">
        <p>活动：</p>
        <section>
          <div class="actives-item" v-if="couponList.length" @click="getCoupon">
            <span>优惠</span>
            <span>
              <em>领取优惠券最多可减</em>
              <img class="price-ico" :src="$store.state.config.price_ico" />
              <i>{{max_price | toFixPrice(0)}}</i>
            </span>
            <font>领取</font>
          </div>
          <div class="actives-item" v-if="detail.is_vip_course" @click="goVip">
            <span>VIP</span>
            <span
              v-if="detail.is_vip_user"
            >您的会员到期日为：{{detail.vip_user_end | fomartTime('yyyy.MM.dd')}}</span>
            <span v-else>免费观看</span>
            <font>{{detail.is_vip_user?'续费':'开通'}}</font>
          </div>
        </section>
      </div>
      <div class="cd-teachers com-style" v-if="teachers.length">
        <p class="cd-title">教学团队</p>
        <ul>
          <li @click="goTeacher(item.teacher_id)" v-for="(item,index) in teachers" :key="index">
            <img :src="item.teacher_avatar" />
            <span>{{item.teacher_name}}</span>
          </li>
        </ul>
      </div>
      <div id="tro" class="cd-tro com-style">
        <p class="cd-title">课程介绍</p>
        <div class="cd-details" v-html="detail.course_details"></div>
      </div>
      <div id="list" class="cd-list com-style">
        <p class="cd-title">课程大纲</p>
        <charpter v-if="detail.course_type != 9" :charpters="list" :detail="detail"></charpter>
        <course-item :course="courses" :itemStyle="true" v-if="detail.course_type == 9"></course-item>
      </div>
      <div id="com" class="cd-comment com-style">
        <p class="cd-title">课程评论</p>
        <commentItem></commentItem>
      </div>
    </div>
    <van-button
      class="course-btn"
      :class="{'vip-icon': state == 2}"
      @click="submit"
    >{{state_name[state]}}</van-button>
    <!-- 分享 -->
    <coupon ref="coupon" :couponList="couponList" @setCoupon="setCoupon"></coupon>
    <shareBox ref="share"></shareBox>
  </div>
</template>

<script>
import shareBox from "@/components/ShareBox";
import commentItem from "@/components/CommentItem";
import charpter from "@/components/Charpter";
import courseItem from "@/components/CourseItem";
import coupon from "@/components/Coupon";
export default {
  name: "CourseDetail",
  components: {
    shareBox,
    commentItem,
    charpter,
    courseItem,
    coupon
  },
  data() {
    return {
      top: 0,
      id: "",
      detail: {},
      teachers: [],
      couponList: [],
      courses: [],
      list: [],
      qrimg: "",
      active: "",
      state: 0,
      state_name: ["立即报名", "立即学习", "加入学习"],
      max_price: 0
    };
  },
  methods: {
    getDetail() {
      this.$http.get(`/api/app/courseInfo/basis_id=${this.id}`).then(res => {
        this.detail = res.info;
        this.couponList = res.couponList;
        this.teachers = res.teachers;
        if (this.couponList.length) {
          let max_price = 0;
          res.couponList.forEach(item => {
            if (max_price < item.discounted_price) {
              max_price = item.discounted_price;
            }
          });
          this.max_price = max_price;
        }
        if (res.info.course_type == 9) {
          this.getSysCourse();
        }
        if (res.info.is_buy || res.info.is_join_study) {
          this.state = 1;
        } else {
          if (res.info.is_vip_course && res.info.is_vip_user) {
            this.state = 2;
          }
        }
      });
    },
    getCharpter() {
      this.$http
        .post(`/api/app/courseChapter`, {
          id: this.id
        })
        .then(res => {
          this.list = res;
        });
    },
    getSysCourse() {
      this.$http.post(`/api/app/sysCourseList`, { id: this.id }).then(res => {
        this.courses = res;
      });
    },
    share() {
      this.$refs.share.showModel();
    },
    collect() {
      if (!this.detail.is_collect) {
        this.$http
          .post(`/api/app/collect`, {
            course_basis_id: this.id,
            type: 1
          })
          .then(() => {
            this.$toast({
              message: "收藏成功",
              type: "success",
              duration: 800,
              onClose: () => {
                this.getDetail();
              }
            });
          });
      } else {
        this.$http
          .put(`/api/app/collect/cancel/${this.detail.collect_id}/1`)
          .then(() => {
            this.$toast({
              message: "取消收藏",
              duration: 800,
              onClose: () => {
                this.getDetail();
              }
            });
          });
      }
    },
    getCoupon() {
      this.$refs.coupon.showModel();
    },
    setCoupon(index) {
      this.couponList[index].is_can_get = 0;
    },
    goVip() {
      this.$router.push({
        name: "Vip"
      });
    },
    goTeacher(id) {
      this.$router.push({
        name: "Teacher",
        query: {
          id: id
        }
      });
    },
    handleScroll() {
      this.top =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      let a_h = window.$("#tro").offset().top - 45;
      let l_h = window.$("#list").offset().top - 45;
      let r_h = window.$("#com").offset().top - 45;
      if (this.top <= a_h) {
        this.active = "tro";
      } else if (this.top <= l_h) {
        this.active = "list";
      } else if (this.top >= r_h) {
        this.active = "com";
      }
    },
    scrollTo(name) {
      this.active = name;
      let h = window.$(`#${name}`).offset().top - 45;
      window.$("html,body").animate({ scrollTop: h }, 500);
    },
    submit() {
      if (this.$pub.checkLogin()) {
        if (this.state == 0) {
          //购买 免费课
          if (this.detail.is_free) {
            this.$http
              .post(`/api/app/order/downOrder`, {
                shop_id: this.id,
                type: this.detail.course_type
              })
              .then(() => {
                this.$toast({
                  message: "成功",
                  type: "success",
                  duration: 1000,
                  onClose: () => {
                    this.getDetail();
                  }
                });
              });
          } else {
            // 收费
            if (
              this.detail.stock == 0 &&
              this.detail.store_num > 0 &&
              (this.detail.course_type == 7 || this.detail.course_type == 3)
            ) {
              this.$toast({
                message: "你来晚了哦,名额已经没有了~",
                duration: 1500
              });
              return;
            }
            this.$router.push({
              name: "Purchase",
              query: {
                id: this.id,
                type: this.detail.course_type
              }
            });
          }
        } else if (this.state == 2) {
          // 加入学习
          this.$http
            .post(`/api/app/joinStudy`, {
              course_basis_id: this.id,
              order_id: 0,
              join_from: 1,
              course_type: this.detail.course_type
            })
            .then(() => {
              this.$toast({
                message: "成功",
                type: "success",
                duration: 1000,
                onClose: () => {
                  this.getDetail();
                }
              });
            });
        } else {
          // 立即学习
          this.$router.push({
            name: "MyStudyDetail",
            query: {
              course_id:
                this.detail.course_type == 9 ? this.courses[0].id : this.id
            }
          });
        }
      }
    },
    init() {
      this.id = this.$route.query.id;
      this.getDetail();
      this.getCharpter();
    }
  },
  created() {
    this.init();
  },
  watch: {
    $route(val, old) {
      if (val.query.id != old.query.id) {
        this.init();
      }
    }
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  }
};
</script>

<style lang="scss" scoped>
.course-detail {
  width: 100%;
  overflow: hidden;
}
.vip-icon::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  background: url("../../assets/images/vip-use-btn.png") no-repeat;
  background-size: 100% 100%;
  width: 88px;
  height: 88px;
}
.header {
  height: 88px;
  line-height: 88px;
  border-bottom: 1px solid #f0f2f5;
  header {
    @extend %flex-center;
    height: 88px;
    width: 100%;
    box-sizing: border-box;
    position: fixed;
    z-index: 9;
    background: #fff;
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
  .h-title {
    flex: 2;
    h3 {
      text-align: center;
      font-size: 36px;
      color: #595959;
    }
    p {
      display: flex;
      span {
        flex: 1;
        text-align: center;
        font-size: 30px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(140, 140, 140, 1);
      }
      span.active {
        color: #333;
        font-weight: 500;
        font-size: 32px;
      }
    }
  }

  .right-tabs {
    width: 60px;
    display: flex;
    align-items: center;
    height: 100%;
    box-sizing: border-box;
    & span {
      &.cao {
        width: 40px;
        height: 44px;
        padding: 10px;
        img {
          width: 30px;
          height: 34px;
          margin-top: 5px;
          display: block;
        }
      }
    }
  }
}
.cd-body {
  background: #f0f2f5;
  padding-bottom: 100px;
  box-sizing: border-box;
  min-height: 92vh;
}
.cd-info {
  padding: 30px;
  background: #fff;
  position: relative;
  .info-collect {
    position: absolute;
    right: 20px;
    top: 10px;
    width: 50px;
    height: 50px;
    background: url("../../assets/images/collections_grey.png") no-repeat center
      center;
    background-size: 36px 36px;
  }
  .ic-active {
    background: url("../../assets/theme-img/icon-star.png") no-repeat center
      center;
    background-size: 36px 36px;
  }
  .info-title {
    font-size: 32px;
    font-family: PingFangSC-Medium;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    padding-right: 80px;
    line-height: 46px;
  }
  .info-price {
    font-size: 34px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(238, 31, 31, 1);
    line-height: 64px;
    span {
      font-size: 24px;
    }
    .price-ico {
      width: 16px;
      margin: 0 8px;
    }
    .underline {
      font-size: 12px;
      color: #999;
      text-decoration: line-through;
    }
  }
  .cd-free {
    color: $theme_color;
  }
  .info-com {
    font-size: 30px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.45);
    line-height: 60px;
    font {
      &:nth-child(2) {
        padding-left: 12px;
      }
    }
  }
}
.cd-actives {
  display: flex;
  padding: 30px;
  margin-top: 30px;
  background: #fff;
  p {
    width: 80px;
    font-size: 24px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(140, 140, 140, 1);
  }
  section {
    flex: 1;
    .actives-item {
      display: flex;
      align-items: center;
      .price-ico {
        width: 22px;
        margin-left: 5px;
      }
      &:nth-child(1) {
        padding-bottom: 20px;
      }
      span {
        &:first-child {
          width: 70px;
          height: 32px;
          line-height: 32px;
          background: linear-gradient(
            90deg,
            rgba(206, 184, 156, 1) 0%,
            rgba(163, 130, 89, 1) 100%
          );
          border-radius: 6px;
          font-size: 20px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(38, 38, 38, 1);
          text-align: center;
          margin-right: 14px;
        }
        &:nth-child(2) {
          flex: 1;
          font-size: 24px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(89, 89, 89, 1);
          i {
            color: #ea7a2f;
          }
        }
      }
      font {
        font-size: 24px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(140, 140, 140, 1);
        padding-right: 24px;
        background: url("../../assets/images/icon-go.png") no-repeat right
          center;
        background-size: 16px 28px;
      }
    }
  }
}
.cd-title {
  font-size: 30px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  color: rgba(38, 38, 38, 1);
  padding-top: 20px;
}
.com-style {
  margin-top: 30px;
  background: #fff;
  padding: 10px 20px;
}
.cd-teachers {
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 20px 0;
    li {
      padding: 20px 0;
      width: 20%;
      height: 180px;
      display: flex;
      align-items: center;
      flex-direction: column;
      box-sizing: border-box;
      img {
        width: 78px;
        height: 78px;
        border-radius: 50%;
      }
      span {
        padding: 16px 6px 0;
        padding-top: 16px;
        font-size: 24px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(89, 89, 89, 1);
      }
    }
  }
}
.cd-tro {
  .cd-details {
    font-size: 28px;
    padding: 30px 10px;
    /deep/ p {
      width: 100%;
    }
    /deep/ img {
      width: 100% !important;
    }
  }
}
</style>
