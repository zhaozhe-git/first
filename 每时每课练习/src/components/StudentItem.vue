<template>
  <el-card class="student-card" shadow="hover">
    <div class="top">
      <div class="avatar" @click="student_detail(value)">
        <el-avatar shape="circle" :size="76" :src="value.avatar"></el-avatar>
      </div>
      <div class="info" @click="student_detail(value)" title="点击查看学员信息">
        <p class="date">{{value.course_time}}</p>
        <p class="text">
          <span class="name">学员：{{value.nickname}}</span>
          <span class="tips">{{value.course_tips}}</span>
        </p>
      </div>
    </div>
    <div class="btn">
    		<div v-if="type==1">
    		<el-button type="text" @click="onCommunicate" :class="{message: value.is_read}">沟通记录</el-button>
        <el-button type="text" v-if="type==1" @click="onLeave">请假</el-button>
        <el-button type="text" class="kggt" @click="goutong(value)" v-if="value.talk_id>0">
        	<i v-if="value.is_new==1"></i>课管沟通
        </el-button>
        <el-button type="text" style="color:#999;" v-else>课管沟通</el-button>
    		</div>
        <div v-if="type==2" style="flex:2">
          <!-- <el-button
            type="primary"
            round
            size="text"
            @click="dialogVisibleFromStudent = true"
          >
          <img class="msg" src="../assets/images/评论-1@2x.png">
          学生评论</el-button> -->
          <el-button type="text" @click="onCommunicate" :class="{message: value.is_read}">沟通记录</el-button>
          <el-button
            v-if="value.is_comment==0"
            type="text"
            round
            size="small"
            @click="dialogVisible = true;commentData.content=''"
          >       
          点评学员</el-button>
          <el-button
            class="commented"
            v-else
            type="text"
            round
            size="small"
             @click="dialogVisible = true;commentData.content=''"
          >
          已点评</el-button>
          <el-button type="text" class="kggt" @click="goutong(value)" v-if="value.talk_id>0">
        	<i v-if="value.is_new==1"></i>课管沟通
        	</el-button>
        	<el-button type="text" style="color:#999;" v-else>课管沟通</el-button>
          <el-button
            type="primary"
            round
            size="text"
            @click="course_feedback=true;commentData.content=''"
          >
          课后反馈</el-button>
        </div>
    </div>
    <!-- <div class="bottom" v-if="value.comment_info">
      <div class="divider"></div>
      <div class="content">
        <div class="text">学员评价：</div>
        <div class="comment">
          <div class="grade comment-item">
            <el-rate v-model="value.comment_info.grade" disabled></el-rate>
          </div>
          <div class="tag comment-item">
            <span v-for="(item, index) in value.comment_info.tags" :key="index">{{item}}</span>
          </div>
          <div class="comment-text">{{value.comment_info.content}}</div>
        </div>
      </div>
    </div> -->
    <!-- 点评学员 -->
    <el-dialog
      :title="`点评学员${value.nickname}`"
      :visible.sync="dialogVisible"
      @open="onOpenDlg"
      width="700px"
      center>
      <div>
        <el-input
          type="textarea"
          v-model="commentData.content"
          :placeholder="`请输入对学员的点评内容，最多${maxLength}字`"
          :rows="12"
          :maxlength="maxLength"
          show-word-limit
          :readonly="value.is_comment > 0"
        ></el-input>
      </div>
      <div slot="footer">
        <el-button
          v-if="value.is_comment == 0"
          type="primary"
          style="width:150px;"
          @click="onPublish"
        >发布</el-button>
        <el-button v-else type="primary" style="width:150px;" @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 学员对我的点评 -->
    <el-dialog
      :title="`学员${value.nickname}对我的点评`"
      :visible.sync="dialogVisibleFromStudent"
      @open="onOpenDlg"
      width="700px"
      center
      class="dianpingxueyuan"
      >
      <div>
       <p>姓名：{{value.nickname}}</p> 
       <p v-if='value.comment_info' class="tags">标签：
            <span v-for="(item, index) in value.comment_info.tags" :key="index">{{item}}</span>
       </p>
       <p v-if='value.comment_info' class="con">
          <span>{{value.comment_info?value.comment_info.content:''}}</span>
       </p>
       <p v-if='!value.comment_info' class="con con-no">该学员暂无评价</p>
      </div>
      <div slot="footer">
        <el-button type="primary" style="width:150px;" @click="dialogVisibleFromStudent = false">关闭</el-button>
      </div>
    </el-dialog>
		<el-dialog
      title="课后反馈"
      :visible.sync="course_feedback"
      @open="onOpenDlg"
      width="700px"
      center>
      <div>
        <el-input
          type="textarea"
          v-model="commentData.content"
          :placeholder="`请输入对反馈内容，最多${maxLength}字`"
          :rows="12"
          :maxlength="maxLength"
          show-word-limit
        ></el-input>
      </div>
      <div slot="footer">
        <el-button
          type="primary"
          style="width:150px;"
          @click="course_feedback_ok"
        >发布</el-button>
      </div>
    </el-dialog>
    <el-dialog
  title="课管课前沟通"
  :visible.sync="goutong_box"
  width="90%"
   :before-close="goutong_close"
   center>
  <div style="color: #8c8c8c;" class="el_body">{{goutong_msg}}</div>
  <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" style="width:150px;" @click="goutong_close">关闭</el-button>
     </div>
