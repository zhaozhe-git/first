<template>
  <div class="order-detail">
    <header>
      <div class="top">
        <span class="back" @click="$router.go(-1)">
          <img src="@/assets/images/white-return.png" />
        </span>
        <h3>订单详情</h3>
      </div>
      <div class="bottom">{{data.order_status_name}}</div>
    </header>
    <div class="content">
      <p class="title">{{data.shop_name}}</p>
      <div class="info">
        <p>
          <span>订单编号：</span>
          <span>{{data.order_number}}</span>
        </p>
        <p>
          <span>下单时间：</span>
          <span>{{data.created_at | fomartTime('yyyy.MM.dd hh:mm')}}</span>
        </p>
        <p>
          <span>支付方式：</span>
          <span>{{data.pay_type_name}}</span>
        </p>
      </div>
      <div class="price">
        <p>
          <span>商品原价：</span>
          <span>
            <img class="price-ico" :src="$store.state.config.price_ico" />
            {{data.original_price | toFixPrice}}
          </span>
        </p>
        <p v-if="data.shop_type != 14">
          <span>优惠券：</span>
          <span>
            -
            <img class="price-ico" :src="$store.state.config.price_ico" />
            {{data.coupon_discount | toFixPrice}}
          </span>
        </p>
        <p class="real-price">
          <span>实付金额：</span>
          <span class="flag-price">
            <img class="price-ico" :src="$store.state.config.price_ico" />
            {{data.order_price | toFixPrice}}
          </span>
        </p>
      </div>
      <div class="btns">
        <div v-if="data.order_status == 1">
          <span class="btn" @click="onCancel">取消订单</span>
          <span class="btn color" @click="onPay">立即支付</span>
        </div>
        <div v-else-if="data.order_status == 2 && data.pay_status == 2 && orderType == 2">
          <span v-if="!data.is_join_study" class="btn color" @click="onJoinStudy">加入学习</span>
          <span v-if="data.order_price != 0 && data.pay_type != 5" class="btn" @click="onRefund">退款</span>
        </div>
      </div>
    </div>
    <div v-if="orderType == 2">
      <div
        class="refund"
        v-if="data.order_status == 2 && (data.pay_status == 3 || data.pay_status == 4)"
      >
        <div class="rf-top">
          <p>
            <span>退款中</span>
          </p>
        </div>
      </div>
      <div v-else-if="data.order_status == 2">
        <div class="refund" v-if="data.pay_status == 6">
          <div class="rf-top">
            <p>
              <span>退款失败</span>
            </p>
          </div>
          <div class="rf-bottom">
            <p>
              <span>失败原因：</span>
              <span>{{data.err_msg || '--'}}</span>
            </p>
          </div>
        </div>
        <div class="refund" v-else-if="data.pay_status == 2 && data.refund_status == 3">
          <div class="rf-top">
            <p>
              <span>退款被驳回</span>
            </p>
          </div>
          <div class="rf-bottom">
            <p>
              <span>时间：</span>
              <span>{{data.refund_refuse_time | fomartTime('yyyy.MM.dd hh:mm')}}</span>
            </p>
            <p>
              <span>原因：</span>
              <span>{{data.remark || '--'}}</span>
            </p>
          </div>
        </div>
      </div>
      <div v-else-if="data.order_status == 3">
        <div class="refund" v-if="data.pay_status == 5">
          <div class="rf-top">
            <p>
              <span>退款成功</span>
            </p>
          </div>
          <div class="rf-bottom">
            <p>
              <span>退款金额：</span>
              <span>
                <img class="price-ico" :src="$store.state.config.price_ico" />
                {{data.send_back_fee | toFixPrice}}
              </span>
            </p>
            <p>
              <span>备注：</span>
              <span>{{data.remark || '--'}}</span>
            </p>
          </div>
        </div>
        <div v-else class="refund">
          <div class="rf-top">
            <p>
              <span>已取消</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { OrderStatus, PayType } from "@/util/enums";
