<template>
  <van-list
    v-model="loading"
    :finished="finished"
    :finished-text="showText ? '没有更多了':''"
    @load="onLoad"
  >
    <slot name="item"></slot>
  </van-list>
</template>

<script>
export default {
  name: "list",
  props: {
    url: {
      type: String,
      required: true
    },
    limit: {
      default: 10
    },
    method: {
      type: String,
      default: "post"
    },
    params: {
      type: Object,
      default() {
        return {};
      }
    },
    onFormatter: {
      type: Function
    },
    onGetdata: {
      type: Function
    },
    onFinished: {
      type: Function
    },
    showText: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      finished: false,
      page: 0,
      list: []
    };
  },
  created() {},
  methods: {
  	isText:function(_value) {
        _value = ""+_value;
        if (_value == "null" || _value == null || _value == "" || _value == "undefined") {
            return '';
        }
        return _value;
    },
    // on evnet
    onLoad() {
      this.page++;
      this.requestList();
    },
    // other
    reset(refresh = 0) {
      if (!refresh) {
        this.onGetdata && this.onGetdata([]);
      }
      this.$nextTick(() => {
        if (this.finished) {
          this.page = 0;
          this.finished = false;
        } else {
          this.page = 1;
          this.requestList();
        }
      });
    },
    // request
    requestList() {
      const obj = {
        page: this.page,
        limit: this.limit,
        ...this.params
      };
      this.$http[this.method](this.url, obj).then(res => {
        this.loading = false;
        let data = res.comment || res;
        //console.log(data.list);
        //console.log(this.page)
        if(this.isText(data.current_page)!='')
        {
        	console.log(111);
        	if (data.list.length == 0 && this.page != 1) {
	          this.finished = true;
	          this.onFinished && this.onFinished();
	          return;
	        }
	        this.onFormatter && this.onFormatter(data.list);
	        if (this.page == 1) {
	          this.list = data.list;
	        } else {
	          this.list = this.list.concat(data.list);
	        }
	        this.onGetdata && this.onGetdata(this.list);
        }
        else
        {
        	if (data.length == 0 && this.page != 1) {
	          this.finished = true;
	          this.onFinished && this.onFinished();
	          return;
	        }
	        this.onFormatter && this.onFormatter(data);
	        if (this.page == 1) {
	          this.list = data;
	        } else {
	          this.list = this.list.concat(data);
	        }
	        this.onGetdata && this.onGetdata(this.list);
        	 this.finished = true;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>