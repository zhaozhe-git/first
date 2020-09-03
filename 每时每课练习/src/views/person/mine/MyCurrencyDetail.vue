<template>
  <div class="my-currency-detail">
    <Header :title="{name: '余额明细'}"></Header>
    <Empty :empty_type="{name: '暂无余额明细'}" v-if="list.length == 0" style="margin-top:150px;"></Empty>
    <div class="content">
      <List
        ref="list"
        url="/api/app/coin/item"
        method="get"
        :on-formatter="onFormatter"
        :on-getdata="onGetdata"
        :showText="list.length > 0"
      >
        <div slot="item" class="item" v-for="(item, index) in list" :key="index">
          <div class="info">
            <p class="title">{{item.shop_name}}</p>
            <p class="detail" style="margin-top:10px">余额：{{item.remaining_sum | toFixPrice}}</p>
          </div>
          <div class="price">
            <p style="text-align:right" :style="(item.change_type-1)?'color:#000;':''">{{(item.change_type-1)?'-':'+'}} {{item.change_price | toFixPrice}}</p>
            <p style="margin-top:10px">{{item.created_at | fomartTime('yyyy-MM-dd')}}</p>

          </div>
          
        </div>
      </List>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Empty from "@/components/Empty";
import List from "@/components/List";
export default {
  name: "my-currency-detail",
  components: {
    Header,
    Empty,
    List
  },
  data() {
    return {
      icon_course: require("@/assets/images/icon-msg-course.png"),
      icon_recharge: require("@/assets/images/icon-msg-recharge.png"),
      icon_vip: require("@/assets/images/icon-msg-vip.png"),
      list: []
    };
  },
  created() {},
  methods: {
    // on event
    onFormatter(rows) {
      rows.forEach(i => {
        if (i.shop_type == 11) {
          i.showIcon = this.icon_recharge;
          i.showTitle = "充值";
        } else if (i.shop_type == 14) {
          i.showIcon = this.icon_vip;
          i.showTitle = "购买会员";
        } else {
          i.showIcon = this.icon_course;
          i.showTitle = "购买课程";
        }
      });
    },
    onGetdata(data) {
      this.list = data;
      // this.$dialog.alert({
      //   title: "提示",
      //   message: JSON.stringify(data)
      // });
    }
  }
};
</script>

<style lang="scss" scoped>
.my-currency-detail {
  .header {
    border-bottom: 1px solid #f5f5f5;
  }
  .content {
    padding: 0 30px;
    .item {
      border-bottom: 1px solid #f5f5f5;
      padding: 30px 0;
      display: flex;
      align-items: center;
      position: relative;
      img {
        width: 88px;
        height: 88px;
      }
      .info {
        margin-left: 20px;
        line-height: 50px;
        .title {
          font-size:30px;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(51,51,51,1);
          line-height:38px;
        }
        .detail {
          font-size:24px;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(153,153,153,1);
          line-height:38px;
        }
      }
      .price {
        font-size: 30px;
        color: #595959;
        position: absolute;
        top: 50%;
        right: 0px;
        transform: translateY(-50%);
        p{
          &:nth-child(1){
            font-size:30px;
            font-family:PingFang SC;
            font-weight:500;
            color:rgba(230,33,41,1);
            line-height:38px;
          }
          &:nth-child(2){
            font-size:24px;
            font-family:PingFang SC;
            font-weight:400;
            color:rgba(153,153,153,1);
            line-height:38px;
          }
        }
      }
    }
  }
}
</style>