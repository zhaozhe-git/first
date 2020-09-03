<template>
  <div class='member-gold'>
    <p class="topbar">我的余额
      <span class="gold-num">{{goldNumber| price}} 学习币</span>
      <span class="to-detail" @click="detailShow=true">余额明细</span>
    </p>
    <p class="title">充值学习币</p>
    <div class="pay">
      <ul>
        <li v-for="(item,index) in goldList" :key="index" :class="paySelect==item.id?'pay-selected':''" @click="paySelect=item.id;payPrice=item.rmb;getCode()"> 
          <p>{{item.coin | price}}学习币</p>
          <p>￥ {{item.rmb | price}}</p>
        </li>
      </ul>
    </div>
    <div class="explain ">
      {{agreement}}
    </div>
    <p class="title">支付方式</p>
    <div class="methods">
        <p class="alipay" :class="methodSelect==0?'img-selected':''" @click="methodSelect=0;getCode()"></p>
        <p class="wxpay" :class="methodSelect==1?'img-selected':''" @click="methodSelect=1;getCode()"></p>
    </div>
    <div class="code" v-show="codeShow">
      <div class="ico-ail" v-if="!methodSelect"></div>
      <div class="ico-wx" v-if="methodSelect"></div>
      <span>{{methodSelect?'微信':'支付宝'}}扫码，支付{{payPrice | price}}元</span>
      <p id="qrcode" ref="qrCodeUrl"></p>
    </div>
    

    <div class="detailBox" v-if="detailShow">
      <div class="details">
        <p class="tit">余额明细
          <i @click="detailShow = false"></i>
        </p>
        <table border="1" style="text-align:center">
          <tr  style="background:rgba(238,238,238,1)">
            <td>学习币余额</td>
            <td>变更类型</td>
            <td>变更数值</td>
            <td>变更时间</td>
          </tr>
          <tr v-for="(item,index) in goldDetails" :key="index"> 
            <td>{{item.remaining_sum | price}}</td>
            <td>{{type[item.type]}}</td>
            <td>{{changetype[item.changetype]}} {{item.change_price	| price}}</td>
            <td>{{item.created_at}}</td>
          </tr>
        </table>
        <button @click="detailShow = false">确定</button>
      </div>
    </div>
  </div>
</template>
<script>
// import {tsToTime} from '../../../../utils/plugins'
import QRCode from 'qrcodejs2'

export default {
  name: "MemberGold",
  data() {
    return {
      goldNumber:0,
      goldList:[],
      goldDetails:[],
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
      agreement:'',
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    creatQrCode(url) {
      var qrcode = new QRCode(url)
    },
    async getInfo(){
      let goldNum = await this.$http.get('/api/app/coinBalance');
      this.goldNumber = goldNum.balance;
      let goldDetail = await this.$http.get('/api/app/coin/item');
      goldDetail.list.forEach(res => {
        res.created_at = this.$pub.tsToTime(res.created_at)
        
      });
      this.goldDetails = goldDetail.list;
      
      let data = await this.$http.get('/api/app/coin/coinRank');
      this.agreement = data.coinInfo.agreement
      this.goldList = data.list
    },
    async getCode(){
      if(this.paySelect&&this.methodSelect!=-1){
        let data = {
          type:this.methodSelect?'wx':'ali',
          coin_id:this.paySelect,

        }
        let res = await this.$http.post('/api/app/pay',data);
        let dom = document.getElementById("qrcode")
        setTimeout(() => {
          dom.innerHTML = "";
          new QRCode(document.getElementById("qrcode"), res.response.code_url)
          this.codeShow = true
        }, 100);
        
        // this.codeUrl = res.response.code_url
        // console.log(res)
      }
    }
  }
};
</script>
<style lang="scss">
.member-gold{
  background-color: #fff;
  height: 1009px;
  margin-bottom: 100px;
  padding: 0 25px 0 30px;
  .topbar{
    width: 100%;  
    font-size:18px;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(51,51,51,1);
    line-height:75px;
    border-bottom: 1px solid rgba(244,244,244,1);
    .gold-num{
      font-size:16px;
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
    font-size:16px;
    font-family:Adobe Heiti Std;
    font-weight:normal;
    color:rgba(51,51,51,1);
    line-height:72px;
    padding-left: 11px;
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
      overflow: hidden;
      li{
        width:118px;
        height:116px;
        margin-right: 25px;
        background-color:rgba(248,238,232,1);
        border:1px solid rgba(238,238,238,1);
        border-radius:4px;
        margin-bottom: 37px;
        background-repeat: no-repeat;
        background-position: right bottom;
        display: flex;
        justify-content: center;
        flex-direction: column;
        cursor: pointer;
        box-sizing: border-box;
        &.pay-selected{
          background-image: url('../../images/goldPay-select.png');
        }
        p{
          text-align: center;
          &:nth-child(1){
            font-size:18px;
            font-family:PingFang SC;
            font-weight:400;
            color:rgba(51,51,51,1);
            line-height:30px;
          }
          &:nth-child(2){
            font-size:16px;
            font-family:PingFang SC;
            font-weight:500;
            color:rgba(233,0,0,1);
            line-height:30px;
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
    font-size:14px;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(153,153,153,1);
    line-height:26px;
    &::before{
      content: '说明：';
      position: absolute;
      top: 0;
      left: 0;

    }
  }
  .methods{
    display:flex;
    p{
      width: 150px;
      height: 50px;
      position: relative;
      margin-right: 29px;
      cursor: pointer;
      &:nth-child(1){
        background: url('../../../../assets/images/img_member_account_alipay.png');
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
      }
      &:nth-child(2){
        background: url('../../../../assets/images/img_member_account_wxpay.png');
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;

      }
    }
    .img-selected{
      border: 2px solid rgba(220,105,42,1);
    }
    .img-selected::before{
      content: '';
      display: block;
      position: absolute;
      bottom: 0;
      right: 0;
      width: 16px;
      height: 9px;
      background-image: url('../../images/goldPay-select.png');
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
      background-image: url('../../../../assets/images/icon_ali_pay.png')
    }
    .ico-wx{
      background-image: url('../../../../assets/images/icon_wx_pay.png')
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
      // width: 95px;
      // height: 90px;
    }
  }
  .detailBox{
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    .details{
      width:860px;
      height:526px;
      position: absolute;
      top: 50% ;
      left: 50% ;
      margin-top: -263px;
      margin-left: -430px;
      background:rgba(255,255,255,1);
      border-radius:5px;
      text-align: center;
      overflow-x:hidden;
      float:left;
      overflow-y:scroll;
      .tit{
        font-size:22px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(153,153,153,1);
        line-height:77px;
        margin: 0 20px;
        border-bottom: 1px solid #000;
        i{
            display: block;
            position: absolute;
            right: 23px;
            top: 23px;
            width: 18px;
            height: 18px;
            background-image: url('../../../../assets/images/icon_member_account_close.png');
            background-position: center;
            background-size: 100%;
            cursor: pointer;
        }
      }
      table{
        width: 816px;
        margin: 13px auto 0;
        tr{
          height:42px;
          font-size:14px;
          font-family:PingFang SC;
          font-weight:500;
          color:rgba(51,51,51,1);
          line-height:28px;
          &:nth-child(1){
            font-size:14px;
            font-family:PingFang SC;
            font-weight:400;
            color:rgba(102,102,102,1);
            line-height:28px;
          }
          td{
            &:nth-child(1){
              width: 163px;
            }
            &:nth-child(2){
              width: 273px;
            }
            &:nth-child(3){
              width: 173px;
            }
            &:nth-child(4){
              width: 204px;
            }
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
}
</style>
