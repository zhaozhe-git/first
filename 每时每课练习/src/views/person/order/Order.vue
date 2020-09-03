<template>
  <div class="order">
    <Header :title="title"></Header>
    <van-tabs @change="onTabChange">
      <van-tab v-for="(item, index) in tabs" :key="index" :title="item.name"></van-tab>
    </van-tabs>
    <Empty v-if="!dataList.length" :empty_type="{name: '暂无订单'}"></Empty>
    <List
      ref="list"
      url="/api/app/myOrder"
      method="post"
      :params="params"
      :on-getdata="onGetdata"
      :showText="dataList.length > 0"
    >
      <OrderList slot="item" :list="dataList" :orderType="params.order_type" @onReset="onReset"></OrderList>
    </List>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Empty from '@/components/Empty'
import List from "@/components/List";
import OrderList from "./OrderList";
import { OrderType } from '@/util/enums'
export default {
  name: "order",
  components: {
    Header,
    Empty,
    List,
    OrderList
  },
  data() {
    return {
      title: {
        name: OrderType.getValue(this.$route.query.order_type) || '我的订单',
        backUrl: "Person"
      },
      tabs: [
        { name: "全部订单", order_status: 0 },
        { name: "待支付", order_status: 1 },
        { name: "已完成", order_status: 2 },
        { name: "已取消", order_status: 3 }
      ],
      params: {
        order_status: 0,
        order_type: this.$route.query.order_type
      },
      dataList: []
    };
  },
  methods: {
    // on event
    onTabChange(index) {
      this.params.order_status = this.tabs[index].order_status;
      this.$refs.list.reset();
    },
    onGetdata(data) {
      this.dataList = data;
    },
    onReset() {
      this.$refs.list.reset();
    }
    // other
  }
};
</script>

<style lang="scss" scoped>
// .order {
// }
</style>