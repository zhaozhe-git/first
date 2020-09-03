<template>
  <div class="order-list">
    <div class="item" v-for="(item, index) in lists" :key="index" @click="onClick(item)">
      <div class="title">
        <p class="order-number">订单编号：{{item.order_number}}</p>
        <p class="order-status">{{item.order_status_name}}</p>
      </div>
      <div class="content">
        <p class="name">{{item.title}}</p>
        <p class="time">时间：{{item.created_at | fomartTime('yyyy.MM.dd hh:mm')}}</p>
        <p class="price">
          <span>实付款：</span>
          <img class="price-ico" :src="$store.state.config.price_ico" />
          <span>{{item.order_price | toFixPrice}}</span>
        </p>
      </div>
      <div class="bottom">
        <div v-if="item.order_status == 1">
          <span class="btn" @click.stop="onCancel(item)">取消订单</span>
          <span class="btn color" @click.stop="onPay(item)">立即支付</span>
        </div>
        <div v-else-if="item.order_status == 2 && orderType == 2">
          <div v-if="item.pay_status == 2">
            <span v-if="!item.is_join_study" class="btn color" @click.stop="onJoinStudy(item)">加入学习</span>
            <span v-if="item.order_price != 0 && item.pay_type != 5" class="btn" @click.stop="onRefund(item)">退款</span>
          </div>
          <div v-else-if="item.pay_status == 3 || item.pay_status == 4" class="refund">退款中</div>
          <div v-else-if="item.pay_status == 6" class="refund">退款失败</div>
        </div>
        <div v-else-if="item.order_status == 3">
          <div v-if="item.pay_status == 5" class="refund">退款成功</div>
          <span v-else class="cancel">已取消</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { OrderStatus } from '@/util/enums'
export default {
  name: 'order-list',
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    orderType: {
      required: true
    }
  },
  data() {
    return {
      event: {
        onReset: 'onReset'
      }
    }
  },
  computed: {
    lists() {
      const ret = this.list
      ret.forEach(i => {
        i.order_status_name = OrderStatus.getValue(i.order_status)
      })
      return ret
    }
  },
  created() { },
  methods: {
    // on event
    onClick(item) {
      this.$router.push({
        name: 'OrderDetail',
        query: {
          order_id: item.id,
          order_type: this.orderType
        }
      })
    },
    onCancel(item) {
      this.$dialog.confirm({
        title: '提示',
        message: '确定要取消订单么？'
      }).then(() => {
        this.$http.post('/api/app/myOrder/cancel', {
          order_id: item.id
        }).then(() => {
          this.$emit(this.event.onReset)
        })
      }).catch(() => { })
    },
    onPay(item) {
      this.$router.push({
        name: 'Pay',
        query: {
          order_price: item.order_price,
          order_number: item.order_number
        }
      })
    },
    onJoinStudy(item) {
      this.$http.post('/api/app/joinStudy', {
        order_id: item.id,
        join_from: 2,
        course_type: item.shop_type
      }).then(() => {
        this.$dialog.alert({
          title: '提示',
          message: '课程成功加入学习列表。您可在“我的学习”中进行课程学习。'
        }).then(() => {
          this.$emit(this.event.onReset)
        })
      })
    },
    onRefund(item) {
      this.$dialog.confirm({
        title: '提示',
        message: '申请退款及具体退款金额需要管理员审核，确认退款么？'
      }).then(() => {
        this.$http.get(`/api/app/myOrder/application/${item.id}`).then(() => {
          this.$emit(this.event.onReset)
        })
      }).catch(() => { })
    },
  }
}
</script>

<style lang="scss" scoped>
.order-list {
  padding: 30px;
  .item {
    background-color: #fff;
    border-radius: 10px;
    padding: 30px 28px;
    margin-bottom: 30px;
    position: relative;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    .title {
      display: flex;
      justify-content: space-between;
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid #f5f5f5;
      .order-number {
        font-size: 24px;
        color: #595959;
      }
      .order-status {
        font-size: 24px;
        color: #ea7a2f;
      }
    }
    .content {
      margin-bottom: 10px;
      .name {
        font-size: 26px;
        color: #595959;
        margin-bottom: 20px;
      }
      .time {
        font-size: 24px;
        color: #8c8c8c;
        margin-bottom: 15px;
      }
      .price {
        font-size: 24px;
        color: #8c8c8c;
        span:nth-of-type(2) {
          font-size: 32px;
          color: #595959;
        }
        .price-ico {
          width: 24px;
          margin-right: 3px;
        }
      }
    }
    .bottom {
      text-align: right;
      .btn {
        display: inline-block;
        width: 152px;
        height: 56px;
        border-radius: 28px;
        border: 1px solid #d9d9d9;
        font-size: 24px;
        color: rgba(89, 89, 89, 1);
        line-height: 56px;
        text-align: center;
        margin-left: 20px;
      }
      .color {
        border: 1px solid #ea7a2f;
        color: #ea7a2f;
      }
      .refund {
        font-size: 24px;
        color: #e02020;
      }
      .cancel {
        font-size: 24px;
        color: #8c8c8c;
      }
    }
  }
}
</style>