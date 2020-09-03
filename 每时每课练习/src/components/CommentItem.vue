<template>
  <div class="com-item-page">
    <List
      :url="url"
      method="post"
      :params="params"
      :on-getdata="onGetdata"
      :on-formatter="onFormatter"
      :showText="false"
      ref="list"
    >
      <ul slot="item">
        <li v-for="(item,index) in comments" :key="index">
          <div class="evaluate-top">
            <img :src="item.avatar" />
            <div class="evaluate-t-left">
              <div class="info">
                <span>{{item.nickname}}</span>
                <van-rate v-model="item.grade" color="#EA7A2F" void-color="#EA7A2F" readonly />
                <span
                  class="times"
                  v-if="params.id"
                >{{item.created_at | fomartTime('yyyy-MM-dd hh:mm')}}</span>
                <!-- <span class="times">{{item.created_at}}</span> -->
              </div>
              <div class="com-label" v-if="item.tag_content">
                <span v-for="(it,idx) in item.tags" :key="idx">{{it}}</span>
              </div>
              <div class="evaluate-btom">{{item.content}}</div>
            </div>
          </div>
        </li>
      </ul>
    </List>
    <empty :empty_type="emptyType" v-if="comments.length == 0"></empty>
  </div>
</template>

<script>
import empty from "./Empty";
import List from "@/components/List";
export default {
  name: "CommentItem",
  components: {
    empty,
    List
  },
  data() {
    return {
      id: this.$route.query.id,
      comments: [],
      emptyType: {
        name: "暂无评论"
      },
      url: "",
      params: {}
    };
  },
  methods: {
    onGetdata(data) {
      this.comments = data;
    },
    onFormatter(data) {
      data.forEach(item => {
        if (item.tag_content) {
          item.tags = item.tag_content.split(",");
        }
      });
    }
  },
  created() {
    if (document.URL.search("teacher") > -1) {
      this.url = "/api/app/teacher/comment";
      this.params = {
        teacher_id: this.id
      };
    } else {
      this.url = "/api/app/courseComment";
      this.params = {
        id: this.id
      };
    }
  },
    mounted() {
    this.$refs.list.onLoad();
  }
};
</script>

<style lang="scss" scoped>
li {
  padding: 20px 20px;
}
.evaluate-top {
  display: flex;
  border-bottom: 1px solid #f1f1f1;
  &:last-child {
    border: 0;
  }
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .evaluate-t-left {
    flex: 1;
    .info {
      display: flex;
      padding-left: 20px;
      align-items: center;
      span {
        &:nth-child(1) {
          font-size: 28px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        }
      }
      .van-rate {
        margin-left: 20px;
        margin-top: 0px;
        height:30px;
        box-sizing: border-box;
        div{float: left;}
        .van-rate__icon {
          font-size: 28px;
          float:left;
        }
      }
      .times {
        flex: 1;
        font-size: 22px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        text-align: right;
      }
    }
  }
}
.com-label {
  padding-top: 10px;
  span {
    display: inline-block;
    width: 176px;
    height: 44px;
    line-height: 44px;
    background: #f5f5f5;
    border-radius: 8px;
    font-size: 24px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(140, 140, 140, 1);
    text-align: center;
    margin-left: 20px;
    margin-bottom: 10px;
  }
}
.evaluate-btom {
  padding-top: 10px;
  line-height: 48px;
  font-size: 24px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  margin-left: 20px;
}
</style>
