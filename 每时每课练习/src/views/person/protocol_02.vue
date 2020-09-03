<template>
  <div class="protocol_02">
    <Header :title="title"></Header>
   <div class="xieyi">
   	<p align="center"><strong>会员功能使用说明</strong><strong> </strong></p>
<ul>
  <li>1、会员在会员资格有效期内，可以以会员折扣享受每时每课平台提供的会员课程。 </li>
  <li>2、会员在会员资格有效期内，可享受每时每课为会员提供的多种专享的增值服务，具体内容将在会员页面显示。 </li>
</ul>
   </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Empty from "@/components/Empty";
export default {
  name: "protocol_02",
  components: {
    Header
  },
  data() {
    return {
     title: {
        name: "会员功能使用说明"
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