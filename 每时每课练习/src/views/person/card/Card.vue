<template>
  <div class="card">
    <Header :title="title">
      <div slot="right-sum" @click="onExchange">学习卡兑换</div>
    </Header>
    <Empty :empty_type="{name: '暂无兑换记录'}" v-if="list.length == 0" style="margin-top:150px;"></Empty>
    <div class="content" v-else>
      <p class="title">兑换记录</p>
      <div class="timeline">
        <ul>
          <li v-for="(item, index) in list" :key="index">
            <div class="tail"></div>
            <div class="node"></div>
            <p class="time">兑换时间：{{item.used_at | fomartTime('yyyy.MM.dd hh:mm')}}</p>
            <p class="card-number">卡号：{{item.card_number}}</p>
            <p class="shop-content">商品内容：{{item.title}}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Empty from "@/components/Empty";
export default {
  name: "card",
  components: {
    Header,
    Empty
  },
  data() {
    return {
      title: {
        name: "我的学习卡"
      },
      list: [],
    };
  },
  methods: {
    onExchange() {
      this.$router.push({
        name: "Exchange"
      });
    }
  },
  created() {
    this.$http.post("/api/app/myStudy").then(res => {
      this.list = res
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.card {
  @extend %default-bg;
  .content {
    margin: 26px 20px;
    padding: 30px;
    border-radius: 15px;
    background-color: #fff;
    .title {
      font-size: 30px;
      font-weight: 500;
      color: #262626;
    }
    .timeline {
      ul {
        margin-top: 40px;
        li {
          position: relative;
          padding: 0 0 80px 30px;
          .time,
          .card-number {
            font-size: 28px;
            color: #8c8c8c;
          }
          .shop-content {
            font-size: 28px;
            color: #595959;
          }
          .tail {
            position: absolute;
            top: 4px;
            left: 0;
            height: 100%;
            border-left: 4px solid #e9e9e9;
          }
          .node {
            position: absolute;
            top: 4px;
            left: -5px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: $theme_color;
          }
          p {
            margin-bottom: 20px;
            &:last-child {
              margin-bottom: 0;
            }
          }
          &:last-child .tail {
            display: none;
          }
          &:last-child {
            padding-bottom: 0;
          }
        }
      }
    }
  }
}
</style>
