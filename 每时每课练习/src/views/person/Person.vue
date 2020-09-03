<template>
<div class="person">
  <div class="top-box">
    <div class="tab">
      <div class="info">
        <section class="login" @click="onInfo">
          <div class="avatar">
            <img v-if="user_id" :src="userInfo.avatar || headerImg" />
            <img v-else src="~@/assets/images/avatar.png" />
            <img class="vip-logo" v-if="user_id&&userInfo.is_vip" src="~@/assets/images/皇冠-2@2x.png">
            <img class="vip-logo" v-if="user_id&&!userInfo.is_vip" src="~@/assets/images/皇冠-2 拷贝@2x.png">
          </div>
          <div class="extra">
            <p class="name">
              <span v-if="user_id">{{userInfo.nickname}}</span>
              <span v-else>登录/注册</span>
            </p>
            <p class="edit" v-if="user_id">
              <!-- <span>{{userInfo.is_vip ? '续费会员' : '开通会员'}}></span> -->
            </p>
          </div>
        </section>
        <!-- <section v-else class="no-login" @click="onLogin">
          <div class="avatar">
            <img src="~@/assets/images/avatar.png" />
          </div>
          <p>登录/注册</p>
        </section> -->
      </div>
      <div class="mine">
        <div v-for="(item, index) in mineList" :key="index" class="mine-item" :class="item.style" @click="onMineItem(item)">
          <p class="count">{{item.count}}</p>
          <p class="name">{{item.name}}</p>
          <p class="note">{{item.note}}</p>
        </div>
      </div>
      <div class="to-set" @click="turnPage('Oto')">
        <!-- <img src="~@/assets/theme-img/icon_person_edit.png" /> -->
        <span>去约课</span>
      </div>
      <!-- <button class="to-set" type="button" @click="turnPage('Options')"></button> -->
    </div>
  </div>
  <div class="to-share">
    <div class="box" @click="showPopup=true">
      <img src="~@/assets/images/icon_person_share.png" />
      <div>
        <p class="big">邀请好友注册APP，享多重好礼</p>
        <p class="sub">限时特惠，多邀多得</p>
      </div>
    </div>
  </div>
  <ul class="menu-box">
    <li>
      <p class="title">课程相关</p>
      <div class="item-box">
        <div class="item" @click="turnPage('Concern')">
          <img class="icon-teacher" src="~@/assets/theme-img/icon_person_teacher.png" />
          <p>关注的老师</p>
        </div>
        <div class="item" @click="turnPage('Collect')">
          <img class="icon-collect" src="~@/assets/theme-img/icon_person_collect.png" />
          <p>我的收藏</p>
        </div>
      </div>
    </li>
    <li>
      <p class="title">订单相关</p>
      <div class="item-box">
        <div class="item" @click="turnPage('Order',{order_type: 2})">
          <img class="icon-order" src="~@/assets/theme-img/icon_person_order.png" />
          <p>课程订单</p>
        </div>
        <div class="item" @click="turnPage('Order',{order_type: 3})">
          <img class="icon-order" src="~@/assets/theme-img/icon_person_order.png" />
          <p>会员订单</p>
        </div>
        <div class="item" @click="turnPage('Order',{order_type: 1})">
          <img class="icon-order" src="~@/assets/theme-img/icon_person_order.png" />
          <p>约课订单</p>
        </div>
      </div>
    </li>
    <li>
      <p class="title">我的账户</p>
      <div class="item-box">
        <div class="item" @click="turnPage('Coupon')">
          <img class="icon-coupon" src="~@/assets/theme-img/icon_person_coupon.png" />
          <p>优惠券</p>
          <span></span>
        </div>
        <div class="item" @click="turnPage('Card')">
          <img class="icon-card" src="~@/assets/theme-img/icon_person_card.png" />
          <p>学习卡</p>
        </div>
        <div class="item" @click="turnPage('Vip')">
          <img class="icon-vip" src="~@/assets/theme-img/icon_person_vip.png" />
          <p>会员</p>
        </div>
      </div>
    </li>
    <li>
      <p class="title">自助服务</p>
      <div class="item-box">
        <div @click="turnPage('Message')" :class="newMessage==true?'item has_message':'item'">
          <img class="icon-news" src="~@/assets/theme-img/icon_person_news.png" />
          <p>我的消息</p>
          <span></span>
        </div>
        <div class="item" @click="turnPage('Feedback')">
          <img class="icon-mail" src="~@/assets/theme-img/icon_person_mail.png" />
          <p>意见反馈</p>
        </div>
        <div class="item" @click="openCustom">
          <img class="icon-custom" src="~@/assets/theme-img/icon_person_custom.png" />
          <p>在线客服</p>
        </div>
         <div class="item" @click="turnPage('Options')">
          <img class="icon-custom" src="~@/assets/theme-img/icon_person_setting.png" />
          <p>设置</p>
        </div>
        <!-- <router-link class="item" :to="{ name: '' }">
          <img class="icon-about" src="~@/assets/theme-img/icon_person_about.png" />
          <p>关于我们</p>
        </router-link> -->
      </div>
    </li>
  </ul>
  <!-- <div class="bottom-box">
    <ul v-for="(menuItem, index) in menusList" :key="index">
      <li v-for="(item, index) in menuItem" :key="index" @click="onMenuItem(item)" :class="item.style || ''">{{item.name}}</li>
    </ul>
  </div> -->
  <van-popup v-model="showPopup">
    <div class="share-box">
      <img class="share-img" :src="shareImg" />
      <div class="finger">
        <img src="~@/assets/images/icon_home_finger.png" />
        <p>长按保存到相册</p>
      </div>
    </div>
  </van-popup>
