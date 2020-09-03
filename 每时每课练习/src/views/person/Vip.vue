<template>
  <div class="vip" style="position: relative;">
    <Header :title="title"></Header>
      	<router-link v-if="is_xieyi" :to="{name: 'protocol_01',query:{id:3}}" class="header_top">服务协议</router-link>
      	<router-link v-if="is_xieyi" :to="{name: 'protocol_02',query:{id:3}}" class="header_top2">使用说明</router-link>
    <div class="top" v-if="'is_vip' in userInfo && vipList.length">
      <div v-if="userInfo.is_vip" class="box-vip">
        <div class="part1"></div>
        <div class="part2"></div>
        <div class="board">
          <img :src="userInfo.avatar" />
          <div class="info">
            <p class="name">{{userInfo.nickname}}</p>
            <p class="note">到期时间：{{userInfo.vip.vip_end_at | fomartTime('yyyy.MM.dd')}}</p>
          </div>
          <div class="corner">VIP会员</div>
        </div>
      </div>
      <div v-else class="box-novip">
        <img :src="userInfo.avatar" />
        <div class="info">
          <p class="name">{{userInfo.nickname}}</p>
          <p class="note">开通会员免费学习</p>
        </div>
      </div>
    </div>
    <div class="bottom" v-if="vipList.length">
      <p>
        <span class="tag1">购买会员</span>
        <span class="tag2">购买会员后可免费观看会员课程</span>
      </p>
      <div class="vip-items">
        <div
          class="vip-item"
          :class="{select: selectIdx == index}"
          v-for="(item, index) in vipList"
          :key="index"
          @click="onVipItem(index)"
        >
          <p class="name">{{item.name}}</p>
          <p class="price">
            <img class="price-ico" :src="$store.state.config.price_ico" />
            <span>{{item.price | toFixPrice}}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="btn" v-if="vipList.length" @click.stop="onPay">立即支付</div>
    <Empty :empty_type="empty_type" v-if="!vipList.length" style="margin-top:150px;"></Empty>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Empty from "@/components/Empty";
