<template>
  <div class="my-currency">
    <Header :title="{name: '我的学习币'}">
      <div slot="right-sum" @click="onDetial">明细</div>
    </Header>
    <div class="content">
      <p class="title">总金额</p>
      <p class="price">{{currency | toFixPrice}}</p>
      <!--
      	<p class="btn" @click="onRecharge">立即充值</p>
      -->
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
export default {
  name: 'IosCurrency',
  components: {
    Header
  },
  data() {
    return {
      currency: 0
    }
  },
  created() {
    this.requestData()
    this.$pub.registerWebViewJavascriptBridge(() => {
      this.requestData()
    })
  },
  methods: {
    // on event
    onDetial() {
      this.$router.push({
        name: 'MyCurrencyDetail'
      })
    },
    onRecharge() {
      // this.$router.push({
      //   name: 'MyCurrencyRecharge'
      // })
      this.$pub.InAppPage('MyIntergral')
    },
    // request
    requestData() {
      this.$http.get('/api/app/getIOSCenterInfo').then(data => {
        this.currency = data.integral
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.my-currency {
  @extend %default-bg;
  .content {
    background-color: #fff;
    border-radius: 20px;
    margin: 20px;
    text-align: center;
    padding: 70px 0;
    .title {
      font-size: 26px;
      color: #8c8c8c;
    }
    .price {
      margin-top: 40px;
      font-size: 40px;
      color: #EA7A2F;
    }
    .btn {
      background-color: #EA7A2F;
      width: 176px;
      height: 56px;
      border-radius: 8px;
      font-size: 26px;
      color: #fff;
      line-height: 56px;
      margin: 60px auto 0 auto;
    }
  }
}
</style>