export default {
  name: "order-detail",
  components: {},
  data() {
    return {
      order_id: this.$route.query.order_id,
      data: {},
      orderType: this.$route.query.order_type
    };
  },
  created() {
    this.requestDetail();
  },
  methods: {
    // on event
    onCancel() {
      this.$dialog
        .confirm({
          title: "提示",
          message: "确定要取消订单么？"
        })
        .then(() => {
          this.$http
            .post("/api/app/myOrder/cancel", {
              order_id: this.data.id
            })
            .then(() => {
              this.requestDetail();
            });
        })
        .catch(() => {});
    },
    onPay() {
      this.$router.push({
        name: "Pay",
        query: {
          order_price: this.data.order_price,
          order_number: this.data.order_number
        }
      });
    },
    onJoinStudy() {
      this.$http
        .post("/api/app/joinStudy", {
          order_id: this.data.id,
          join_from: 2,
          course_type: this.data.shop_type
        })
        .then(() => {
          this.$dialog
            .alert({
              title: "提示",
              message: "课程成功加入学习列表。您可在“我的学习”中进行课程学习。"
            })
            .then(() => {
              this.requestDetail();
            });
        });
    },
    onRefund() {
      this.$dialog
        .confirm({
          title: "提示",
          message: "申请退款及具体退款金额需要管理员审核，确认退款么？"
        })
        .then(() => {
          this.$http
            .get(`/api/app/myOrder/application/${this.data.id}`)
            .then(() => {
              this.requestDetail();
            });
        })
        .catch(() => {});
    },
    // request
    requestDetail() {
      this.$http
        .post("/api/app/myOrder/detail", {
          order_id: this.order_id
        })
        .then(data => {
          // data.order_status = 3
          // data.is_join_study = 1
          // data.pay_status = 6
          this.data = data;
          this.data.order_status_name = OrderStatus.getValue(
            this.data.order_status
          );
          this.data.pay_type_name =
            PayType.getValue(this.data.pay_type) || "--";
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.order-detail {
  @extend %default-bg;
  header {
    height: 224px;
    background: linear-gradient(
      180deg,
      rgba(99, 183, 254, 1) 0%,
      rgba(78, 125, 227, 1) 100%
    );
    .top {
      height: 88px;
      position: relative;
      .back {
        display: block;
        width: 90px;
        height: 100%;
        float: left;
        position: relative;
        img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      h3 {
        font-size: 36px;
        color: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .bottom {
      text-align: center;
      font-size: 28px;
      color: #fff;
      margin-top: 60px;
    }
  }
  .content {
    margin: 26px 20px;
    padding: 30px;
    border-radius: 15px;
    background-color: #fff;
    .title {
      font-size: 28px;
      line-height: 42px;
      color: #262626;
    }
    .info {
      font-size: 24px;
      color: #8c8c8c;
      border-top: 1px solid #f5f5f5;
      margin-top: 30px;
      padding-top: 30px;
    }
    .price {
      font-size: 24px;
      color: #8c8c8c;
      padding-top: 30px;
      border-top: 1px solid #f5f5f5;
      margin-top: 30px;
      .price-ico {
        width: 20px;
      }
      .real-price {
        font-size: 28px;
        color: #595959;
        .flag-price {
          color: #e02020;
        }
        .price-ico {
          width: 24px;
        }
      }
    }
    .btns {
      text-align: right;
      .btn {
        display: inline-block;
        width: 152px;
        height: 56px;
        border-radius: 28px;
        border: 1px solid #d9d9d9;
        font-size: 24px;
        color: #595959;
        line-height: 56px;
        text-align: center;
        margin-top: 30px;
        margin-left: 20px;
      }
      .color {
        border: 1px solid #ea7a2f;
        color: #ea7a2f;
      }
    }
  }
  .refund {
    margin: 26px 20px;
    padding: 30px;
    border-radius: 15px;
    background-color: #fff;
    .rf-top {
      font-size: 28px;
      color: #595959;
    }
    .rf-bottom {
      font-size: 24px;
      color: #8c8c8c;
      border-top: 1px solid #f5f5f5;
      margin-top: 30px;
      padding-top: 30px;
      .price-ico {
        width: 20px;
      }
    }
  }
  p {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>