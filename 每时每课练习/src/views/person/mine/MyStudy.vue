<template>
  <div class="my-study">
    <Header :title="title">
      <div slot="right-sum" class="calendar" @click="onCalendar"></div>
    </Header>

    <div v-if="!isLogin" class="no-login">
      <Empty :empty_type="{name: '请登录后查看相关内容'}"></Empty>
      <div class="info" @click="onLogin">登录/注册</div>
    </div>
    <div v-else>
      <van-tabs @change="onTabChange">
        <van-tab v-for="(item, index) in tabs" :key="index" :title="`${item.name}(${item.num})`"></van-tab>
      </van-tabs>
      <div class="vip" v-if="showVipTip">
        <span>课程中有会员课，会员课将于</span>
        <span class="date">{{vipTip}}</span>
        <span>过期。</span>
        <!-- <span class="btn" v-if="showRenewVip">去续费</span> -->
      </div>
      <div v-if="list.length">
        <MyStudyList :courses="list" :userInfo="userInfo" @onRefresh="onRefresh"></MyStudyList>
      </div>
      <div v-else class="no-login">
        <Empty :empty_type="{name: '还没有课程，快去选择课程学习吧'}"></Empty>
        <div class="info" @click="onChooseCourse">选择课程</div>
      </div>
    </div>
  </div>
</template>

<script>
import Empty from '@/components/Empty'
import Header from '@/components/Header'
import MyStudyList from './MyStudyList'
export default {
  name: 'my-study',
  components: {
    Empty,
    Header,
    MyStudyList
  },
  data() {
    return {
      title: {
        name: '我的学习'
      },
      tabs: [],
      list: [],
      userInfo: {},
      type: 2,
    }
  },
  created() {
    this.requestCourse()
    this.requestUserInfo()
  },
  computed: {
    showVipTip() {
      // 有会员课 & 用户是会员
      let hasVipCourse = false
      for (const i of this.list) {
        if (i.is_vip_course) {
          hasVipCourse = true
          break
        }
      }
      return hasVipCourse && this.userInfo.is_vip && this.userInfo.vip.vip_end_at
    },
    // 返回续费vip的天数，如果小于3天则返回正值，否则返回0
    showRenewVip() {
      const nowTimestamp = parseInt(new Date().getTime() / 1000)
      const distance = this.userInfo.vip.vip_end_at - nowTimestamp
      let ret = 0
      const secondInDay = 24 * 3600
      if (distance > 0 && distance <= 3 * secondInDay) {
        ret = parseInt(distance / secondInDay)
      }
      return ret
    },
    vipTip() {
      // let tip = this.showRenewVip
      // if (tip) return tip + '天后'
      const date = new Date(this.userInfo.vip.vip_end_at * 1000)
      return date.format('yyyy年MM月dd日')
    },
    isLogin() {
      return !!localStorage.adminToken
    }
  },
  methods: {
    // on event
    onTabChange(index) {
      this.type = this.tabs[index].type
      this.requestCourse()
    },
    onCalendar() {
      this.$router.push({
        name: 'StudyCalendar'
      })
    },
    onLogin() {
      this.$router.push({
        name: 'Login'
      })
    },
    onChooseCourse() {
      this.$router.push({
        name: 'Course'
      })
    },
    onRefresh() {
      this.requestCourse()
    },
    // other
    // request
    requestCourse() {
      this.$http.get(`/api/app/myStudy/${this.type}`).then(data => {
        this.tabs = data.typeNum
        this.list = data.courseList
      })
    },
    requestUserInfo() {
      this.$http.get('/api/app/userInfo').then(data => {
        this.userInfo = data
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.my-study {
  .header {
    border-bottom: 1px solid #f5f5f5;
  }
  .calendar {
    width: 100px;
    height: 100%;
    background: url("~@/assets/images/icon-calendar.png") no-repeat right center;
    background-size: 32px 32px;
  }
  .no-login {
    text-align: center;
    .empty {
      margin-top: 200px;
    }
    .info {
      width: 176px;
      height: 56px;
      border-radius: 8px;
      background-color: $theme_color;
      font-size: 26px;
      color: #fff;
      line-height: 56px;
      margin: 80px auto;
    }
  }
  .vip {
    font-size: 26px;
    color: #8c8c8c;
    background-color: #fff;
    padding: 30px 20px;
    .date {
      color: #ea7a2f;
    }
    .btn {
      display: inline-block;
      background: $theme_color;
      color: #fff;
      padding: 5px 5px;
      border-radius: 5px;
      font-size: 24px;
    }
  }
}
</style>