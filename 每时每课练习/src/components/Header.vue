<template>
  <div class="header">
    <header>
      <div class="back" v-if="returnShow" @click="goBack">
        <img src="../assets/images/return.png" />
      </div>
      <h3>{{title.name}}</h3>
      <div class="right" @click="parentHandler">
        <slot name="right-sum"></slot>
      </div>
    </header>
    <div class="header_box"></div>
    <div id="query" v-if="shareBool">
      <h1>二维码</h1>
      <div id="canvas">
        <img :src="qrcodeURL" />
      </div>
      <i @click="closeShare"></i>
    </div>
    <div class="bg" v-if="shareBool" @click="closeShare" @touchmove.prevent></div>
  </div>
</template>

<script>
import uncol from "@/assets/images/collections_grey.png";
import col from "@/assets/theme-img/icon-star.png";
// import QRCode from "qrcode";

export default {
  props: {
    title: {
      type: Object
    },
    returnShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      cangImg: uncol,
      shareBool: false
      // qrcodeURL: ""
    };
  },
  methods: {
    toToday2() {},
    share() {
      // let URL = document.URL + "&share=1";
      // this.QueryDetail = URL;
      // var canvas = document.getElementById("canvas");
      // this.QRCode.toDataURL(URL, (err, res) => {
      //   if (err) {
      //     throw err;
      //   }
      //   this.qrcodeURL = res;
      // });
      // this.shareBool = true;
    },
    closeShare() {
      this.shareBool = false;
    },
    goBack() {
      // app
      if (
        this.$pub.filterAppPage(this.$route.name) &&
        this.$store.state.app &&
        !this.$store.state.back_normal
      ) {
        this.$pub.appAction("closeAppPage");
        return;
      }
      if (this.title.backUrl) {
        this.$router.replace({
          name: this.title.backUrl
        });
        return;
      }

      if (window.history.length <= 1 || this.title.share) {
        this.$router.push({
          path: "/"
        });
        return;
      }
      this.$router.go(-1);
    },
    parentHandler() {
      this.$emit("toGet");
    },
    async collect() {
      const clt = await this.$http.post(`/api/app/collect`, {
        basis_id: this.title.basis_id,
        type: this.title.type
      });
      if (clt.data.is_collect == 1) {
        this.cangImg = col;
      } else if (clt.data.is_collect == 0) {
        this.cangImg = uncol;
      }
      this.$toast(clt.msg);
    }
  },
  watch: {
    title: function() {
      if (this.title.is_collect) {
        if (this.title.is_collect == 1) {
          this.cangImg = col;
        } else {
          this.cangImg = uncol;
        }
      }
    }
  },
  created() {
    if (this.title.is_collect) {
      if (this.title.is_collect == 1) {
        this.cangImg = col;
      } else {
        this.cangImg = uncol;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.header {
  height: 88px;
  line-height: 88px;
  background: #fff;
  header {
    height: 88px;
    position: fixed;
    z-index: 999;
    width: 100%;
    background: #fff;
    .back {
      float: left;
      width: 80px;
      text-align: center;
      img {
        widows: 18px;
        height: 32px;
      }
    }
    h3 {
      font-size: 36px;
      color: #595959;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 500px;
    }
    .right {
      height: 100%;
      float: right;
      font-size: 30px;
      color: #595959;
      padding: 0 20px;
    }
  }
  .header_box {
    width: 100%;
    height: 100%;
  }
}
.cang {
  width: 42px;
  height: 42px;
  // background: url("../assets/images/cang.png") no-repeat;
  background-position: center center;
  background-size: cover;
  border: none;
  display: block;
  margin-left: 50px;
  margin-right: 30px;
}
#query {
  position: fixed;
  top: 20%;
  left: 10%;
  width: 80%;
  background-color: #fff;
  border: 1px solid #ccc;
  z-index: 2002;
  box-shadow: 0px 0px 7px #ccc;
  padding: 20px;
  box-sizing: border-box;
  i {
    position: absolute;
    right: 20px;
    top: 20px;
    width: 20px;
    height: 20px;
    background-position: center;
    background-size: 100%;
    background-image: url("../assets/images/close.png");
  }
}
.bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1999;
}
#canvas {
  width: 100% !important;
  // height: 100%!important;
  margin: 0 auto;
  img {
    width: 100%;
    // height: 100%;
  }
}
</style>