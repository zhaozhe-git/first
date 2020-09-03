<template>
  <div class="concern">
    <Header :title="{name: '我的关注'}"></Header>
    <Empty :empty_type="{name: '暂无关注'}" v-if="list.length == 0" style="margin-top:150px;"></Empty>
    <div class="content">
      <List
        ref="list"
        url="/api/app/collect"
        method="get"
        :params="{type: 2}"
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
          <img :src="item.avatar" />
          <div class="info">
            <p class="name">
              <span>{{item.teacher_name}}</span>
              <span>{{item.level_name}}</span>
            </p>
            <p class="introduction">{{item.introduction}}</p>
          </div>
          <p class="btn" @click.stop="onUnstar(item)">取消关注</p>
        </div>
      </List>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Empty from '@/components/Empty'
import List from '@/components/List'
export default {
  name: 'concern',
  components: {
    Header,
    Empty,
    List
  },
  data() {
    return {
      list: []
    }
  },
  created() { },
  methods: {
    // on event
    onGetdata(data) {
      this.list = data;
    },
    onItem(item) {
      this.$router.push({
        name: 'Teacher',
        query: {
          id: item.teacher_id
        }
      })
    },
    onUnstar(item) {
      this.$http.put(`/api/app/collect/cancel/${item.collect_id}/2`)
        .then(() => {
          this.$toast({
            message: '取消收藏成功',
            position: 'bottom',
            duration: 1500
          })
          setTimeout(() => {
            this.$refs.list.reset()
          }, 500)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.concern {
  @extend %default-bg;
  .content {
    padding: 30px 20px;
    .item {
      background-color: #fff;
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 10px;
      position: relative;
      display: flex;
      align-items: center;
      img {
        width: 80px;
        height: 80px;
      }
      .info {
        margin-left: 20px;
        line-height: 50px;
        .name {
          span:nth-of-type(1) {
            font-size: 30px;
            color: #595959;
          }
          span:nth-of-type(2) {
            margin-left: 12px;
            font-size: 22px;
            color: #ea7a2f;
          }
        }
        .introduction {
          font-size: 24px;
          color: #b7b7b7;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 400px;
        }
      }
      .btn {
        position: absolute;
        top: 50%;
        right: 30px;
        transform: translateY(-50%);
        font-size: 26px;
        color: $theme_color;
        text-align: center;
        width: 152px;
        height: 56px;
        line-height: 56px;
        background: $theme_color_light;
        border-radius: 31px;
      }
    }
  }
}
</style>