</el-dialog>
  </el-card>
</template>

<script>
export default {
  name: "student-card",
  props: {
    value: {
      type: Object,
      required: true
    },
    type: {
      required: true,
      default: "1"
    }
  },
  data() {
    return {
    	goutong_box:false,
    	goutong_msg:'',
    	course_feedback:false,
      event: {
        onCommentSuccess: "onCommentSuccess"
      },
      is_com:'该学员无评价',
      dialogVisible: false,
      dialogVisibleFromStudent: false,
      commentData: {
      	feed_back_id: this.value.feed_back_id,
        oto_course_id: this.value.id,
        user_id: this.value.user_id,
        content: "",
        comment_id: this.value.is_comment
      },
      maxLength: 500
    };
  },
  created() {
    // test code
    // this.value.comment_info = {
    //   "id": 4,
    //   "content": "嗯嗯好",
    //   "grade": 1,
    //   "tag_content": "哈哈,形象"
    // }
    // comment tag
    if (this.value.comment_info) {
      this.value.comment_info.tags = this.value.comment_info.tag_content.split(
        ","
      );
    }
  },
  methods: {
  	goutong_close(){
  		this.goutong_box=false;
  		this.$parent.requestList();
  	},
  	goutong(doms){
  		this.goutong_box=true;
		    this.$http
        .get(`/api/lector/teacher/getCourseTalkInfo`,{
        	id:doms.talk_id
        })
        .then(data => {
        	this.goutong_msg=data;
        });
  	},
  	isText(_value){
    if (_value == "null" || _value == null || _value == "" || _value == "undefined") {
        return '';
    }
    return _value;
    },
  	student_detail(item){
  		this.$http
        .get(`/api/lector/teacher/stu/info/${item.user_id}`)
        .then(data => {
          var subject='';
	    	var grade='';
	    	if(this.isText(data.attr)!='')
	    	{
	    		for(var i=0;i<data.attr.length; i++)
	    		{
	    			if(data.attr[i].attr_id==1)
	    			{
	    				grade+=data.attr[i].attr_value+',';
	    			}
	    			if(data.attr[i].attr_id==2)
	    			{
	    				subject+=data.attr[i].attr_value+',';
	    			}
	    		}
subject=(subject.substring(subject.length-1)==',')?subject.substring(0,subject.length-1):subject;
	    		grade=(grade.substring(grade.length-1)==',')?grade.substring(0,grade.length-1):grade;
	    	}
	    	var str='';
	  		str+='<div class="student_detail">';
	  		str+='<ul><li class="zd_name">年级</li><li class="zd_desc">'+grade+'</li></ul>';
	  		str+='<ul><li class="zd_name">学科</li><li class="zd_desc">'+subject+'</li></ul>';
	  		if(this.isText(data.province)!='')
	  		{
	  		str+='<ul>';
	  		str+='<li class="zd_name">地域</li>';
	  		str+='<li class="zd_desc">'+data.province+data.city+'</li>';
	  		str+='</ul>';
	  		}
	  		str+='</div>';
		    this.$alert(str,'学员信息',{
		      dangerouslyUseHTMLString:true,
		      confirmButtonText:'关闭',
		      closeOnClickModal:true,
		      confirmButtonClass:'btn_close'
		    });
        });
  	},
    onCommunicate() {
      this.$router.push({
        name: "teacherCommunicate",
        query: {
          oto_course_id: this.value.id,
          user_id: this.value.user_id,
          teacher_id: this.value.teacher_id,
          tab:this.type
        }
      });
    },
    onEnter() {
      this.$http
        .get(`/api/lector/teacher/getLiveRoomCode/${this.value.id}/0`)
        .then(data => {
          if (data.client_url) {
            const { href } = this.$router.resolve({
              name: "DownloadClient",
              query: {
                url: data.client_url
              }
            });
            window.open(href, "_blank");
          } else {
            window.open(data.web_url, "_blank");
          }
        });
    },
    onLeave() {
      this.$alert("请联系管理员处理", "提示", {
        type: "warning",
        confirmButtonText: "知道了"
      });
    },
    onOpenDlg() {
      if (this.value.is_comment > 0) {
        this.$http
          .post("/api/lector/teacher/comment/add", {
            comment_id: this.value.is_comment
          })
          .then(data => {
            this.commentData.content = data.content;
          });
      }
      if(this.value.feed_back_id>0&&this.course_feedback==true)
      {
      	this.$http
          .post("/api/lector/teacher/feedback/info/"+this.value.feed_back_id,{})
          .then(data => {
            this.commentData.content=data.content;
          });
      }
    },
    course_feedback_ok(){
    	if (this.commentData.content.length == 0) {
        this.$message.error("请输入沟通内容");
        return;
      }
      this.$http
        .post("/api/lector/teacher/comment/addFeedback", this.commentData)
        .then(() => {
          this.$message.success("发布成功");
          this.course_feedback = false;
          this.$emit(this.event.onCommentSuccess);
        });
    },
    onPublish() {
      if (this.commentData.content.length == 0) {
        this.$message.error("请输入点评内容");
        return;
      }
      this.$http
        .post("/api/lector/teacher/comment/add", this.commentData)
        .then(() => {
          this.$message.success("评价成功");
          this.dialogVisible = false;
          this.$emit(this.event.onCommentSuccess);
        });
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/varibles.scss";

.student-card {
  width: 100%;
  margin: 5px 0 20px;
  padding: 0 5px;
  box-sizing: border-box;
  .el-card__body{
    padding-bottom: 0;
  }
  .top {
    display: flex;
    // margin-bottom: 10px;
    .avatar {
      flex: 1;
    }
    .info {
      flex: 4.5;
      padding-left: 10px;
      .date {
        margin-top: 5px;
        font-size:30px;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height:34px;
      }
      .text {
        // margin-top: 12px;
        .name {
          margin-right: 30px;
          font-size:24px;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(153,153,153,1);
          line-height:30px;
        }
        .tips {
          display: block;
          margin-top: 20px;
          font-size:24px;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(153,153,153,1);
          line-height:30px;
        }
      }
    }
  }
  .btn {
      flex: 2.5;
      width: 100%;
      display: flex;
      // height: 108px;
      border-top: 1px solid rgba(238, 238, 238, 1);
      margin-top: 20px;
      .el-button {
        color: $primary-color;
        // color:  rgba(153, 153, 153, 1);
       
        // margin-right: 15px;
        // height: 100%;
        flex: 1;
        border-right: 1px solid rgba(238, 238, 238, 1);
        span{
          font-size:24px;
          font-family:PingFang SC;
          font-weight:400;
          // color:rgba(153,153,153,1);
          line-height:30px;
        }
        &:nth-last-child(1){
          border-right: 0;
        }
        img{
          display: block;
          margin: 0 auto 12px;
          &.book{
            width: 33px;
            height: 36px;
          }
          &.pc{
            width: 38px;
            height: 34px;
          }
          &.msg{
            width: 40px;
            height: 35px;
          }
          &.video{
            width: 39px;
            height: 29px;
          }
          &.person{
            width:31px;
            height: 35px;
          }


        }
      }
      div{
        flex: 1;
        display: flex;
      }
      .el-button.is-round {
        // color: #fff;
      }
      // .el-button.commented {
      //   color: #8c8c8c;
      // }
      .message {
        position: relative;
        &:after {
          content: "";
          display: block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          position: absolute;
          top: calc(50% - 20px);
          right: calc(50% - 55px);
          background-color: #f5222d;
        }
      }
    }
  .bottom {
    .divider {
      width: 100%;
      border-top: 1px solid #eee;
      margin-bottom: 15px;
    }
    .content {
      display: flex;
      .text {
        flex: 1;
        font-size: 16px;
        color: #595959;
      }
      .comment {
        flex: 8;
        .comment-item {
          margin-bottom: 10px;
        }
        .grade {
          display: flex;
          /deep/ .el-rate__icon {
            font-size: 20px;
          }
        }
        .tag span {
          display: inline-block;
          border: 1px solid #d9d9d9;
          color: rgba(0, 0, 0, 0.65);
          background-color: #f5f5f5;
          border-radius: 4px;
          font-size: 12px;
          padding: 0 8px;
          margin-right: 8px;
        }
        .comment-text {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
        }
      }
    }
  }
  .dianpingxueyuan{
    p{
      font-size:24px;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:28px;
      margin-bottom: 60px;
      &.tags span{
        display: inline-block;
        width:146px;
        height:40px;
        // background:rgba(220,105,42,1);
        border:1px solid rgba(220,105,42,1);
        border-radius:4px;
        font-size:20px;
        font-family:PingFang SC;
        font-weight:400;
        // color:rgba(255,255,255,1);
        color:rgba(220,105,42,1);
        text-align: center;
        line-height: 40px;
        margin-right: 14px;
      }
      &.con{
        position: relative;
        font-size:24px;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:36px;
        padding-left: 80px;
        &::before{
          content:'内容：';
          position: absolute;
          top: 0;
          left: 0;
        }
      }
      &.con-no{
        padding: 0 !important;
        &::before{
          content:'';
        }
      }
    }
  }
    .el-dialog{
    width: 80%;
    .el-dialog__title{
      font-size: 30px
    }
    .el-dialog__headerbtn{
      width: 40px;
      height: 40px;
      .el-icon-close{
        width: 100%;
        height: 100%;
        &::before{
          display: block;
          width: 100%;
          height: 100%;
          font-size: 40px;
        }
      }
    }
    .el-textarea__inner{
      font-size: 26px;
      padding-top: 10px;
      padding-bottom: 10px;
    }
    .el-button{
      width: 200px;
      height: 70px;
      span{
        line-height: 40px;
        font-size: 28px;
      }
    }
  }
}
  .el-message-box{
    width: 80%;
    .el-message-box__title{
      font-size: 32px;
    }
    .el-message-box__headerbtn,.el-message-box__close,.el-message-box__close::before{
      width: 30px;
      height: 30px;
      font-size: 30px
    }
    .el-message-box__message{
      margin: 20px 0;
      font-size: 30px;
    }
    .el-button{
      width: 20vw;
      height: 70px;
      span{
        line-height: 40px;
        font-size: 28px;
      }
    }
  }
  .btn_close{background:#eb6100 !important; border-color:#eb6100 !important;}
  .kggt{position: relative;}
  .kggt i{position:absolute;height:8px;width:8px;border-radius:100%;background:#ed4014;z-index:10; top: 10px; left:73%;}
  .el_body{font-size:24px;}
</style>