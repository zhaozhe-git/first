<template>
  <div class="my-currency">
    <Header :title="{name: '我的余额'}">
      <div slot="right-sum" @click="showDetail">余额明细</div>
    </Header>
    <div class="member-gold">
      <p class="topbar">我的余额
        <span class="gold-num">{{goldNumber| toFixPrice}} 学习币</span>
      </p>
      <div class="pay">
        <ul>
          <li v-for="(item,index) in goldList" :key="index" :class="paySelect==item.id?'pay-selected':''" @click="paySelect=item.id;payPrice=item.rmb;"> 
            <p>{{item.coin | toFixPrice}}学习币</p>
            <p>￥ {{item.rmb | toFixPrice}}</p>
          </li>
        </ul>
      </div>
      <p class="title">充值说明</p>
      <div class="explain ">
        {{agreement}}
      </div>
 
      <button class="topay" @click="toPay" :style='!this.paySelect?"background-color:#ccc":""'>立即充值</button>
      
      <van-popup v-model="payShow" position="bottom">
        <p class="title">支付方式</p>
        <div class="methods">
            <p @click="methodSelect=1"><input type="radio" v-model="methodSelect" value="1"><span class="wxpay">微信</span></p>
            <!-- <p v-if="!is_weixin" @click="methodSelect=0"><input type="radio" v-model="methodSelect" value="0"><span class="alipay">支付宝</span></p>  -->
            <p @click="methodSelect=0"><input type="radio" v-model="methodSelect" value="0"><span class="alipay alipay1">支付宝</span></p> 
        </div>
      </van-popup>
      <div class="detailBox" v-if="detailShow">
        <div class="details">
          <p class="tit">余额明细
            <i @click="detailShow = false"></i>
          </p>
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <van-cell
                v-for="item in goldDetails"
                :key="item"
              >
                  <div class="left">
                    <p class="shop_name">{{item.shop_name}}</p>
                    <p class="remaining_sum">{{item.remaining_sum | toFixPrice}}</p>
                  </div>
                  <div class="right">
                    <p class="change_price" :style="(item.change_type-1)?'color:#000':''">{{changetype[item.change_type-1]}}{{item.change_price	| toFixPrice}}</p>
                    <p class="created_at">{{item.created_at | fomartTime('yyyy-MM-dd')}}</p>
                  </div>
              </van-cell>
            </van-list>
        </div>
      </div>  
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Vue from 'vue';
import { Popup,List } from 'vant';
import wx from "weixin-js-sdk";

Vue.use(List);
Vue.use(Popup);

