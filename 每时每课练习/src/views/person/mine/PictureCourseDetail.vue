<template>
  <div class="picture-course-detail">
    <Header :title="title"></Header>
    <div class="content" v-html="content"></div>
  </div>
</template>

<script>
import Header from "@/components/Header"
export default {
  name: 'picture-course-detail',
  components: {
    Header
  },
  data() {
    return {
      title: {
        name: this.$route.query.chapter_name
      },
      content: ''
    }
  },
  created() {
    this.requestDetail()
  },
  methods: {
    // request
    requestDetail() {
      this.$http.get(`/api/app/chapterInfo/${this.$route.query.chapter_id}`).then(data => {
        this.content = data.course_content
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.picture-course-detail {
  .header {
    border-bottom: 1px solid #f5f5f5;
  }
  .content {
    padding: 30px 20px;
    font-size: 32px;
    font-weight: 400;
  }
}
</style>