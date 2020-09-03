<template>
  <div class="coupon" style="position: relative;">
  	<router-link v-if="is_xieyi" :to="{name: 'protocol_03',query:{id:3}}" class="header_top">使用说明</router-link>
    <Header :title="{name: '我的优惠券'}"></Header>
    <van-tabs @change="onTabChange">
      <van-tab v-for="(item, index) in tabs" :key="index" :title="item.name"></van-tab>
    </van-tabs>
    <Empty :empty_type="{name: '暂无优惠券'}" v-if="list.length == 0" style="margin-top:150px;"></Empty>
    <div v-else class="content">
      <div
        class="item"
        :class="{used: item.status == 1, pastdue: item.status == 2, gray: item.status == 1 || item.status == 2}"
        v-for="(item, index) in list"
        :key="index"
      >
        <p class="part1">
          <img class="price-ico" :src="$store.state.config.price_ico" />
          <span class="price">{{item.discounted_price | toFixPrice}}</span>
          <span class="full-tag">满{{item.full_reduction | toFixPrice}}可用</span>
        </p>
        <p
          class="part2"
          v-if="item.dis_type==1"
        >{{item.scope_type==1?'全部课程':item.scope_type==2?'指定分类':'指定课程'}}可用</p>
        <p
          class="part2"
          v-else-if="item.dis_type==4"
        >{{item.scope_type==1?'全部约课':item.scope_type==2?'指定讲师':''}}</p>
        <p class="part3">有效期：{{item.valid_start}} - {{item.valid_end}}</p>
        <p class="btn" @click="onUse(item)">立即使用</p>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Empty from "@/components/Empty";
export default {
  name: "coupon",
  components: {
    Header,
    Empty
  },
  data() {
    return {
    	is_xieyi:false,
      tabs: [
        { name: "未使用", status: 0 },
        { name: "已使用", status: 1 },
        { name: "已过期", status: 2 }
      ],
      params: {
        status: 0
      },
      list: []
    };
  },
  computed: {
    app() {
      return this.$store.state.app;
    }
  },
  created() {
    this.requestList();
    if (this.app == "ios") {
    	this.is_xieyi=true;
    }
  },
  methods: {
    // on event
    onTabChange(index) {
      this.params.status = this.tabs[index].status;
      this.requestList();
    },
    onUse(item) {
      if (item.status == 1 || item.status == 2) {
        this.$toast({
          message: "优惠券不可用",
          duration: 1500
        });
        return;
      }
      if (this.$store.state.app && item.dis_type == 1) {
        this.$pub.appAction("homePage", { index: 1 });
      } else {
        this.$router.push({
          name: item.dis_type == 1 ? "Course" : "Oto"
        });
      }
    },
    // request
    requestList() {
      this.$http.get("/api/app/coupon", this.params).then(data => {
        this.list = data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.coupon {
  .header {
    border-bottom: 1px solid #f5f5f5;
  }
  .content {
    padding: 30px 20px;
    .item {
      background-color: #ffc9bc;
      padding: 20px;
      margin-bottom: 40px;
      border-radius: 10px;
      color: #e14641;
      position: relative;
      .part1 {
        .price-ico {
          width: 26px;
        }
        .price {
          font-size: 60px;
        }
        .full-tag {
          margin-left: 10px;
          font-size: 34px;
        }
      }
      .part2 {
        margin-top: 10px;
        font-size: 22px;
      }
      .part3 {
        margin-top: 10px;
        font-size: 22px;
      }
      .btn {
        font-size: 30px;
        position: absolute;
        top: 50%;
        right: 40px;
        transform: translateY(-50%);
        line-height: 100px;
      }
      &::before {
        content: "";
        display: block;
        height: 100%;
        border-left: 2px dashed #e14641;
        position: absolute;
        top: 0;
        right: 214px;
      }
    }
    .gray {
      color: #8c8c8c;
      &::before {
        border-left: 2px dashed #8c8c8c;
      }
    }
    .used {
      background: url("~@/assets/images/tag-used.png") no-repeat right bottom
        #d9d9d9;
      background-size: 90px 90px;
    }
    .pastdue {
      background: url("~@/assets/images/tag-pastdue.png") no-repeat right bottom
        #d9d9d9;
      background-size: 90px 90px;
    }
  }
}
.header_top{position: absolute; top:0px; right: 10px; z-index: 1000; color:#333; font-size:24px; height: 80px; line-height:80px;}
</style>