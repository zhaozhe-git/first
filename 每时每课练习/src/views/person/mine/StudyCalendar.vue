<template>
  <div class="study-calendar">
    <header>
      <Header :title="title"></Header>
    </header>
    <Calendar
      :firstDay="7"
      :courseDate="courseDate"
      @onCurDate="onCurDate"
      @onChangeDate="onChangeDate"
      @onClickDay="onClickDay"
    ></Calendar>
    <div class="info">
      <span class="date">{{curDate}}</span>
      <span class="course-count">当天{{courseList.length}}节课</span>
    </div>
    <StudyCalendarList :courses="courseList"></StudyCalendarList>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Calendar from '@/components/Calendar'
import StudyCalendarList from './StudyCalendarList'
export default {
  name: 'study-calendar',
  components: {
    Header,
    Calendar,
    StudyCalendarList
  },
  data() {
    return {
      title: {
        name: '学习日历'
      },
      courseDate: [],
      courseList: [],
      curDate: '',
    }
  },
  methods: {
    // on event
    onCurDate(date) {
      this.requestCourseDate(date)
      this.requestCourse(date)
      this.changeCurDate(date)
    },
    onChangeDate(date) {
      this.requestCourseDate(date)
      this.courseList = []
      this.changeCurDate(date)
    },
    onClickDay(date) {
      this.requestCourse(date)
      this.changeCurDate(date)
    },
    // other
    changeCurDate(date) {
      const ary = date.split('-')
      this.curDate = ary[1] + '月' + ary[2] + '日'
    },
    // request
    requestCourseDate(date) {
      this.$http.get('/api/app/study/schedule', {
        date: date
      }).then(data => {
        this.courseDate = []
        for (const i in data) {
          if (!data[i]) continue
          this.courseDate.push(data[i])
        }
      })
    },
    requestCourse(date) {
      // 解决浏览器兼容问题，chrome浏览器可以识别 '2019-8-1' 格式，但是safari无法识别；'2019/8/1' 格式才是兼容的
      date = date.replace(/-/g, '/')
      const timestamp = parseInt(new Date(date).getTime() / 1000)
      this.$http.get(`/api/app/study/live/${timestamp}`).then(data => {
        this.courseList = data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.study-calendar {
  header {
    margin-bottom: 5px;
  }
  .info {
    padding: 0 0 20px 20px;
    .date {
      font-size: 30px;
      color: $theme_color;
      margin-right: 30px;
    }
    .course-count {
      font-size: 24px;
      color: #8c8c8c;
    }
  }
}
</style>