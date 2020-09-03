<template>
  <div class="protocol_03">
    <Header :title="title"></Header>
   <div class="xieyi">
   	<p align="center"><strong>优惠券使用说明</strong><strong> </strong></p>
  <strong>Q1</strong><strong>：如何合区优惠券？</strong><strong> </strong><br>
  每时每课会在各种活动中向用户发放优惠券，请您注意留意每时每课的各种活动。 <br>
  <strong>Q2</strong><strong>：如何使用优惠券？</strong><strong> </strong><br>
  在订单支付页面可选择优惠券进行支付。 <br>
  <strong>Q3</strong><strong>：优惠券使用过程中有什么限制？</strong><strong> </strong><br>
  1.优惠券只能用于指定的产品类型，如&rdquo;特色课程优惠券&rdquo;只能用户购买特色课程相关的产品时使用。 <br>
  2.每张订单只能使用一张优惠券。 <br>
  3.每张优惠券只能被使用一次，被使用后不退还。 <br>
  4.优惠券不兑现金、不开发票、不设找零、不能赠送。 <br>
  5.优惠券需要在有效期内使用，过期作废。 
<p align="left"><a name="_GoBack"></a>&nbsp;</p>
   </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Empty from "@/components/Empty";
export default {
  name: "protocol_03",
  components: {
    Header
    
  },
  data() {
    return {
     title: {
        name: "优惠券使用说明"
      }
    };
  },
  created() {
  },
  methods: {
    
  }
};
</script>

<style lang="css" scoped>
.xieyi{
	width: 100%; box-sizing: border-box; font-size: 24px; line-height:50px; padding:10px; border-top: 1px solid #dedede;
}
.xieyi strong{font-weight: bold;}
</style>