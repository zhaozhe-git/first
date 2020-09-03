<template>
  <div class="point" v-if="!showBankSelect">
    <headers :title="{name:title}"></headers>
    <div class="line"></div>
    <div class="point-container">
      <div class="select clear">
        <div class="f-left" @click="onShowBankSelect">
          <img src="@/assets/images/point/bank@2x.png" />
          <span>题库选择</span>
        </div>
        <img class="f-right" src="@/assets/images/point/setting@2x.png" @click="showSetting=true" />
      </div>
      <PointRow
        class="point-row-container"
        :data="item"
        :number="number"
        v-for="item in points"
        :key="item.id"
        @onExpand="onExpand"
      ></PointRow>
    </div>
    <van-action-sheet v-model="showSetting" title="考点专练设置">
      <div class="tip">设置考点专练出题数量</div>
      <van-radio-group v-model="number" @change="onNumberChange">
        <van-radio :name="15">随机15道</van-radio>
        <van-radio :name="0">按顺序做题</van-radio>
      </van-radio-group>
      <div class="btn-primary" @click="showSetting=false">确定</div>
    </van-action-sheet>
  </div>
  <BankSelect
    v-else
    :show.sync="showBankSelect"
    @onChange="onBankChange"
    :selectedClassifyId="classifyId"
    :selectedSubClassifyId="subClassifyId"
    :selectedBankId="bankId"
    :goBefore="goBefore"
  ></BankSelect>
</template>
<script>
import headers from "@/components/Header";
import BankSelect from "@/components/question/BankSelect";
import PointRow from "@/components/question/PointRow";
export default {
  name: "Point",
  components: {
    headers,
    BankSelect,
    PointRow
  },
  data() {
    return {
      number: 15,
      showSetting: false,
      showBankSelect: true,
      bankId: 0,
      classifyId: 0,
      subClassifyId: 0,
      points: [],
      goBefore: true,
      title: "考点专练"
    };
  },
  computed: {
    user() {
      return this.$store.state.personInfo;
    }
  },
  watch: {
    user() {
      this.autoSetting();
    }
  },
  async created() {
    this.autoSetting();
  },
  methods: {
    autoSetting() {
      let selectedBank = this.$storage().get("selectedBank");
      if (selectedBank) {
        this.onBankChange(selectedBank);
        this.showBankSelect = false;
      }

      this.number = this.$storage().get("selectedNumber");
      if (this.number === undefined || this.number === null) {
        this.number = 15;
      }
    },
    async onBankChange(bank) {
      this.bankId = bank.bankId;
      this.classifyId = bank.classifyId;
      this.subClassifyId = bank.subClassifyId;
      this.points = await this.$http.get(
        "/api/app/examPoint/" + this.subClassifyId + "/" + this.bankId
      );
      this.title = bank.name;
      this.$storage().set("selectedBank", bank);
    },
    onShowBankSelect() {
      this.goBefore = false;
      this.showBankSelect = true;
    },
    onExpand(id) {
      this.points.forEach(p => {
        if (p.id != id) {
          p.expand = false;
        }
      });
    },
    onNumberChange() {
      this.$storage().set("selectedNumber", this.number);
    }
  }
};
</script>
<style lang="scss" scoped>
.point {
  /deep/ {
    .van-action-sheet__header {
      text-align: center;
      font-size: 34px;
      color: #262626;
      font-weight: 400;
      .van-icon-close {
        width: 30px;
        height: 30px;
        line-height: 30px;
        padding: 0;
        right: 30px;
        top: 32px;
        display: inline-block;
        background-image: url("~@/assets/images/close@2x.png");
        background-size: 100% 100%;
        &::before {
          display: none;
        }
      }
    }
    .van-action-sheet__content {
      .tip {
        font-size: 26px;
        color: #595959;
        padding: 50px 30px;
        font-weight: 300;
      }
      .van-radio-group {
        font-size: 28px;
        margin-bottom: 70px;
        padding: 0 30px;
        display: flex;
        .van-radio {
          flex: 1;
        }
        .van-radio__label {
          line-height: 1;
          color: #595959;
          font-size: 400;
        }
        .van-icon-success {
          background-color: transparent;
          border-color: transparent;
          width: 25px;
          height: 25px;
          background-image: url("~@/assets/images/point/radio-uncheck@2x.png");
          background-size: 100% 100%;
          border-radius: 0;
          background-repeat: no-repeat;
          &::before {
            display: none;
          }
        }
        .van-radio__icon--checked .van-icon-success {
          background-image: url("~@/assets/images/point/radio-check@2x.png");
        }
      }
      .btn-primary {
        font-size: 34px;
        padding: 34px 0;
      }
    }
    .van-radio__icon .van-icon {
      width: 25px;
      height: 25px;
    }
  }
}
.line {
  height: 20px;
  background-color: #f0f2f5;
}
.point-container {
  padding: 30px;
  .select {
    font-size: 30px;
    color: #262626;
    margin-bottom: 40px;
    img {
      width: 31px;
      margin-right: 10px;
    }
  }
  .point-row-container {
    border: 1px solid rgba(217, 217, 217, 1);
    border-radius: 10px;
    margin-bottom: 20px;
    padding: 30px 20px;
  }
}
</style>