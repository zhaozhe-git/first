<template>
  <div class="point-row">
    <div class="content">
      <img
        class="icon"
        src="@/assets/images/point/jia@2x.png"
        style="width:28px;"
        v-if="data.child&&data.child.length&&!data.expand"
        @click="onExpand"
      />
      <img
        class="icon"
        src="@/assets/images/point/jian@2x.png"
        style="width:28px;"
        v-else-if="data.child&&data.child.length&&data.expand"
        @click="onExpand"
      />
      <img
        class="icon"
        src="@/assets/images/point/jian-hui@3x.png"
        style="width:28px;"
        v-if="!data.child||!data.child.length"
      />
      <div class="main">
        <div class="name-container">
          <div class="name">{{data.name}}</div>
          <div class="topic">{{data.finished_amount||0}}/{{data.question_amount}}</div>
        </div>
        <div class="progress">
          <div
            class="progress-complete"
            v-if="data.question_amount>0"
            :style="{'width':data.finished_amount/data.question_amount*100+'%'}"
          ></div>
        </div>
      </div>
      <div class="operate">
        <img
          v-if="data.question_amount>0"
          src="@/assets/images/point/arrow@2x.png"
          style="width:14px;"
          @click="$router.push({name:'Ques',query:{id:data.id,number:number,type:'Point'}})"
        />
      </div>
    </div>
    <div class="child" v-if="data.expand">
      <PointRow v-for="child in data.child" :key="child.id" :data="child" :number="number"></PointRow>
    </div>
  </div>
</template>
<script>
export default {
  name: "PointRow",
  props: {
    data: {
      type: Object
    },
    number: {
      type: Number
    }
  },
  created() {
    this.$set(this.data, "expand", false);
  },
  methods: {
    onExpand() {
      this.data.expand = !this.data.expand;
      if (this.data.expand) {
        this.$emit("onExpand", this.data.id);
      }
    }
  },
  watch: {
    data() {
      this.$set(this.data, "expand", false);
    }
  }
};
</script>
<style lang="scss" scoped>
.point-row {
  margin-bottom: 43px;
  &:last-child {
    margin-bottom: 0;
  }
}
.content {
  display: flex;
  align-items: center;
  position: relative;
  .icon {
    position: absolute;
    top: 2px;
  }
  .main {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    margin-left: 50px;
    margin-right: 76px;
    .name-container {
      display: flex;
      align-items: center;
    }
    .progress {
      height: 6px;
      background: rgba(245, 245, 245, 1);
      border-radius: 3px;
      overflow: hidden;
      .progress-complete {
        height: 100%;
        background: $theme-color;
      }
    }
    .name {
      flex-grow: 1;
      font-size: 26px;
      color: rgba(89, 89, 89, 1);
      padding-bottom: 20px;
    }
    .topic {
      width: 64px;
      text-align: center;
      font-size: 26px;
      color: #8c8c8c;
      padding: 0 76px;
      padding-bottom: 20px;
    }
  }
  .operate {
    width: 14px;
    display: flex;
    align-items: center;
  }
}
.child {
  padding-left: 30px;
  margin-top: 43px;
}
</style>