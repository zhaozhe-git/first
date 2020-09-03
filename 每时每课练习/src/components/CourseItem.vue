<template>
  <div class="index-item-page">
    <div
      v-for="(item,index) in course"
      :key="index"
      class="ii-item"
      :class="{'ii-item-teahcer':itemStyle}"
      @click="goPage(item)"
    >
      <p class="ii-title">
        <span v-if="item.is_has_coupon"></span>
        <font>{{item.title}}</font>
      </p>
      <div class="ii-time">
        <p
          class="after-icon"
          v-if="!item.has_buy && !noTime.includes(item.course_type)"
        >{{item.start_play_date | fomartTime('MM月dd日 hh:mm')}} ~ {{item.end_play_date | fomartTime('MM月dd日 hh:mm')}}</p>
        <p>共{{item.total_periods}}课时</p>
      </div>
      <div class="ii-teacher">
        <div
          class="teacher-item"
          v-show="idx < 3"
          v-for="(it,idx) in item.teachers_list"
          :key="idx"
        >
          <img :src="it.teacher_avatar" alt />
          <font>{{it.teacher_name}}</font>
        </div>
      </div>
      <p class="ii-info">
        <span class="person" v-if="item.course_type != 4">{{item.sales_num}}人已报名</span>
        <span class="person" v-else>{{item.brows_num}}人已报名</span>
        <font class="through" v-if="item.underlined_price">
          <img class="price-ico-mini" :src="$store.state.config.price_ico" />
          {{item.underlined_price | toFixPrice}}
        </font>
        <font class="price" v-if="item.price">
          <img class="price-ico" :src="$store.state.config.price_ico" />
          {{item.price | toFixPrice}}
        </font>
        <font class="free" v-else>免费</font>
      </p>
      <i class="has-buy" v-if="item.has_buy"></i>
      <div class="vip" v-if="item.is_vip">会员</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "IndexItem",
  props: {
    course: {
      type: Array
    },
    itemStyle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      List: [],
      noTime: [5, 8, 9, 10]
    };
  },
  methods: {
    async goPage(item) {
      // 公开课
      if (item.course_type == 4) {
        //   公开
        let info = await this.$http.get(
          `/api/app/getPcRoomCode/course_id=${item.id}/chapter_id=0`
        );
        window.location.href = info.chapterInfo.web_url;
      } else {
        this.$pub.InAppPage("CourseDetail", {
          id: item.id,
          courseType: item.course_type
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.index-item-page {
  padding: 30px;
  .ii-item-teahcer {
    box-shadow: 0px 3px 7px 0px rgba(207, 207, 207, 0.35);
  }
  .ii-item {
    background: rgba(255, 255, 255, 1);
    border-radius: 10px;
    padding: 0 28px;
    margin-bottom: 30px;
    position: relative;
    .ii-title {
      padding-top: 30px;
      span {
        width: 26px;
        height: 35px;
        display: inline-block;
        background: url("../assets/theme-img/icon-coupon.png") no-repeat left
          top;
        background-size: 26px 26px;
        margin-right: 10px;
        vertical-align: text-bottom;
      }
      font {
        font-size: 32px;
        font-family: PingFangSC-Medium;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
    }
    .ii-time {
      display: flex;
      align-items: center;
      p {
        height: 60px;
        line-height: 60px;
        display: inline-block;
        font-size: 24px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        padding-right: 34px;
        position: relative;
      }
      .after-icon {
        padding-left: 40px;
        background: url("../assets/images/icon-time.png") no-repeat left center;
        background-size: 28px 28px;
        &::after {
          position: absolute;
          content: "";
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 1px;
          height: 22px;
          background: rgba(0, 0, 0, 0.45);
        }
      }
    }
    .ii-teacher {
      height: 130px;
      display: flex;
      .teacher-item {
        display: flex;
        height: 100%;
        align-items: center;
        img {
          width: 54px;
          height: 54px;
          border-radius: 50%;
        }
        font {
          font-size: 24px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.45);
          margin-left: 17px;
          margin-right: 35px;
        }
      }
    }
    .ii-info {
      border-top: 1px solid #f5f5f5;
      height: 88px;
      line-height: 88px;
      display: flex;
      font-size: 26px;
      font-family: PingFangSC-Regular;
      span {
        padding-right: 20px;
        color: rgba(0, 0, 0, 0.45);
      }
      .person {
        flex: 1;
      }
      .through {
        text-decoration: line-through;
        color: #999999;
        margin-right: 10px;
      }
      .price-ico-mini {
        width: 18px;
      }
      .price {
        color: #ee1f1f;
        font-size: 32px;
      }
      .price-ico {
        width: 24px;
      }
      .free {
        color: #44a426;
        font-size: 32px;
      }
    }
    .has-buy {
      position: absolute;
      right: 30px;
      top: 130px;
      background: url("../assets/images/has-buy.png") no-repeat;
      background-size: 100% 100%;
      width: 118px;
      height: 96px;
    }
    .vip {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 24px;
      color: #262626;
      text-align: center;
      line-height: 40px;
      width: 76px;
      height: 40px;
      background: linear-gradient(
        90deg,
        rgba(206, 184, 156, 1) 0%,
        rgba(163, 130, 89, 1) 100%
      );
      border-radius: 0px 0px 4px 4px;
    }
  }
}
</style>
