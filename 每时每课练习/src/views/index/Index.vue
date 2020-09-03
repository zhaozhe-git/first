<template>
  <div class="index-page">
    <div class="index-banner" v-if="bannerList && bannerList.length > 0">
      <div class="banner">
        <van-swipe :autoplay="3000" indicator-color="white">
          <van-swipe-item
            v-for="(item,index) in bannerList"
            :key="index"
            @click="bannerClick(item)"
          >
            <img :src="item.banner_img ? item.banner_img : '../assets/images/place_image.png'" />
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>
    <div class="index-kinds" :class="{'no-banner':!bannerList.length}">
      <ul>
        <li v-for="(item,index) in kind_list" :key="index" @click="goFunction(item.path)">
          <img :src="item.imgSrc" />
          <font>{{item.label}}</font>
        </li>
      </ul>
    </div>
    <section v-for="(item,index) in recommend" :key="index">
      <p class="op-title">{{item.channel_info.name}}</p>
      <index-item
        :course="item.list"
        v-if="item.channel_info.type == 1 || item.channel_info.type == 2"
      ></index-item>
      <!-- 老师 -->
      <div class="oto-content" v-else>
        <div
          class="oc-item"
          v-for="(it,idx) in item.list"
          :key="idx"
          @click="toTeach(it.teacher_id)"
        >
          <img :src="it.teacher_avatar" alt />
          <div>
            <p>
              <span>{{it.teacher_name}}</span>
              <font v-if="it.level_name">{{it.level_name}}</font>
            </p>
            <p>{{it.introduction}}</p>
          </div>
        </div>
      </div>
    </section>
    <van-dialog
      v-model="show"
      @confirm='toLogin'
      confirm-button-text="立即登录"
    >
      <i class="close" @click="show=false"></i>
      <img src="../../assets/images/feiji.png">
      <p class="LoginText">赶紧登录一下吧</p>
      <p class="message">立即预约一对一辅导，浏览更多视频课程~</p>
    </van-dialog>
  </div>
</template>
<script>
// import axios from 'axios';
import indexItem from "@/components/CourseItem";
export default {
  name: "Index",
  components: {
    indexItem
  },
  data() {
    return {
      show: false,
      swiperOption: {
        slidesPerView: "auto",
        spaceBetween: 10,
        initialSlide: 0
      },
      bannerList: [],
      recommend: [],
      kind_list: [
        {
          label: "特色课",
          imgSrc: require("@/assets/images/index-kinds-course.png"),
          path: "Course"
        },
        {
          label: "一对一辅导",
          imgSrc: require("@/assets/images/index-kinds-one.png"),
          path: "Oto"
        },
        {
          label: "学习日历",
          imgSrc: require("@/assets/images/index-kinds-study.png"),
          path: "StudyCalendar"
        }
      ]
    };
  },
  methods: {
    getIndex() {
      this.$http.get(`/api/app/recommend/appIndex`).then(res => {
        this.recommend = res;
      });
      
    },
    getBaner() {
      this.$http.get(`/api/app/banner`).then(res => {
        this.bannerList = res;
      });
    // axios.get('https://test.365msmk.com/api/app/banner?',{headers:{
    //     DeviceType: 'H5'
    //   }}).then(res=>{
    //   console.log(res)
    // })
    },
    toTeach(id) {
      if(!localStorage.adminToken){
        this.show = true;
        return;
      }
      this.$router.push({
        name: "Teacher",
        query: {
          id: id
        }
      });
    },
    bannerClick(item) {
      /**
       * link_type  1 链接  2课程  3资讯
       */
      if (item.link_type == 1) {
        window.location.href = item.link_content;
      } else if (item.link_type == 2) {
        this.$router.push({
          name: "CourseDetail",
          query: {
            id: item.link_content
          }
        });
      }
    },
    goFunction(name) {
      if(!localStorage.adminToken && name == 'StudyCalendar'){
        this.show = true;
        return;
      }
      this.$router.push({
        name
      });
    },
    toLogin(){
      this.$router.push({
        name:'Login'
      })
    }
  },
  created() {
    this.getBaner();
    this.getIndex();
  }
};
</script>
<style lang="scss">
.index-page {
  background: #f0f2f5;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 100px;
  overflow: hidden;
  .index-banner {
    position: relative;
    background: linear-gradient(#0146fd, #33daf3);
    .van-swipe {
      height: 400px;
    }
    .banner {
      height: 324px;
      height: 100%;
      position: relative;
      background-position: center center;
      background-size: cover;
      .images {
        width: 100%;
        height: 100%;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .index-kinds {
    padding: 0 20px;
    margin-top: -50px;
    margin-bottom: 40px;
    position: relative;
    font-family: PingFangSC-Regular;
    ul {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-around;
      li {
        @extend %flex-center;
        flex-direction: column;
        background: #fff;
        border-radius: 20px;
        width: 206px;
        height: 206px;
        img {
          width: 42px;
          height: 40px;
          display: block;
        }
        font {
          margin-top: 30px;
          font-size: 24px;
          font-weight: 400;
          color: rgba(140, 140, 140, 1);
        }
      }
    }
  }
  .no-banner {
    margin-top: 20px;
  }
  .op-title {
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(89, 89, 89, 1);
    position: relative;
    padding-left: 54px;
    line-height: 40px;
    height: 40px;
    font-size: 32px;
    &::after {
      position: absolute;
      content: "";
      left: 30px;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 32px;
      background: $theme_color;
    }
  }
  .oto-content {
    padding: 10px 20px 40px;
    .oc-item {
      display: flex;
      align-items: center;
      padding: 0 30px;
      background: #fff;
      border-radius: 8px;
      height: 162px;
      margin-top: 20px;
      img {
        width: 80px;
        height: 80px;
        margin-right: 24px;
        border-radius: 50%;
        flex: none;
      }
      div {
        flex: 1;
        p {
          font-family: PingFangSC-Regular;
          font-weight: 400;
          &:nth-child(1) {
            padding-bottom: 6px;
            span {
              font-size: 30px;
              color: #595959;
              line-height: 42px;
              padding-right: 10px;
            }
            font {
              font-size: 22px;
              color: rgba(234, 122, 47, 1);
            }
          }
          &:nth-child(2) {
            width: 550px;
            font-size: 24px;
            height: 30px;
            padding-top: 10px;
            color: rgba(183, 183, 183, 1);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      a {
        flex: none;
        width: 140px;
        height: 62px;
        line-height: 62px;
        background: rgba(235, 238, 254, 1);
        border-radius: 31px;
        font-size: 28px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: $theme_color;
        border: none;
        text-align: center;
      }
    }
  }
    .van-dialog{
      width:566px;
      height:691px;
      background:rgba(255,255,255,1);
      border-radius:30px;

      .van-dialog__content,.van-dialog__footer{
        text-align: center;
      }      
      .close{
        width: 24px;
        height: 24px;
        position: absolute;
        top: 23px;
        right: 26px;
        background-image: url('../../assets/images/icon_member_account_close.png');
        background-size: 100%;
        background-position: center;
      }
      img{
        width: 565px;
        height: 400;
        margin-top: 29px;
      }
      .LoginText{
        font-size:30px;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height: 44px;
      }
      .message{
        font-size:24px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(153,153,153,1);
        line-height: 38px;
      }
      .van-button{
        width:472px;
        height:80px;
        background:rgba(235,97,0,1);
        border-radius:40px;
        font-size:30px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(255,255,255,1);
        line-height: 80px;
        margin-top: 57px;
      }
    }
}
</style>

