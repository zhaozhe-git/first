<template>
  <div class="container" v-if="show&&!showSearch">
    <headers :title="{name:'题库选择'}" :goBackHandler="goBackHandler"></headers>
    <van-search
      class="search"
      v-model="keywords"
      placeholder="请输入题库名称关键词"
      shape="round"
      @search="onSearchBank"
    >
      <template v-slot:left-icon>
        <div></div>
      </template>
      <template v-slot:right-icon>
        <i class="van-icon van-icon-search" @click="onSearchBank"></i>
      </template>
    </van-search>
    <div class="select-container">
      <div class="left">
        <div
          @click="changeClassify(item.id)"
          class="item"
          :class="{'active':classify==item.id}"
          v-for="item in classifyList"
          :key="item.id"
        >{{item.name}}</div>
      </div>
      <div class="right">
        <div class="item" v-for="item in subClassifyList" :key="item.id">
          <div class="classify-name">{{item.name}}</div>
          <div class="bank-list">
            <div class="bank-warp" v-for="(banks,index) in item.bankGroup" :key="index">
              <span
                class="bank"
                :class="{'active':bankId==bank.id}"
                v-for="bank in banks"
                :key="bank.id"
                @click="changeBank(bank)"
              >{{bank.name}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="search-container" v-else-if="show&&showSearch">
    <van-search
      class="search"
      v-model="keywords"
      placeholder="请输入题库名称关键词"
      show-action
      shape="round"
      @search="onSearchBank"
      @cancel="showSearch=false"
    >
      <template v-slot:left-icon>
        <i class="van-icon van-icon-search" @click="onSearchBank"></i>
      </template>
    </van-search>
    <div class="line"></div>
    <div class="empty" v-if="keywords!=''&&searchBanks.length==0">
      <img src="@/assets/images/point/empty@2x.png" style="width:140px;" />
      <div>没有搜索到相关内容</div>
    </div>
    <div class="list" v-if="keywords!=''&&searchBanks.length>0">
      <div
        class="bank"
        v-for="bank in searchBanks"
        :key="bank.id"
        @click="changeBank(bank)"
      >{{bank.name}}</div>
    </div>
    <div class="search-record" v-if="keywords==''">
      <div class="clear title bold">
        <span class="f-left">历史搜索</span>
        <img
          class="f-right"
          src="@/assets/images/crash@2x.png"
          style="width:25px;"
          @click="clearRecord"
        />
      </div>
      <div class="records">
        <span
          class="record"
          v-for="record in searchBankRecords"
          :key="record"
          @click="recordClick(record)"
        >{{record}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import headers from "@/components/Header";
export default {
  name: "BankSelect",
  components: {
    headers
  },
  props: {
    selectedClassifyId: {
      type: Number,
      default: 0
    },
    selectedSubClassifyId: {
      type: Number,
      default: 0
    },
    selectedBankId: {
      type: Number,
      default: 0
    },
    show: {
      type: Boolean,
      default: false
    },
    goBefore: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      classifyList: [],
      classify: 0,
      subClassifyList: [],
      subClassify: 0,
      bankId: 0,
      keywords: "",
      showSearch: false,
      searchBanks: [],
      searchBankRecords: []
    };
  },
  async created() {
    this.searchBankRecords = this.getSearchRecord();
    this.classify = this.selectedClassifyId;
    this.bankId = this.selectedBankId;
    let data = await this.$http.get("/api/app/wap/classify");
    this.classifyList = data;
    if (this.classifyList.length > 0) {
      if (this.classify == 0) {
        this.classify = this.classifyList[0].id;
      }
      await this.getSubClassify();
    }
  },
  methods: {
    async getSubClassify() {
      let data = await this.$http.get("/api/app/wap/quesBank/" + this.classify);
      data.forEach(subClassify => {
        subClassify.bankGroup = {};
        if (!subClassify.bank) {
          return;
        }
        for (let i = 0; i < subClassify.bank.length; i++) {
          let index = parseInt(i / 2);
          subClassify.bankGroup[index] = subClassify.bankGroup[index] || [];
          subClassify.bankGroup[index].push(subClassify.bank[i]);
        }
      });
      this.subClassifyList = data;
    },
    async changeClassify(classify) {
      this.classify = classify;
      await this.getSubClassify();
    },
    changeBank(bank) {
      this.bankId = bank.id;
      this.subClassify = bank.classify_id || 0;
      this.$emit("onChange", {
        classifyId: this.classify,
        subClassifyId: this.subClassify,
        bankId: this.bankId,
        name: bank.name
      });
      this.$emit("update:show", false);
    },
    goBackHandler() {
      if (this.goBefore) {
        history.go(-1);
        return;
      }
      this.$emit("update:show", false);
    },
    getSearchRecord() {
      if (localStorage.searchBankRecord) {
        return JSON.parse(localStorage.searchBankRecord);
      }
      return [];
    },
    setSearchRecord() {
      let records = [];
      if (localStorage.searchBankRecord) {
        records = JSON.parse(localStorage.searchBankRecord);
      }
      if (records.indexOf(this.keywords) < 0) {
        records.push(this.keywords);
      }
      localStorage.searchBankRecord = JSON.stringify(records);
      this.searchBankRecords = records;
    },
    clearRecord() {
      localStorage.removeItem("searchBankRecord");
      this.searchBankRecords = [];
    },
    async recordClick(record) {
      this.keywords = record;
      let data = await this.$http.get("/api/app/wap/search/bank", {
        bank: this.keywords
      });
      this.searchBanks = data;
    },
    async onSearchBank() {
      if (this.keywords == "") {
        this.$toast({ message: "请输入题库名称关键字", duration: 1000 });
        return;
      }
      let data = await this.$http.get("/api/app/wap/search/bank", {
        bank: this.keywords
      });
      this.searchBanks = data;
      this.showSearch = true;
      this.setSearchRecord();
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
.select-container {
  min-height: 100%;
  border-top: 1px solid #eaeaea;
  display: flex;
  flex-grow: 1;
  .left {
    background: rgba(250, 250, 250, 1);
    margin-right: 40px;
    width: 210px;
    .item {
      font-size: 30px;
      color: rgba(89, 89, 89, 1);
      box-sizing: border-box;
      padding: 36px 46px;
      &.active {
        background: white;
      }
    }
  }
  .right {
    margin-right: 40px;
    flex: 1;
    .item {
      padding-top: 50px;
      .classify-name {
        font-size: 24px;
        color: #595959;
        margin-bottom: 30px;
        font-weight: 400;
      }
      .bank-list {
        width: 480px;
        box-sizing: border-box;
        .bank-warp {
          display: flex;
        }
        .bank {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          color: rgba(100, 100, 100, 1);
          margin-bottom: 20px;
          background: rgba(245, 245, 245, 1);
          border-radius: 4px;
          padding: 16px 24px;
          width: 232px;
          margin-right: 15px;
          text-align: center;
          box-sizing: border-box;
          &:nth-child(2) {
            margin-right: 0;
          }
          &.active {
            color: $theme-color;
            background: $theme_color_light;
          }
        }
      }
    }
  }
}
.search {
  margin-bottom: 30px;
  padding: 0 30px;
  /deep/ {
    .van-field__right-icon {
      padding-right: 24px;
    }
    .van-icon-clear {
      display: none;
    }
    .van-icon-search {
      font-size: 24px;
    }
    .van-field__control {
      font-size: 24px;
      color: rgba(183, 183, 183, 1);
    }
    .van-search__action {
      font-size: 28px;
    }
    .van-search__content {
      padding-left: 25px;
    }
  }
}
.search-container {
  .search {
    padding: 14px 30px;
    margin-bottom: 0;
  }
  .line {
    height: 1px;
    background: rgba(234, 234, 234, 1);
  }
  .empty {
    text-align: center;
    font-size: 30px;
    color: rgba(153, 153, 153, 1);
    padding-top: 195px;
    img {
      margin-bottom: 34px;
    }
  }
  .search-record {
    padding: 28px 34px;
    .title {
      font-size: 28px;
    }
    .records {
      padding: 30px 0 0 30px;
    }
    .record {
      display: inline-block;
      font-size: 24px;
      color: #595959;
      padding: 13px 19px;
      background: rgba(247, 247, 247, 1);
      border-radius: 25px;
      margin-bottom: 20px;
      margin-right: 20px;
    }
  }
  .list .bank {
    font-size: 24px;
    padding: 26px 30px;
    border-bottom: 1px solid #eaeaea;
    color: #595959;
  }
}
</style>