export default {
  name: 'my-currency',
  components: {
    Header
  },
  data() {
    return {
      changetype:['+','-'],
      currency: 0,
      goldNumber:0,
      goldList:[],
      goldDetails:[ {
                "remark": "赠送虚拟币",
                "change_price": 1000,
                "change_type": 1,
                "type": 4,
                "remaining_sum": 2000,
                "created_at": 1566449068,
                "shop_name": "赠送虚拟币"
            },],
      changetype:['+','-'],
      type:[
        '充值',
        '消费',
        '退款',
      ],
      paySelect:0,
      methodSelect:-1,
      codeShow:false,
      payPrice:0,
      detailShow:false,
      payShow:false,
      agreement:'',
      read:[],
      loading: false,
      finished: false,
      page:1,
      is_weixin:false,
    }
  },
  created() {
    if (this.$pub.isWeiXin()){
        this.is_weixin=true;
      }
    // this.requestData(),
    this.getInfo();
  let code = this.$route.query.code
    if(code){
      let data = {
          type:"wx",
          coin_id:this.$route.query.state,
          code:code,
        }
        var _this = this
          this.$http.post('/api/app/pay',data).then(res=>{
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
                  // alert(JSON.stringify(_this))
                  _this.$router.go(-1);
			        	
                  // window.location.href = "https://wap.365msmk.com/my-currency"
                }
              });
            });
            wx.error(res => {
              _this.$toast(res);
            });
          });
    }
  },
  mounted(){
    
  },
  methods: {
    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        this.page ++ ;
        this.$http.get('/api/app/coin/item',{page:this.page}).then(res =>{
          res.list.forEach(i => {
            this.goldDetails.push(i)
          })

        });       
        // 加载状态结束
        this.loading = false;
        // 数据全部加载完成
          this.finished = true;
      }, 500);
    },
    async showDetail(){
      let goldDetail = await this.$http.get('/api/app/coin/item',{page:this.page});
      let _this = this
      this.goldDetails = goldDetail.list;
      this.detailShow=true 
    },
    toPay(){
      if(!this.paySelect){
       return
      }
      this.read
      if(!this.payShow){
        this.payShow = true
      }else{
        this.getCode()
      }
    },
    creatQrCode(url) {
      var qrcode = new QRCode(url)
    },
    async getInfo(){
      let goldNum = await this.$http.get('/api/app/coinBalance');
      this.goldNumber = goldNum.balance;

      
      let data = await this.$http.get('/api/app/coin/coinRank');
      this.agreement = data.coinInfo.agreement
      this.goldList = data.list
    },
    async getCode(){
      if(this.paySelect&&this.methodSelect!=-1){
        let data = {
          type:parseInt(this.methodSelect)?'wx':'ali',
          coin_id:this.paySelect,
        }



        //微信内用支付宝支付
        if(this.is_weixin && !this.methodSelect){
          this.$http.post('/api/app/pay',data).then(res=>{
            _AP.pay('https://openapi.alipay.com/gateway.do?'+res.response);
          });
          return;
        }

       // 获取code
       if(this.$pub.isWeiXin() && !this.code){
        this.$store.commit("SET_COINID", this.paySelect)
        this.$http.get(`/api/app/pay/wxUrl`, {coin_id:this.paySelect})
        .then(data => {
          window.location.href = data.url;
          return;
        })
       }else{
          if(this.code){
            data.code = this.code
          }
            // alert(JSON.stringify(data))

          this.$http.post('/api/app/pay',data).then(res=>{
            alert(JSON.stringify(res))
            return;
            if(parseInt(this.methodSelect)){
              window.location.href = res.response.mweb_url;
            }else{
              const div = document.createElement("div");
              div.innerHTML = res.response;
              document.body.appendChild(div);
              document.forms.alipay_submit.submit();
            }
          });
       }
       
      }
    },

  }
}
</script>

