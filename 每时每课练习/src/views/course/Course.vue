<template>
  <div class="course-page">
    <headers :title="title" :returnShow="false" @toGet="goSearh">
      <template slot="right-sum">
        <img class="search" src="@/assets/images/search.png" alt />
      </template>
    </headers>
    <div class="course-fitler">
      <van-dropdown-menu :active-color="$theme_color">
        <van-dropdown-item title="分类" ref="kinds">
          <div class="parent-box">
            <div class="tm-kind" v-for="(item,index) in attrclassify" :key="item.id">
              <p>{{item.name}}</p>
              <div class="tmk-item">
                <span
                  :class="attr_val_id['attr'+index] == it.id ? 'active':''"
                  v-for="it in item.child"
                  :key="it.id"
                  @click="selectId(it.id,'attr'+index)"
                >{{it.name}}</span>
              </div>
            </div>
            <div class="seach-btn">
              <van-button @click="reset">重置</van-button>
              <van-button @click="searchFor('kinds')">确定</van-button>
            </div>
          </div>
        </van-dropdown-item>
        <van-dropdown-item title="排序" ref="sort">
          <ul class="course-sort">
            <li
              :class="order_by == item.value ? 'active':''"
              v-for="item in option"
              :key="item.value"
              @click="selectType('sort',item.value)"
            >{{item.text}}</li>
          </ul>
        </van-dropdown-item>
        <van-dropdown-item title="筛选" ref="filter">
          <div class="filter-box">
            <div class="tm-kind">
              <div class="tmk-item">
                <span
                  :class="course_type == item.type ? 'active':''"
                  v-for="item in course_types"
                  :key="item.type"
                  @click="selectType('filter',item.type)"
                >{{item.value}}</span>
              </div>
            </div>
          </div>
        </van-dropdown-item>
      </van-dropdown-menu>
    </div>
    <List
      ref="list"
      url="/api/app/courseBasis"
      method="get"
      :params="params"
      :on-getdata="onGetdata"
    >
      <course-item slot="item" :course="courses"></course-item>
    </List>
  </div>
</template>

<script>
import headers from "@/components/Header";
import courseItem from "@/components/CourseItem";
import List from "@/components/List";
export default {
  name: "Course",
  components: {
    headers,
    courseItem,
    List
  },
  data() {
    return {
      title: {
        name: "特色课"
      },
      option: [
        { text: "综合排序", value: 0 },
        { text: "最新", value: 1 },
        { text: "最热", value: 2 },
        { text: "价格从低到高", value: 3 },
        { text: "价格从高到低", value: 4 }
      ],
      attrclassify: [],
      classify_id: "",
      attr_val_id: {},
      order_by: "",
      course_types: [
        { type: 0, value: "全部" },
        { type: 2, value: "大班课" },
        { type: 3, value: "小班课" },
        { type: 4, value: "公开课" },
        { type: 5, value: "点播课" },
        { type: 7, value: "面授课" },
        { type: 8, value: "音频课" },
        { type: 9, value: "系统课" },
        { type: 10, value: "图文课" },
        { type: 11, value: "会员课" }
      ],
      course_type: 0,
      courses: [],
      params: {}
    };
  },
  created() {
    this.getClassify();
  },
  methods: {
    onLoad() {
      this.page++;
      this.getCourses();
    },
    goSearh() {
      this.$router.push({
        name: "Search"
      });
    },
    reset() {
      for (let i in this.attr_val_id) {
        this.attr_val_id[i] = 0;
      }
      this.searchFor("kinds");
    },
    searchFor(name) {
      this.$refs[name].toggle();
      this.params = {
        course_type: this.course_type != 11 ? this.course_type : 0,
        classify_id: this.classify_id,
        order_by: this.order_by,
        attr_val_id: this.$pub.objToStr(this.attr_val_id, ","),
        is_vip: this.course_type == 11 ? 1 : 0
      };
      this.$refs.list.reset();
    },
    selectType(name, val) {
      if (name == "filter") {
        this.course_type = val;
      } else {
        this.order_by = val;
      }
      this.searchFor(name);
    },
    selectId(id, attr) {
      this.$set(this.attr_val_id, attr, id);
    },
    getClassify() {
      this.$http.get(`/api/app/courseClassify`).then(res => {
        this.attrclassify = res.attrclassify;
        let attr_val_id = {};
        res.attrclassify.forEach((item, index) => {
          attr_val_id["attr" + index] = 0;
        });
      });
    },
    onGetdata(data) {
      this.courses = data;
    }
  },
  watch: {
    $route(val) {
      if (val.name == "Course") {
        this.$refs.list.reset();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.course-page {
  min-height: 100vh;
  background: #f0f2f5;
  padding-bottom: 100px;
  .search {
    width: 38px;
    height: 40px;
    margin-top: 20px;
  }
  .course-fitler {
    height: 84px;
  }
  .parent-box {
    padding-left: 30px;
    padding-bottom: 20px;
    .seach-btn {
      padding: 30px 0px;
      display: flex;
      justify-content: space-between;
      button {
        width: 340px;
        height: 66px;
        background: rgba(255, 255, 255, 1);
        border-radius: 8px;
        border: 2px solid rgba(217, 217, 217, 1);
        font-size: 26px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(89, 89, 89, 1);
        margin-right: 20px;
        &:last-child {
          color: #fff;
          background: $theme_color;
          border: 0;
        }
      }
    }
  }
  .filter-box {
    padding-top: 40px;
    padding-left: 30px;
  }
  .tm-kind {
    padding-bottom: 20px;
    border-bottom: 1px solid #f1f1f1;
    p {
      padding: 32px 0 20px;
      font-size: 24px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(89, 89, 89, 1);
    }
    .tmk-item {
      span {
        margin: 0 46px 14px 0;
        display: inline-block;
        width: 138px;
        height: 66px;
        background: rgba(245, 245, 245, 1);
        border-radius: 6px;
        font-size: 26px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: #646464;
        text-align: center;
        line-height: 66px;
        overflow: hidden;
        &:nth-child(4n + 0) {
          margin-right: 0;
        }
      }
      span.active {
        color: $theme_color;
        background: #ebeefe;
      }
    }
  }
  .course-sort {
    background: #fff;
    li {
      height: 102px;
      text-align: center;
      line-height: 102px;
      font-size: 28px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(89, 89, 89, 1);
      border-bottom: 1px solid #f5f5f5;
      &:last-child {
        border: 0;
      }
    }
    li.active {
      color: $theme_color;
    }
  }
}
</style>
