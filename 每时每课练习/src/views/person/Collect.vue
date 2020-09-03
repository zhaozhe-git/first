<template>
  <div class="collect">
    <Header :title="{name: '我的收藏'}"></Header>
    <Empty :empty_type="{name: '暂无收藏'}" v-if="list.length == 0" style="margin-top:150px;"></Empty>
    <div class="content">
      <List
        ref="list"
        url="/api/app/collect"
        method="get"
        :params="{type: 1}"
        :on-formatter="onFormatter"
        :on-getdata="onGetdata"
        :showText="list.length > 0"
      >
        <div
          slot="item"
          class="item"
          v-for="(item, index) in list"
          :key="index"
          @click="onItem(item)"
        >
          <div class="collect-icon" @click.stop="onUnstar(item)"></div>
          <div class="top">
            <p class="title">{{item.title}}</p>
            <p class="time">
              <span class="duration" v-if="$pub.showDuration(item.course_type)">
                <img class="clock" src="@/assets/images/icon-time.png" alt />
                <span>{{item.start_play_date | fomartTime('MM月dd日 hh:mm')}} ~ {{item.end_play_date | fomartTime('MM月dd日 hh:mm')}}</span>
              </span>
              <span>共{{item.section_num}}课时</span>
            </p>
            <ul class="teachers">
              <li v-for="(teacher, index) in item.teacherAry" :key="index">
                <img :src="teacher.avatar" />
                <span>{{teacher.name}}</span>
              </li>
            </ul>
          </div>
          <div class="bottom">
            <div class="info">
              <p class="sign">{{item.sales_num}}人已报名</p>
              <div class="price">
                <p class="price-line" v-if="item.underlined_price">
                  <img class="price-ico" :src="$store.state.config.price_ico" />
                  {{item.underlined_price | toFixPrice}}
                </p>
                <p class="price-now">
                  <img class="price-ico" :src="$store.state.config.price_ico" />
                  {{item.price | toFixPrice}}
                </p>
              </div>
            </div>
          </div>
        </div>
      </List>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Empty from "@/components/Empty";
import List from "@/components/List";
export default {
  name: "collect",
  components: {
    Header,
    Empty,
    List
  },
  data() {
    return {
      list: []
    };
  },
  methods: {
    // on event
    onFormatter(rows) {
      rows.forEach(i => {
        if (i.teachers && i.teachersAvatar) {
          const tNames = i.teachers.split(",");
          const tAvatars = i.teachersAvatar.split(",");
          i.teacherAry = [];
          for (let m = 0; m < tNames.length && m < 3; ++m) {
            i.teacherAry.push({
              name: tNames[m],
              avatar: tAvatars[m]
            });
          }
        }
      });
    },
    onGetdata(data) {
      this.list = data;
    },
    onItem(item) {
      this.$pub.InAppPage("CourseDetail", {
        id: item.course_id,
        courseType: item.course_type
      });
    },
    onUnstar(item) {
      this.$http
        .put(`/api/app/collect/cancel/${item.collect_id}/1`)
        .then(() => {
          this.$toast({
            message: "取消收藏成功",
            position: "bottom",
            duration: 1500
          });
          setTimeout(() => {
            this.$refs.list.reset();
          }, 500);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.collect {
  @extend %default-bg;
  .content {
    padding: 30px 20px;
    .item {
      background-color: #fff;
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 10px;
      position: relative;
      .collect-icon {
        background: url("~@/assets/theme-img/icon-star.png") no-repeat center;
        background-size: 28px 28px;
        width: 60px;
        height: 60px;
        float: right;
      }
      .top {
        .title {
          font-size: 32px;
          font-weight: 500;
          color: #000;
        }
        .time {
          margin-bottom: 60px;
          font-size: 24px;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          margin-top: 20px;

          .duration {
            margin-right: 20px;
            position: relative;
            * {
              vertical-align: middle;
            }
            .clock {
              width: 28px;
              height: 28px;
              margin-right: 10px;
            }
            &::after {
              content: "";
              display: block;
              width: 1px;
              height: 20px;
              position: absolute;
              top: 50%;
              right: -10px;
              transform: translateY(-50%);
              background-color: #999;
            }
          }
        }
        .teachers {
          display: flex;
          justify-content: flex-start;
          margin-top: 50px;
          li {
            img {
              width: 56px;
              height: 56px;
              border-radius: 50%;
              vertical-align: middle;
            }
            span {
              font-size: 22px;
              color: rgba(0, 0, 0, 0.45);
              vertical-align: middle;
              margin-left: 15px;
              display: inline-block;
              width: 120px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
      .bottom {
        border-top: 1px solid #f5f5f5;
        margin-top: 30px;
        padding-top: 10px;
        .info {
          .sign {
            font-size: 24px;
            color: rgba(0, 0, 0, 0.45);
            display: inline-block;
            text-align: left;
          }
          .price {
            float: right;
            .price-line {
              font-size: 24px;
              color: rgba(0, 0, 0, 0.45);
              text-decoration: line-through;
              display: inline-block;
            }
            .price-now {
              font-size: 35px;
              color: #ee1f1f;
              display: inline-block;
              &::first-letter {
                font-size: 24px;
              }
            }
          }
        }
      }
    }
  }
}
.price-ico {
  width: 16px;
}
</style>