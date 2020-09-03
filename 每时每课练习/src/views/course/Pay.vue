<template>
  <div class="pay-page">
    <myHeader :title="title"></myHeader>
    <div class="pay-info">
      <p>订单号：{{order_number}}</p>
      <p>
        应付金额：
        <img class="price-ico" :src="$store.state.config.price_ico" />
        {{order_price | toFixPrice}}
      </p>
    </div>
    <van-radio-group v-model="radio">
      <van-cell-group v-if="this.app=='ios'&&!isOnline">
        <van-cell title="金币支付" clickable>
          <i class="pay-other" slot="icon" />
          <van-radio slot="right-icon" name="1" :checked-color="$theme_color" />
        </van-cell>
      </van-cell-group>
      <van-cell-group v-else>
        <van-cell title="微信支付" clickable @click="radio = '1'">
          <i class="pay-wx" slot="icon" />
          <van-radio slot="right-icon" name="1" :checked-color="$theme_color" />
        </van-cell>
        <van-cell title="支付宝支付" clickable @click="radio = '2'" v-if="is_weixin==true">
          <i class="pay-img" slot="icon" />
          <van-radio slot="right-icon" name="2" :checked-color="$theme_color" />
        </van-cell>
      </van-cell-group>
    </van-radio-group>
    <div class="price-btn">
      <p class="default">实付价格</p>
      <img class="price-ico-mini" :src="$store.state.config.price_ico" />
      <p class="price">{{order_price | toFixPrice}}</p>
      <van-button @click="onPay">提交订单</van-button>
    </div>
  </div>
</template>

<script>
import myHeader from "@/components/Header";
import wx from "weixin-js-sdk";
export default {
  name: "Pay",
  components: {
    myHeader
  },
  data() {
    return {
    	is_weixin:false,
      title: {
        name: "订单支付"
      },
      order_price: this.$route.query.order_price / 1,
      order_number: this.$route.query.order_number,
      type: this.$route.query.type,
      radio: "1",
      isOnline: false
    };
  },
  computed: {
    app() {
      return this.$store.state.app;
    }
  },
  methods: {
    onPay() {
      //选择支付方式
      if (this.app) {
        let redirct_path = "order?order_type=";
        if (this.type == "1") {
          redirct_path += "1";
        } else if (this.type == "14") {
          redirct_path += "3";
        } else {
          redirct_path += "2";
        }
        let params = {
          orderNumber: this.order_number,
          shop_id: this.$route.query.shop_id,
          redirct_path
        };
        if (this.app == "ios" && !this.isOnline) {
          //金币支付
          params.payType = "money";
          params.price = this.order_price;
        } else {
          if (this.radio == "1") {
            params.payType = "wx";
          } else {
            params.payType = "ali";
          }
        }
        this.$pub.appAction("pay", params);
      } else {
        if (this.radio == "2") {
          this.Alipay();
        } else {
          if (this.$pub.isWeiXin()) {
            this.getCode();
          } else {
            this.wxPay();
          }
        }
      }
    },
    getCode() {
      // 获取code
      this.$http
        .get(`/api/app/pay/wxUrl`, { order_number: this.order_number })
        .then(data => {
          window.location.href = data.url;
        });
    },
    // 微信支付
    wxPay() {
      this.$http
        .post(`/api/app/pay`, {
          type: "wx",
          order_number: this.order_number
        })
        .then(res => {
          window.location.href = res.response.mweb_url;
        });
    },
    // 支付宝
    Alipay() {
      this.$http
        .post(`/api/app/pay`, {
          type: "ali",
          order_number: this.order_number
        })
        .then(res => {
          const div = document.createElement("div");
          div.innerHTML = res.response;
          document.body.appendChild(div);
          document.forms.alipay_submit.submit();
        });
    }
  },
  created() {
    if (this.$pub.isWeiXin()) {
      this.is_weixin = true;
      if (window.location.href.search("code") < 0) {
        return;
      }
      let code = window.location.href.split("code=")[1].split("&")[0];
      if (code) {
        this.$http
          .post(`/api/app/pay`, {
            type: "wx",
            order_number: this.order_number,
            code
          })
          .then(res => {
            const data = res.response;
            wx.config({
              appId: data.appId,
              timestamp: data.timeStamp, // 必填，生成签名的时间戳
              nonceStr: data.nonceStr, // 必填，生成签名的随机串
              signature: data.paySign, // 必填，签名
              jsApiList: ["chooseWXPay"] // 必填，需要使用的JS接口列表
            });
            wx.ready(() => {
              wx.chooseWXPay({
                timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: data.paySign, // 支付签名
                success: () => {
                  this.$pub.ToOrder(this.type);
                }
              });
            });
            wx.error(res => {
              this.$toast(res);
            });
          });
      }
    }
    if (this.app) {
      this.$pub.registerWebViewJavascriptBridge(() => {
        this.$pub.ToOrder(this.type);
      });
      if (this.app == "ios") {
        this.$http.get("/api/app/vcOpen").then(data => {
          this.isOnline = data.open;
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.pay-page {
  @extend %default-bg;
  .pay-info {
    width: 710px;
    height: 200px;
    background: rgba(255, 255, 255, 1);
    border-radius: 8px;
    text-align: center;
    margin: 30px auto;
    padding: 40px;
    box-sizing: border-box;
    line-height: 60px;
    p {
      &:nth-child(1) {
        font-size: 28px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(89, 89, 89, 1);
      }
      &:nth-child(2) {
        font-size: 34px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(89, 89, 89, 1);
      }
    }
  }
  .pay-wx {
    width: 60px;
    height: 100%;
    background: url("../../assets/images/pay-wx.png") no-repeat left center;
    background-size: 48px 38px;
  }
  .pay-other {
    width: 60px;
    height: 100%;
    background: url("../../assets/images/pay-other.png") no-repeat left center;
    background-size: 34px 44px;
  }
  .pay-img {
    width: 60px;
    height: 100%;
    background: url("../../assets/images/pay-zhifubao.png") no-repeat left
      center;
    background-size: 38px 38px;
  }
  /deep/ .van-radio__icon .van-icon {
    font-size: 24px;
  }
}
.price-ico {
  width: 24px;
}
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