export default {
  name: "vip",
  components: {
    Header,
    Empty
  },
  data() {
    return {
    	is_xieyi:false,
      title: {
        name: ""
      },
      userInfo: {},
      vipList: [],
      selectIdx: 0,
      empty_type: {
        name: "当前暂无会员，敬请期待哦~",
        img: require("@/assets/images/icon-diamond.png"),
        style: {
          width: "148px",
          height: "130px"
        }
      }
    };
  },
  computed: {
    app() {
      return this.$store.state.app;
    }
  },
  created() {
    this.requestUserInfo();
    this.requestVipList();
    if (this.app == "ios") {
    	this.is_xieyi=true;
    }
  },
  methods: {
    // on event
    onVipItem(index) {
      this.selectIdx = index;
    },
    onPay() {
      if (!this.vipList.length) {
        this.$toast("暂无会员可购买");
        return;
      }
      this.$confirm('您确定购买此会员吗？', '提示', {
	  confirmButtonText: '确定',
	  cancelButtonText: '取消',
	  type: 'warning',
	  confirmButtonClass:'btn_primary'
		}).then(() => {
		//确定购买	
			const vip = this.vipList[this.selectIdx];
      vip &&
        this.$http
          .post("/api/app/order/downOrder", {
            shop_id: vip.id,
            type: 14
          })
          .then(data => {
            if(data.type==1){
             this.$confirm(data.msg, '提示', {
			          confirmButtonText: '去充值',
			          cancelButtonText: '取消',
			          type: 'warning',
			          confirmButtonClass:'btn_primary'
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
              return;
            }
            this.$toast('购买成功')
            setTimeout(() => {
              if (this.$store.state.app) {
                this.$pub.appAction("VIPPayOk");
                return;
              }
              this.$router.go(-1)             
            }, 1000);

            // this.$router.push({
            //   name: "Pay",
            //   query: {
            //     order_number: data.order_number,
            //     order_price: data.order_price,
            //     type: "14"
            //   }
            // });
          });
			//确定购买
		}).catch(() => {
		 return false;       
		});
    },
    // request
    requestUserInfo() {
      this.$http.get("/api/app/userInfo").then(data => {
        this.userInfo = data;
        // test code
        // this.userInfo.is_vip = 1
        this.title.name = this.userInfo.is_vip ? "会员" : "开通会员";
      });
    },
    requestVipList() {
      this.$http.get("/api/app/vip/grade").then(data => {
        this.vipList = data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.vip {
  @extend %default-bg;
  .top {
    position: relative;
    .box-vip {
      .part1 {
        height: 116px;
        background-color: #fff;
      }
      .part2 {
        height: 80px;
      }
      .board {
        width: 688px;
        height: 182px;
        background: url("~@/assets/images/bg-vip-board.png") no-repeat center;
        background-size: 100% 100%;
        position: absolute;
        left: 50%;
        top: 30px;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        img {
          width: 102px;
          height: 102px;
          border-radius: 50%;
          margin-left: 30px;
        }
        .info {
          margin-left: 20px;
          line-height: 42px;
          .name {
            font-size: 28px;
            font-weight: 500;
            color: #fff;
          }
          .note {
            font-size: 24px;
            color: #825f28;
          }
        }
        .corner {
          width: 116px;
          height: 44px;
          background: url("~@/assets/images/tag-vip-corner.png") no-repeat
            center;
          background-size: 100% 100%;
          font-size: 24px;
          font-weight: 500;
          color: #8b6127;
          line-height: 44px;
          text-align: center;
          position: absolute;
          top: 0;
          right: 0;
        }
      }
    }
    .box-novip {
      border-top: 1px solid #f5f5f5;
      height: 146px;
      background-color: #fff;
      display: flex;
      align-items: center;
      padding: 0 30px;
      position: relative;
      img {
        width: 86px;
        height: 86px;
        border-radius: 50%;
      }
      .info {
        margin-left: 20px;
        line-height: 42px;
        .name {
          font-size: 28px;
          font-weight: 500;
          color: #595959;
        }
        .note {
          font-size: 24px;
          color: #8c8c8c;
        }
      }
    }
  }
  .bottom {
    padding: 60px 30px;
    .tag1 {
      font-size: 30px;
      font-weight: 500;
      color: #595959;
    }
    .tag2 {
      margin-left: 20px;
      font-size: 24px;
      color: #8c8c8c;
    }
    .vip-items {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      align-content: space-between;
      padding-top: 40px;
      .vip-item {
        width: 200px;
        height: 220px;
        border-radius: 16px;
        border: 2px solid #d9d9d9;
        background-color: #fff;
        margin-bottom: 20px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .name {
          font-size: 26px;
          font-weight: 600;
          color: #595959;
          margin-bottom: 20px;
          line-height: 30px;
        }
        .price {
          font-size: 56px;
          color: #d5a322;
          .price-ico {
            width: 28px;
            margin-right: 3px;
          }
        }
      }
      .select {
        border: 2px solid #e6c37f;
        background-color: #f9f0d9;
      }
      &:after {
        content: "";
        width: 200px;
      }
    }
  }
  .btn {
    width: 690px;
    height: 88px;
    background: linear-gradient(
      90deg,
      rgba(234, 198, 135, 1) 0%,
      rgba(200, 174, 132, 1) 100%
    );
    border-radius: 44px;
    font-size: 34px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 88px;
    text-align: center;
    position: fixed;
    left: 50%;
    bottom: 60px;
    transform: translateX(-50%);
    z-index: 999;
  }
}
.header_top{position: absolute; top:0px; right: 10px; z-index: 1000; color:#333; font-size: 24px; height: 80px; line-height:80px;}
.header_top2{position: absolute; top:150px; right: 50px; z-index: 1000; color:#333; font-size: 24px; height: 80px; line-height:80px;}
</style>