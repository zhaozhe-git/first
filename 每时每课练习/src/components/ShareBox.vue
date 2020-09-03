<template>
  <div class>
    <van-dialog
      v-model="show"
      title="分享"
      :close-on-click-overlay="true"
      :show-confirm-button="false"
    >
      <img class="share-img" :src="qrimg" />
    </van-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      qrimg: "",
      show: false
    };
  },
  methods: {
    getUrl() {
      let URL = document.URL + "&share=1";
      this.QueryDetail = URL;
      this.$qrcode.toDataURL(URL, (err, res) => {
        if (err) {
          throw err;
        }
        this.qrimg = res;
      });
    },
    showModel() {
      this.show = true;
    }
  },
  created() {
    this.getUrl();
  }
};
</script>

<style lang="scss" scoped>
.van-dialog {
  width: 70%;
  img {
    display: block;
    margin: 0 auto;
  }
}
</style>
