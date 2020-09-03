<template>
  <div class="message-detail">
    <Header :title="{name: titleName}"></Header>
    <Empty :empty_type="{name: '暂无消息通知'}" v-if="list.length == 0" style="margin-top:150px;"></Empty>
    <div class="content">
      <List
        ref="list"
        url="/api/app/message/getMessage"
        method="post"
        :params="{message_classify}"
        :on-getdata="onGetdata"
        :showText="list.length > 0"
      >
        <ul slot="item" class="item">
          <li v-for="(item, index) in list" :key="index">
            <p class="time">{{item.created_at | fomartTime('MM月dd日 hh:mm')}}</p>
            <p class="content">
              <span v-html="item.content"></span>
              <a class="link" v-if="item.link_type" @click.prevent="onLink(item)">点击支付>></a>
            </p>
          </li>
        </ul>
      </List>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Empty from '@/components/Empty'
import List from '@/components/List'
export default {
  name: 'message-detail',
  components: {
    Header,
    Empty,
    List
  },
  data() {
    return {
      list: [],
      message_classify: this.$route.query.message_classify,
    }
  },
  computed: {
    titleName() {
      switch (this.message_classify) {
        case 'course': return '课程通知'
        case 'system': return '系统通知'
        case 'order': return '订单通知'
        case 'oto': return '约课通知'
        default: return ''
      }
    }
  },
  created() { },
  methods: {
    // on event
    onGetdata(data) {
      this.list = data
    },
    onLink(item) {
      this.$router.push({
        name: 'OrderDetail',
        query: {
          order_id: item.order_id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.message-detail {
  .header {
    border-bottom: 1px solid #f5f5f5;
  }
  .content {
    .item {
      padding: 0 20px;
      li {
        padding: 30px 0;
        border-bottom: 1px solid #f5f5f5;
        .time {
          width: 174px;
          height: 48px;
          background: #b7b7b7;
          border-radius: 4px;
          font-size: 22px;
          color: #fff;
          line-height: 48px;
          padding: 0 10px;
          text-align: center;
          margin: 0 auto;
        }
        .content {
          font-size: 26px;
          color: #8c8c8c;
          line-height: 36px;
          padding: 0 20px;
          margin-top: 30px;
          .link {
            color: $theme_color;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>