<style lang="scss">
.member-gold{
  background-color: #fff;
  width: 100%;
  min-height: 90vh;
  .topbar{
    width: 100%;  
    font-size:30px;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(51,51,51,1);
    line-height:115px;
    border-bottom: 1px solid rgba(244,244,244,1);
    padding: 0 25px 0 30px;
    box-sizing: border-box;
    .gold-num{
      font-size:30px;
      font-family:PingFang SC;
      font-weight:500;
      color:rgba(220,105,42,1);
      margin-left: 23px;
    }
    .to-detail{
      font-size:12px;
      font-family:PingFang SC;
      font-weight:500;
      color:rgba(220,105,42,1);
      margin-left: 23px;
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .title{
    position: relative;
    padding-left: 11px;
    padding: 0 25px 0 41px;
    font-size:30px;
    font-family:PingFang SC;
    font-weight:bold;
    color:rgba(51,51,51,1);
    line-height:90px;
    &::before{
      content: '';
      position: absolute;
      left: 0;
      top: calc(50% - 8px);
      width:3px;
      height:16px;
      background:rgba(220,105,42,1);
      border-radius:2px;
    }
  }
  .pay{
    ul{
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      overflow: hidden;
      padding: 30px 25px 0 30px;
      background-color: #eee;
      li{
        width:100%;
        height:116px;
        margin-right: 25px;
        background-color:rgba(255,255,255,1);
        border:2px solid rgba(238,238,238,1);
        border-radius:25px;
        margin-bottom: 30px;
        padding: 0 36px;
        background-repeat: no-repeat;
        background-position: right bottom;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        box-sizing: border-box;
        &.pay-selected{
          background:rgba(252,237,226,1);
          border:2px solid rgba(235,97,0,1);
          box-shadow:0px 5px 5px 0px rgba(235,97,0,0.75);
          border-radius:16px;
        }
        p{
          text-align: center;
          line-height:116px;
          &:nth-child(1){
            font-size:28px;
            font-family:PingFang SC;
            font-weight:400;
            color:rgba(51,51,51,1);
          }
          &:nth-child(2){
            font-size:26px;
            font-family:PingFang SC;
            font-weight:500;
            color:rgba(233,0,0,1);
          }
        }
        &:nth-child(6n){
          margin-right: 0;
        }
      }
    }
  }
  .explain{
    position: relative;
    padding-left: 40px;
    font-size:24px;
    font-family:PingFang SC;
    font-weight:300;
    color:rgba(102,102,102,1);
    line-height:36px;
  }
  .check-read{
    width:28px;
    height:28px;
    margin: 10px 10px 0 30px;
  }
  .read{
    font-size:24px;
    font-family:PingFang SC;
    font-weight:bold;
    color:rgba(51,51,51,1);
    line-height:28px;
    b{
      color:rgba(52, 120, 246, 1);
    }
  }
  .topay{
    width: 100%;
    height: 98px;
    margin: 0;
    padding: 0;
    left: 0;
    border: 0;
    position: fixed;
    bottom: 0;
    background-color: rgba(235, 97, 0, 1);
    font-size:32px;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(255,255,255,1);
    color: #fff;
    z-index: 2100;
  }
  .methods{
    display:flex;
    flex-direction: column;
    .alipay,.wxpay{
      font-size:32px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:44px;
      &::before{
        content: '';
        display: inline-block;
        margin-left: 8px;
        margin-right: 20px;
        width: 46px;
        height: 46px;
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
      }
    }
    .alipay:before{
      background-image: url('../../../assets/images/icon_ali_pay.png')
    }
    .wxpay:before{
      background-image: url('../../../assets/images/icon_wx_pay.png')
    }
  }
  .code{
    margin: 50px auto 0;
    text-align: center;
    white-space: nowrap;    
    div{
      display: inline-block;
      width: 30px;
      height: 30px;
      background-size: 100%;
      background-position: center;
      background-repeat: no-repeat;
    }
    .ico-ail{
      background-image: url('../../../assets/images/icon_ali_pay.png')
    }
    .ico-wx{
      background-image: url('../../../assets/images/icon_wx_pay.png')
    }
    span{
      margin-left: 12px;
      font-size:16px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:30px;
    }
    img{
      display: block;
      margin: 20px auto 0;
    }
  }
  .detailBox{
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
    .details{
      width:100%;
      height:100%;
      position: absolute;
      top: 0 ;
      left: 0 ;
      background:rgba(255,255,255,1);
      border-radius:5px;
      text-align: center;
      overflow-x:hidden;
      float:left;
      overflow-y:scroll;
      .tit{
        font-size:36px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:90px;
        border-bottom: 1px solid #eee;
        position: relative;
        i{
            display: block;
            position: absolute;
            left: 25px;
            top: 50%;
            margin-top: -15px;
            width: 19px;
            height: 35px;
            background-image: url('../../../assets/images/return.png');
            background-position: center;
            background-size: 100%;
            background-repeat: no-repeat;
            cursor: pointer;
        }
      }
      .van-cell{
        height: 115px;
        width: 100%;
      }
      .van-cell__value{
        width: 100%;
        height: 115px;
        padding: 15px 30px;
        box-sizing: border-box;
        .left{
          text-align: left;
          float: left;
          width: 66%;
          .shop_name{
            font-size:30px;
            font-family:PingFang SC;
            font-weight:400;
            color:rgba(51,51,51,1);
            line-height:43px;
            max-width: 100%;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
          }
          .remaining_sum{
            font-size:24px;
            font-family:PingFang SC;
            font-weight:400;
            color:rgba(153,153,153,1);
            line-height:43px;
          }
        }
        .right{
          float: right;
          text-align: right;
          width: 33%;
          .change_price{
            font-size:30px;
            font-family:PingFang SC;
            font-weight:500;
            color:rgba(230,33,41,1);
            line-height:43px;
          }
          .created_at{
            font-size:24px;
            font-family:PingFang SC;
            font-weight:400;
            color:rgba(153,153,153,1);
            line-height:43px;
          }
        }
      }
      button{
        width:150px;
        height:50px;
        background:rgba(220,105,42,1);
        border-radius:5px;
        font-size:18px;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(255,255,255,1);
        line-height:50px;
        margin:123px auto 50px;
        border: 0;
        outline: none;
        cursor: pointer;
      }
    }
  }
  #qrcode{
    text-align: center;
  }
  .van-popup{
    height: 408px;

  }
}
.my-currency {
  @extend %default-bg;
  .content{
    margin-top: 1px;    
  }
}
</style>