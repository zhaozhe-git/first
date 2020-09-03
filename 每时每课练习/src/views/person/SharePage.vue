<template>
<div class="share-page">
    <!-- <img :src="shareImg"> -->
</div>
</template>

<script>
import Header from '@/components/Header'
export default {
  name: 'SharePage',
  components: {

  },
  data() {
    return {
        shareImg:''
    }
  },
  created() {
  	this.requestShareImg()
  },
  methods: {
    requestShareImg() {
      this.$http.post("/api/app/public/share").then(data => {
        this.shareImg = data.path
      });
    }
  }
}
</script>

<style lang="scss" scoped>
img{
  width: 100%;
}
</style>
