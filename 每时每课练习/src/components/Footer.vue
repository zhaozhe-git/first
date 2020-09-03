<template>
  <footer v-if="footerShow && app==0">
    <ul class="footer-content">
      <li
        :style="{width: (100/footer.length)+'%'}"
        v-for="(item,index) in footer"
        :key="index"
        @click="skip(item.name)"
      >
        <img :src="foooterName == item.name ? item.img_hover : item.img" />
        <font :style="{color:foooterName != item.name?'#333':$theme_color}">{{item.title}}</font>
      </li>
    </ul>
  </footer>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "Footer",
  data() {
    return {
      footer: [
        {
          img: require("../assets/images/home.png"),
          img_hover: require("../assets/theme-img/home-active.png"),
          title: "首页",
          name: "Index"
        },
        {
          img: require("../assets/images/home_course_grey.png"),
          img_hover: require("../assets/theme-img/course-active.png"),
          title: "课程",
          name: "Course"
        },
        {
          img: require("../assets/images/study.png"),
          img_hover: require("../assets/theme-img/study-active.png"),
          title: "约课记录",
          name: "Record"
        },
        {
          img:require("../assets/images/user.png"),
          img_hover:require("../assets/theme-img/user-active.png"),
          title: "我的",
          name: "Person"
        }
      ]
    };
  },
  computed: mapState(["foooterName", "app", "footerShow", "config"]),
  methods: {
    skip(name) {
      this.$router.push({ name });
    }
  },
  watch: {
    config(val) {
      if (val.switch_question_module == 1) {
        this.footer.splice(3, 0,{
          img:require("../assets/images/question.png"),
          img_hover:require("../assets/theme-img/user-active.png"),
          title: "练习",
          name: "Practise"
        });
      }
    }
  }
};
</script>
<style scoped lang="scss">
footer {
  height: 100px;
  width: 100%;
  position: fixed;
  bottom: 0px;
  z-index: 9999;
  background-color: white;
  overflow: hidden;
  .footer-content {
    width: 100%;
    height: 100%;
    display: flex;
    li {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      img {
        width: 44px;
        height: 36px;
      }
      font {
        padding-top: 10px;
        font-size: 22px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
      &:nth-child(2) {
        img {
          width: 34px;
          height: 36px;
        }
      }
      &:nth-child(3) {
        img {
          width: 26px;
          height: 34px;
        }
      }
      &:nth-child(4) {
        img {
          width: 40px;
          height: 38px;
        }
      }
    }
  }
}
</style>
