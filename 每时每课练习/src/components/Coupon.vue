<template>
  <van-action-sheet v-model="show" title="优惠券">
    <ul class="coupon" v-if="couponList">
      <li
        :class="{'is-no-use': item.is_can_get == 0}"
        v-for="(item,index) in couponList"
        :key="index"
      >
        <div class="l-left">
          <p>
            <img class="price-ico" :src="$store.state.config.price_ico" />
            <span>{{item.discounted_price | toFixPrice(0)}}</span>
            <font>满{{item.full_reduction | toFixPrice(0)}}可用</font>
          </p>
          <p>
            <span>{{item.name}}</span>
          </p>
          <p>
            <span v-if="item.valid_type==1">自领取之日起{{item.valid_day}}天内有效</span>
            <span
              v-if="item.valid_type==2"
            >有效至：{{item.valid_start | fomartTime('yyyy.MM.dd')}} - {{item.valid_end | fomartTime('yyyy.MM.dd')}}</span>
          </p>
        </div>
        <div
          v-if="comType == 'course_detail'"
          class="l-right"
          @click="getCoupon(index)"
        >{{item.is_can_get == 0? '无法领取':'立即领取'}}</div>
        <div v-else class="l-right" @click="userCoupon(item.coupon_id)">立即使用</div>
      </li>
    </ul>
  </van-action-sheet>
</template>

<script>
export default {
  data() {
    return {
      show: false
    };
  },
  props: {
    couponList: {
      type: Array
    },
    comType: {
      type: String,
      default: "course_detail"
    }
  },
  methods: {
    showModel() {
      this.show = true;
    },
    getCoupon(index) {
      this.$http
        .get(`/api/app/userGetCoupon/${this.couponList[index].id}`)
        .then(res => {
          if (res.is_continue_get == 0) {
            this.$emit("setCoupon", index);
          }
          this.show = false;
          this.$toast({
            message: "成功",
            type: "success",
            duration: 1000
          });
        });
    },
    userCoupon(id) {
      this.show = false;
      this.$emit("userCoupon", id);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss" scoped>
.coupon {
  max-height: 620px;
  overflow-y: scroll;
  padding: 20px;
  li {
    height: 162px;
    margin-bottom: 42px;
    background: rgba(255, 201, 188, 1);
    border-radius: 10px;
    display: flex;
    color: #e14641;
    .l-left {
      flex: 1;
      height: 100%;
      padding-left: 30px;
      box-sizing: border-box;
      p {
        &:nth-child(1) {
          font-size: 56px;
          padding-top: 24px;
          .price-ico {
            width: 26px;
            margin-right: 3px;
          }
          font {
            font-size: 34px;
          }
        }
        &:nth-child(2),
        &:nth-child(3) {
          font-weight: 500;
          font-size: 22px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          line-height: 34px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .l-right {
      width: 208px;
      font-size: 30px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      line-height: 162px;
      height: 162px;
      text-align: center;
      flex: none;
      border-left: 1px dashed #e14641;
    }
  }
  li.is-no-use {
    color: #8c8c8c;
    background: #d9d9d9;
  }
}
.closeX {
  width: 20px;
  height: 20px;
  background-image: url("../assets/images/close.png");
  background-size: 100%;
}
.bg {
  background-color: rgba(0, 0, 0, 0);
}
</style>
