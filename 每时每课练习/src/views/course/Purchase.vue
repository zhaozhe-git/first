<template>
  <div class="purchase-page">
    <my-header :title="title" />
    <div class="purchase-info">
      <div class="pi-title" :class="{'pi-title-bg': info.is_has_coupon}">
        <span>{{info.title}}</span>
        <font>{{info.price | toFixPrice}}</font>
      </div>
      <p
        v-if="$pub.showDuration(type)"
        class="pi-time"
      >{{info.start_play | fomartTime('MM月dd日 hh:mm')}}~{{info.end_play | fomartTime('MM月dd日 hh:mm')}}</p>
      <p class="pi-teacher">授课老师：{{info.teacher_name}}</p>
    </div>
    <van-cell
      title="优惠券"
      :is-link="coupons.length > 1 "
      :value="checked_coupon.coupon_id ? `满 ${checked_coupon.full_reduction/100} 减 ${checked_coupon.discounted_price/100}`: '无可用'"
      @click="showModel"
    />
    <div class="pi-price">
      <p>
        <span>商品金额</span>
        <font>
        	<img :src="config.price_ico" class="price_img">
        	{{info.price | toFixPrice}}</font>
      </p>
      <p>
        <span>优惠券金额</span>
        <span>
        	<img :src="config.price_ico" class="price_img">
        	{{checked_coupon.discounted_price | toFixPrice}}</span>
      </p>
      <p>
        <span>合计</span>
        <span class="order-price">
        	<img :src="config.price_ico" class="price_img">
        	{{order_price | toFixPrice}}</span>
      </p>
    </div>
    <div class="price-btn">
      <p class="default">实付价格</p>
      <img class="price_img" :src="$store.state.config.price_ico" />
      <p class="price">{{order_price | toFixPrice}}</p>
      <van-button @click="onSubmit">提交订单</van-button>
    </div>
    <!--
    	<van-submit-bar :price="order_price" label="实付金额" button-text="提交订单" @submit="onSubmit" />
    -->
    <coupon ref="coupon" :couponList="coupons" comType="purchase" @userCoupon="userCoupon"></coupon>
  </div>
</template>


<script>
import coupon from "@/components/Coupon";
import myHeader from "@/components/Header";
import { mapState } from "vuex";
export default {
  name: "Purchase",
  components: {
    coupon,
    myHeader
  },
  data() {
    return {
      title: {
        name: "确认订单"
      },
      id: this.$route.query.id,
      type: this.$route.query.type,
      info: {},
      checked_coupon: {},
      coupons: [],
      order_price: 0
    };
  },
  computed: mapState(["config"]),
  methods: {
    getShopInfo() {
      this.$http
        .post(`/api/app/order/shopInfo`, {
          shop_id: this.id,
          type: this.type
        })
        .then(res => {
        	if(res.type==2)
        	{
        		this.$toast({message:res.msg});
        		this.$router.push({
			        name: "Record"
			      });
        		return false;
        	}
          this.info = res.info;
          this.order_price = res.info.order_price;
          this.checked_coupon = res.info.checked_coupon;
          if (this.checked_coupon.coupon_id) this.getCouponList();
        });
    },
    getCouponList() {
      this.$http
        .post(`/api/app/userCouponWithGoods`, {
          shop_id: this.id,
          type: this.type
        })
        .then(res => {
          this.coupons = res;
        });
    },
    userCoupon(id) {
      this.$http
        .post(`/api/app/order/selectCoupon`, {
          shop_id: this.id,
          coupon_id: id
        })
        .then(res => {
          this.order_price = res.order_price;
          this.checked_coupon = res.checked_coupon;
        });
    },
    showModel() {
      if (this.coupons.length > 1) {
        this.$refs.coupon.showModel();
      }
    },
    onSubmit() {
      this.$http
        .post(`/api/app/order/downOrder`, {
          shop_id: this.id,
          type: this.type,
          user_coupon_id: this.checked_coupon.coupon_id
        })
        .then(res => {
          if (res.is_zero_buy) {
            this.$pub.ToOrder(this.type);
          } else {
            if(res.type==1)//学习币不足
            {
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
            }
            else//成功
            {
            	if (this.$store.state.app) {
			         this.$pub.appAction("payok",{
                 shop_id: this.id
               });
			         }
            	this.$pub.ToOrder(this.type);
            }
            /*
            this.$router.replace({
              name: "Pay",
              query: {
                order_number: res.order_number,
                order_price: this.order_price,
                shop_id: this.id,
                type: this.type
              }
            }); 
            */
          }
        });
    }
  },
  created() {
    this.getShopInfo();
  }
};
</script>

<style lang="scss" scoped>
.purchase-page {
  @extend %default-bg;
  background: #f0f2f5;
  .purchase-info {
    width: 710px;
    background: rgba(255, 255, 255, 1);
    border-radius: 8px;
    margin: 30px auto;
    padding: 30px;
    box-sizing: border-box;
    .pi-title {
      display: flex;
      justify-content: space-between;
      line-height: 60px;
      span {
        font-size: 28px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
      }
      font {
        font-size: 30px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(140, 140, 140, 1);
        width: 100px;
        flex: none;
      }
    }
    .pi-title-bg {
      padding-left: 50px;
      background: url("../../assets/theme-img/icon-coupon.png") no-repeat left
        center;
      background-size: 36px 28px;
    }
    .pi-time {
      font-size: 24px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
      line-height: 44px;
    }
    .pi-teacher {
      font-size: 24px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(183, 183, 183, 1);
      line-height: 44px;
    }
  }
  .p-coupon {
    height: 96px;
    background: rgba(255, 255, 255, 1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    span {
      font-size: 26px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(89, 89, 89, 1);
    }
    font {
      font-size: 26px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(140, 140, 140, 1);
    }
    font.active {
      padding-right: 36px;
      background: url("../../assets/images/icon-go.png") no-repeat right center;
      background-size: 20px 30px;
    }
  }
  .pi-price {
    margin-top: 30px;
    background: #fff;
    padding: 30px;
    p {
      font-size: 26px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(140, 140, 140, 1);
      line-height: 44px;
      display: flex;
      justify-content: space-between;
      .order-price {
        font-size: 30px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(224, 32, 32, 1);
      }
    }
  }
}
.price_img{width:20px;}
.price-btn {
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  p.default {
    font-family: PingFangSC-Medium;
    color: #8c8c8c;
    font-size: 20px;
    padding: 10px 4px 0 48px;
  }
  p.price {
    color: #e02020;
    font-size: 46px;
    flex: 1;
    margin-left: 2px;
  }
  img {
    width: 20px;
    margin-top: 10px;
  }
  button {
    width: 270px;
    height: 108px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    font-size: 36px;
    text-align: center;
    line-height: 108px;
    background: $theme_color;
    border: 0;
  }
}
</style>
