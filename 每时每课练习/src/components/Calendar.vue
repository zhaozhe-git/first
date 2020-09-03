<template>
  <div class="calendar">
    <div class="head">
      <span class="date">{{curYear + "年" + curMonth + "月"}}</span>
      <div class="btn">
        <van-icon name="arrow-left" size="20" @click="onPreMonth"></van-icon>
        <van-icon name="arrow" style="margin:0 30px;" size="20" @click="onNextMonth"></van-icon>
      </div>
    </div>
    <div class="body">
      <div class="title">
        <div class="cell" v-for="(item, index) in titleList" :key="index">{{item}}</div>
      </div>
      <div class="day">
        <div
          class="cell"
          :class="{pointer: item!==0}"
          v-for="(item, index) in dayList"
          :key="index"
          @click="onClickDay(item)"
        >
          <span
            v-if="item!==0"
            class="text"
            :class="{today: item.isToday, select: item.day == selectDay, 'has-course': hasCourse(item.date)}"
          >{{item.day}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "calendar",
  props: {
    courseDate: {
      //含有课程的日期集合 如['2019-8-1', '2019-8-15']
      type: Array,
      default() {
        return [];
      }
    },
    firstDay: {
      //周起始日 1到7
      type: Number,
      default: 1,
      validator(val) {
        if (val >= 1 && val <= 7) {
          return true;
        }
        return false;
      }
    }
  },
  computed: {
    courseDateSet() {
      const retAry = [];
      this.courseDate.forEach(i => {
        retAry.push(new Date(i.replace(/-/g, "/")));
      });
      return retAry;
    }
  },
  data() {
    return {
      event: {
        onCurDate: "onCurDate", //当前日期，初始化时返回
        onChangeDate: "onChangeDate", //日期改变
        onClickDay: "onClickDay" //点击日期
      },
      curYear: 2019, //当前年份
      curMonth: 8, //当前月份
      titleList: ["一", "二", "三", "四", "五", "六", "日"],
      dayList: [],
      dayOfMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      nowDate: new Date(),
      selectDay: 0
    };
  },
  mounted() {
    // init props
    const tmpAry = this.titleList.splice(0, this.firstDay - 1);
    this.titleList = this.titleList.concat(tmpAry);
    // init date
    this.init(this.nowDate);
    this.$emit(
      this.event.onCurDate,
      `${this.curYear}-${this.curMonth}-${this.nowDate.getDate()}`
    );
    this.selectDay = this.nowDate.getDate();
  },
  methods: {
    // on event
    onPreMonth() {
      this.curYear = this.curMonth - 1 <= 0 ? this.curYear - 1 : this.curYear;
      this.curMonth = this.curMonth - 1 <= 0 ? 12 : this.curMonth - 1;
      this.selectDay = 0;
      this.init(new Date(`${this.curYear}/${this.curMonth}/1`));
      this.$emit(this.event.onChangeDate, `${this.curYear}-${this.curMonth}-1`);
    },
    onNextMonth() {
      this.curYear = this.curMonth + 1 > 12 ? this.curYear + 1 : this.curYear;
      this.curMonth = this.curMonth + 1 > 12 ? 1 : this.curMonth + 1;
      this.selectDay = 0;
      this.init(new Date(`${this.curYear}/${this.curMonth}/1`));
      this.$emit(this.event.onChangeDate, `${this.curYear}-${this.curMonth}-1`);
    },
    onClickDay(item) {
      this.selectDay = item.day;
      this.$emit(
        this.event.onClickDay,
        `${this.curYear}-${this.curMonth}-${item.day}`
      );
    },
    // other
    init(date) {
      // current
      this.curYear = date.getFullYear();
      this.curMonth = date.getMonth() + 1;
      // day of month
      if (this.isLeapYear(date.getFullYear())) {
        this.dayOfMonth[1] = 29;
      }
      // day list
      const year = date.getFullYear(),
        month = date.getMonth();
      const dayList = [];
      this.dayList = [];
      const dayCount = this.dayOfMonth[month];
      let firstDayWeek = new Date(year, month, 1).getDay();
      firstDayWeek = firstDayWeek == 0 ? 7 : firstDayWeek;
      firstDayWeek = (firstDayWeek - this.firstDay + 7) % 7;
      for (let i = 1; i <= firstDayWeek; ++i) {
        dayList.push(0);
      }
      for (let i = 1; i <= dayCount; ++i) {
        dayList.push(i);
      }
      for (const i of dayList) {
        if (i == 0) {
          this.dayList.push(i);
        } else {
          const date = new Date(year, month, i);
          this.dayList.push({
            date,
            day: i,
            isToday: this.isDateEqual(date, this.nowDate)
          });
        }
      }
    },
    isLeapYear(year) {
      if (year % 100 == 0) {
        return year % 400 == 0;
      }
      return year % 4 == 0;
    },
    isDateEqual(date1, date2) {
      if (
        date1.getFullYear() == date2.getFullYear() &&
        date1.getMonth() == date2.getMonth() &&
        date1.getDate() == date2.getDate()
      ) {
        return true;
      }
      return false;
    },
    hasCourse(date) {
      for (const i of this.courseDateSet) {
        if (this.isDateEqual(i, date)) {
          return true;
        }
      }
      return false;
    }
  }
};
</script>

<style lang="scss" scoped>
.calendar {
  background-color: #fff;
  padding: 40px 0 30px 0;
  .head {
    font-size: 52px;
    color: #595959;
    text-align: left;
    margin-bottom: 50px;
    .date {
      margin: 0 49px;
    }
    .btn {
      float: right;
    }
  }
  .body {
    .cell {
      width: 14.28%;
      height: 90px;
      display: block;
      float: left;
      text-align: center;
      position: relative;
    }
    .pointer {
      cursor: pointer;
    }
    .title {
      font-size: 24px;
      color: #8c8c8c;
      &::after {
        content: "";
        display: block;
        clear: both;
      }
    }
    .day {
      font-size: 34px;
      color: #595959;
      position: relative;
      .today {
        color: $theme_color;
        background-color: $theme_color_light;
        width: 64px;
        height: 64px;
        border-radius: 50%;
      }
      .has-course {
        position: relative;
        &::after {
          content: "";
          display: block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: absolute;
          left: 50%;
          bottom: -15px;
          transform: translateX(-50%);
          background-color: $theme_color;
        }
      }
      .text {
        display: inline-block;
        line-height: 64px;
      }
      .select {
        color: #fff;
        background-color: $theme_color;
        width: 64px;
        height: 64px;
        border-radius: 50%;
      }
      &::after {
        content: "";
        display: block;
        clear: both;
      }
    }
  }
}
</style>