<template>
    <div class="my-progress" :style="progressStyle">
    <span :style="{width: percent + '%'}"></span>
  </div>
</template>

<script>
export default {
  name: 'my-progress',
  props: {
    percent: {
      default: 0
    },
    height: {
      default: 8
    },
    width: {
      default: 100
    }
  },
  data() {
    return {}
  },
  computed: {
    progressStyle() {
      let widthStr = this.width + ''
      if (!widthStr.includes('%')) {
        widthStr = this.$pub.px2vw(widthStr)
      }
      let heightStr = this.height + ''
      if (!heightStr.includes('%')) {
        heightStr = this.$pub.px2vw(heightStr)
      }
      return {
        width: widthStr,
        height: heightStr
      }
    }
  },
  created() { },
  methods: {}
}
</script>

<style lang="scss" scoped>
.my-progress {
  display: inline-block;
  border-radius: 5px;
  background-color: #f5f5f5;
  position: relative;
  span {
    position: absolute;
    left: 0;
    display: inline-block;
    height: 100%;
    border-radius: 5px;
    background-color: $theme_color;
  }
}
</style>