</div>
</template>
<script>
export default {
  name: "person",
  data() {
    return {
      userInfo: {},
      headerImg: require("@/assets/images/user_Headportrait.png"),
      newMessage: false,
      user_id: "",
      mineList: [{
          count: 0,
          name: "我的特色课",
          note: "已购特色课程的学习",
          style: "my-study",
          url: "MyStudy"
        },
        {
          count: 0,
          name: "一对一辅导",
          note: "我的一对一老师辅导",
          style: "my-plan",
          url: "Record"
        },
        {
          count: 0,
          name: "剩余学习币",
          note: "查看剩余学习币",
          style: "my-period",
          url: "MyCurrency"
        }
      ],
      showPopup: false,
      shareImg: '',
    	is_weixin:false,
    };
  },
  created() {
    if (this.$pub.isWeiXin()) {
      this.is_weixin = true;
      if (window.location.href.search("code") >= 0) {
        let code = window.location.href.split("code=")[1].split("&")[0];
        if (code) {
          this.$http.post("/api/app/user/setUserOpenid",{code:code}).then(()=>{
          })
        }        
      }
    }
    this.user_id = localStorage.user_id;
    this.requestShareImg();
    if (this.user_id) {
      this.requestUserInfo();
    }
    window.scrollTo(0, 0);
  },
  computed: {
    menusList() {
      return [
        [{
            name: "我的关注",
            url: "Concern"
          },
          {
            name: "我的收藏",
            url: "Collect"
          }
        ],
        [{
            name: "课程订单",
            url: "Order",
            query: {
              order_type: 2
            }
          },
          {
            name: "会员订单",
            url: "Order",
            query: {
              order_type: 3
            }
          },
          {
            name: "约课订单",
            url: "Order",
            query: {
              order_type: 1
            }
          }
        ],
        [{
          name: "优惠券",
          url: "Coupon"
        }, {
          name: "学习卡",
          url: "Card"
        }],
        [{
            name: "消息中心",
            url: "Message",
            style: {
              "has-message": this.newMessage
            }
          },
          {
            name: "设置",
            url: "Options"
          }
        ]
      ];
    }
  },
  methods: {
    // on event
    onLogin() {
      this.turnPage("Login");
    },
    onMineItem(item) {
      if (!item.url) return;
      this.turnPage(item.url);
    },
    onInfo() {
      this.turnPage("Info");
      this.$router.push("/set-message")
    },
    onVip() {
      this.turnPage("Vip");
    },
    onMenuItem(item) {
      this.turnPage(item.url, item.query);
    },
    openCustom() {
      _MEIQIA('showPanel');
    },
    // other
    turnPage(name, query) {
      if (!this.user_id) {
        // 未登录 统一推到验证码登录页面
        this.$router.push({
          name: "Login"
        });
        return;
      }

      this.$router.push({
        name,
        query
      });
    },
    // rquest
    requestUserInfo() {
      this.$http.get("/api/app/userInfo").then(data => {
        this.userInfo = data;
        this.requestMessage();
        this.requestCount();
      });
    },
    requestMessage() {
      this.$http.post("/api/app/message/classifyMessage").then(data => {
        for (const i of data) {
          if (i.is_read == 0) {
            this.newMessage = true;
            break;
          }
        }
      });
    },
    requestCount() {
      this.$http.get("/api/app/getUCenterInfo").then(data => {
        this.mineList[0].count = data.courses;
        this.mineList[1].count = data.oto;
        this.mineList[2].count = (data.integral/100).toFixed(2);
      });
    },
    requestShareImg() {
      this.$http.post("/api/app/public/share").then(data => {
        this.shareImg = data.path
      });
    }
  }
};
</script>
<style scoped lang="scss">
.person {
    overflow: hidden;
    padding-bottom: 150px;
    @extend %default-bg;
}
.top-box {
    height: 435px;
    background: url("~@/assets/theme-img/user_bg.png") no-repeat top center;
    background-size: 100%;
    background-color: #fff;
    position: relative;
    padding: 0 30px;

    // .info {
    //   overflow: hidden; //触发BFC
    //   .login {
    //     overflow: hidden; //触发BFC
    //     margin-top: 106px;
    //     position: relative;
    //     .avatar {
    //       float: left;
    //       margin: 0 50px 0 40px;
    //     }
    //     .extra {
    //       margin-top: 15px;
    //       .name {
    //         font-size: 34px;
    //         color: #fafafa;
    //       }
    //       .vip {
    //         margin-top: 30px;
    //         display: inline-block;
    //         width: 186px;
    //         height: 48px;
    //         border-radius: 20px;
    //         background: url("~@/assets/images/icon-vip.png") no-repeat;
    //         background-position: 15px center;
    //         background-size: 25px;
    //         background-color: rgba(0, 0, 0, 0.2);
    //         font-size: 24px;
    //         color: #fff;
    //         line-height: 48px;
    //         span {
    //           margin-left: 50px;
    //         }
    //       }
    //     }
    //     &:after {
    //       content: "";
    //       display: block;
    //       border-top: 3px solid #fff;
    //       border-right: 3px solid #fff;
    //       width: 30px;
    //       height: 30px;
    //       position: absolute;
    //       top: 50%;
    //       right: 40px;
    //       transform: translateY(-50%) rotate(45deg);
    //     }
    //   }
    //   .no-login {
    //     margin-top: 106px;
    //     @extend %flex-center;
    //     flex-direction: column;
    //     p {
    //       font-size: 34px;
    //       color: #fff;
    //       margin-top: 36px;
    //     }
    //   }
    //   .avatar {
    //     width: 124px;
    //     height: 124px;
    //     background-color: #bdcdf1;
    //     border-radius: 50%;
    //     @extend %flex-center;
    //     img {
    //       width: 118px;
    //       height: 118px;
    //       border-radius: 50%;
    //     }
    //   }
    // }
    //
    // .mine {
    //   display: flex;
    //   justify-content: space-between;
    //   width: 100%;
    //   position: absolute;
    //   bottom: 0;
    //   left: 50%;
    //   transform: translateX(-50%);
    //   .mine-item {
    //     width: 33%;
    //     height: 230px;
    //     text-align: center;
    //     position: relative;
    //     .count {
    //       font-size: 48px;
    //       line-height: 120px;
    //     }
    //     .name {
    //       font-size: 28px;
    //       color: #595959;
    //       margin-bottom: 12px;
    //     }
    //     .note {
    //       font-size: 22px;
    //       color: #b7b7b7;
    //     }
    //     &::after {
    //       content: "";
    //       display: block;
    //       width: 1px;
    //       height: 110px;
    //       background-color: #f5f5f5;
    //       position: absolute;
    //       top: 50%;
    //       right: 0;
    //       transform: translateY(-50%);
    //     }
    //     &:last-child::after {
    //       display: none;
    //     }
    //   }
    //   .my-study > .count {
    //     color: #5bb8f5;
    //   }
    //   .my-plan > .count {
    //     color: #6563a4;
    //   }
    //   .my-period > .count {
    //     color: #4169ff;
    //   }
    // }
    .tab {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 690px;
        background-color: #fff;
        box-shadow: 0 0 24px 0 rgba(0, 0, 0, 0.05);
        border-radius: 10px;
        height: 345px;
        .info {
            overflow: hidden; //触发BFC
            .login {
                overflow: hidden; //触发BFC
                margin: 30px 0 0 30px;
                position: relative;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .avatar {
                    margin: 0 25px 0 0;
                    position: relative;
                    .vip-logo{
                      position: absolute;
                      right: -20px;
                      top: 0px;
                      width: 40px;
                      height: 40px;
                    }
                }
                .extra {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    .name {
                        font-size: 32px;
                        color: #333;
                    }
                    .edit {
                        width: 30px;
                        height: 31px;
                        margin-left: 20px;
                        background: url("~@/assets/images/修改@2x.png") center no-repeat;
                        background-size: 30px 31px;
                    }
                    // .vip {
                    //     margin-top: 30px;
                    //     display: inline-block;
                    //     width: 186px;
                    //     height: 48px;
                    //     border-radius: 20px;
                    //     background: url("~@/assets/images/icon-vip.png") no-repeat;
                    //     background-position: 15px center;
                    //     background-size: 25px;
                    //     background-color: rgba(0, 0, 0, 0.2);
                    //     font-size: 24px;
                    //     color: #fff;
                    //     line-height: 48px;
                    //     span {
                    //         margin-left: 50px;
                    //     }
                    // }
                }
                // &:after {
                //     content: "";
                //     display: block;
                //     border-top: 3px solid #fff;
                //     border-right: 3px solid #fff;
                //     width: 30px;
                //     height: 30px;
                //     position: absolute;
                //     top: 50%;
                //     right: 40px;
                //     transform: translateY(-50%) rotate(45deg);
                // }
            }
            .no-login {
                margin-top: 106px;
                @extend %flex-center;
                flex-direction: column;
                p {
                    font-size: 34px;
                    color: #fff;
                    margin-top: 36px;
                }
            }
            .avatar {
                width: 124px;
                height: 124px;
                background-color: #bdcdf1;
                border-radius: 50%;
                @extend %flex-center;
                img {
                    width: 118px;
                    height: 118px;
                    border-radius: 50%;
                }
            }
        }

        .mine {
            display: flex;
            justify-content: space-between;
            width: 100%;
            .mine-item {
                width: 33%;
                // height: 230px;
                margin-top: 30px;
                text-align: center;
                position: relative;
                .count {
                    font-size: 48px;
                    line-height: 70px;
                }
                .name {
                    font-size: 28px;
                    color: #595959;
                    margin-bottom: 12px;
                }
                .note {
                    font-size: 22px;
                    color: #b7b7b7;
                }
                &::after {
                    content: "";
                    display: block;
                    width: 1px;
                    height: 110px;
                    background-color: #f5f5f5;
                    position: absolute;
                    top: 50%;
                    right: 0;
                    transform: translateY(-50%);
                }
                &:last-child::after {
                    display: none;
                }
            }
            .my-study > .count {
                color: #EB6100;
            }
            .my-plan > .count {
                color: #EB6100;
            }
            .my-period > .count {
                color: #EB6100;
            }
        }
        .to-set {
            position: absolute;
            top: 66px;
            right: 0;
            width:111px;
            height:50px;
            line-height: 50%;
            border-top-left-radius:20px;
            border-bottom-left-radius: 20px;
            background-color: #EB6100;
            text-align: center;
            vertical-align: middle;
            img{
              width: 21px;
              display: inline-block;
              vertical-align: middle;
            }
            span{
              display: inline-block;
              // width:70px;
              height: 50px;
              line-height: 50px;
              font-size:24px;
              vertical-align: middle;
              font-family:PingFang SC;
              font-weight:400;
              color:rgba(255,255,255,1);
            }
           
        }
    }
}
.to-share {
    width: 100%;
    padding: 30px 30px 0;
    background-color: #fff;
    box-sizing: border-box;
    .box {
        position: relative;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        height: 88px;
        background: linear-gradient(-90deg,rgba(242,153,90,1),rgba(235,97,0,1));
        border-radius: 44px;
        img {
            display: block;
            width: 40px;
            height: 36px;
            margin: 0 25px 0 30px;
        }
        .big {
            font-size: 24px;
            color: #fff;
            line-height: 24px;
        }
        .sub {
            margin-top: 10px;
            font-size: 20px;
            color: #fff;
            line-height: 20px;
        }
        &:after {
            content: "";
            display: block;
            border-top: 3px solid #fff;
            border-right: 3px solid #fff;
            width: 20px;
            height: 20px;
            position: absolute;
            top: 50%;
            right: 40px;
            transform: translateY(-50%) rotate(45deg);
        }
    }
}
.menu-box {
    width: 100%;
    padding: 0 30px;
    background-color: #fff;
    box-sizing: border-box;
    li {
        padding: 40px 0;
        border-bottom: 1px solid #EEEEEE;
        .title {
            font-family: PingFangSC-Medium;
            font-size: 32px;
            color: #333;
            line-height: 32px;
        }
        .item-box {
            display: flex;
            justify-content: flex-start;
            width: 100%;
            .item {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                flex-direction: column;
                width: 25%;
                height: 120px;
                text-align: center;
                img {
                    display: inline-block;
                }
                p {
                    margin-top: 20px;
                    font-size: 24px;
                    color: #666;
                    line-height: 24px;
                }
                .icon-teacher {
                    width: 38px;
                    height: 42px;
                }
                .icon-collect {
                    width: 42px;
                    height: 42px;
                }
                .icon-order {
                    width: 38px;
                    height: 42px;
                }
                .icon-coupon {
                    width: 44px;
                    height: 36px;
                }
                .icon-card {
                    width: 46px;
                    height: 34px;
                }
                .icon-vip {
                    width: 45px;
                    height: 39px;
                }
                .icon-news {
                    width: 37px;
                    height: 44px;
                }
                .icon-mail {
                    width: 42px;
                    height: 33px;
                }
                .icon-custom {
                    width: 44px;
                    height: 44px;
                }
                .icon-about {
                    width: 46px;
                    height: 46px;
                }
            }
        }
    }
    li:last-child {
        border: none;
    }
}
.bottom-box {
    ul {
        background-color: #fff;
        margin: 30px 0;
        padding: 10px 30px;
        li {
            height: 110px;
            line-height: 110px;
            position: relative;
            font-size: 28px;
            color: #595959;
            &:before {
                content: "";
                display: block;
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%) rotate(45deg);
                width: 20px;
                height: 20px;
                border-top: 1px solid #b7b7b7;
                border-right: 1px solid #b7b7b7;
            }
            border-bottom: 1px solid #f5f5f5;
            &:last-child {
                border-bottom: none;
            }
        }
        li.has-message:after {
            content: "";
            display: block;
            position: absolute;
            top: 50%;
            left: 120px;
            transform: translateY(-50%);
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: red;
        }
    }
}
.share-box {
    // position: fixed;
    // top: 50%;
    // left: 50%;
    width: 670px;
    // transform: translate(-50%,-50%);
    .share-img {
        display: block;
        width: 100%;
    }
    .finger {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding-top: 40px;
        img {
            width: 42px;
            height: 44px;
            margin-right: 20px;
        }
        p {
            font-family: PingFangSC-Medium;
            font-size: 30px;
            color: #fff;
        }
    }
}
.van-popup--center {
    background-color: transparent;
}
.has_message{position: relative;}
.has_message span{
	left:50;
	margin-left: 20px;
	top:20px;
	position: absolute;
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background-color: red;
}
</style>
