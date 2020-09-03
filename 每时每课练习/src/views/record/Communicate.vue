<template>
  <div class="communi-page">
    <div class="header">
      <header>
        <span class="back" @click="onBack">
          <img src="@/assets/images/white-return.png" />
        </span>
        <h3>沟通记录</h3>
      </header>
      <div class="teacher-info">
        <div class="ti-base">
          <img :src="teacher.teacher_avatar" alt />
          <div>
            <p>
              讲师：
              <span>{{teacher.teacher_name}}</span>
            </p>
            <p>上课时间：{{teacher.course_time}}</p>
          </div>
          <van-button @click="showConcat=true">发起沟通</van-button>
        </div>
      </div>
    </div>
    <div class="record-list">
      <div class="rl-item" v-for="(item, index) in records" :key="index">
        <div class="rl-box" :class="{'rl-own': item.belong == 0}">
          <span class="name">{{item.belong==0? '我': item.teacher_name}}</span>
          <div class="rl-content">
            <p class="text">{{item.content}}</p>
            <p class="time">{{item.created_at | fomartTime('yyyy.MM.dd hh:mm')}}</p>
            <div class="img-list">
              <p v-for="(img,i) in item.img_url">
              <span @click="downloadFile(img)" v-if="file_kzm(img)=='.docx'||file_kzm(img)=='.doc'" class="image">
                		<img :src="doc_img">
                	</span>
                	<span @click="downloadFile(img)" v-if="file_kzm(img)=='.pdf'||file_kzm(img)=='.PDF'" class="image">
                		<img :src="pdf_img">
                	</span>
                	<span @click="downloadFile(img)" v-if="file_kzm(img)=='.ppt'||file_kzm(img)=='.pptx'" class="image">
                		<img :src="ppt_img">
                	</span>
                	<span @click="downloadFile(img)" v-if="file_kzm(img)=='.txt'||file_kzm(img)=='.TXT'" class="image">
                		<img :src="txt_img">
                	</span>
                	<span @click="downloadFile(img)" v-if="file_kzm(img)=='.xls'||file_kzm(img)=='.xlsx'" class="image">
                		<img :src="xls_img">
                	</span>
                	<img
                	v-if="file_kzm(img)=='.jpg'||file_kzm(img)=='.jpeg'||file_kzm(img)=='.png'||file_kzm(img)=='.gif'"
                  class="image"
                  :src="img"
                  :key="i"
                   @click="preview(img)"
                />
              </p>
            </div>
          </div>
          <button v-if="item.belong == 0" @click="deleteConcat(item.id)">删除</button>
        </div>
      </div>
    </div>
    <van-action-sheet v-model="showConcat" title="发起沟通">
    	
      <div class="c-content">
        <textarea
         placeholder=" 请输入要与老师沟通的问题，比如希望老师上课讲的问题，最多500字"
         v-model="content"
         @blur="iosToTop" 
         name 
         id></textarea>
         <p style="padding-bottom:20px; font-size: 18px;">请上传gif,jpeg,jpg,png,doc,docx,pdf,ppt,pptx,txt,xlsx,xls文件</p>
        <van-uploader
          v-model="fileList"
          multiple
          :after-read="afterRead"
          @delete="deleteImg"
          :name="fileList.length"
          :before-read="beforeUpload"
          accept="file"
        />        
      </div>
      <van-button class="course-btn"  @click="submit" v-if="isFabu==true">发布</van-button>
      <!-- <van-button class="course-btn" :class="{'cancelBtn': cancelBtn}" @click="submit">发布</van-button> -->
    </van-action-sheet>
  </div>
</template>

<script>
import vue from "vue";
import { ImagePreview } from "vant";
vue.use(ImagePreview);
export default {
  name: "Communicate",
  data() {
    return {
    	pdf_img:require('@/assets/images/pdf2.png'),
			doc_img:require('@/assets/images/doc2.png'),
			ppt_img:require('@/assets/images/ppt2.png'),
			txt_img:require('@/assets/images/txt_img.png'),
			xls_img:require('@/assets/images/xls_img.png'),
      id: this.$route.query.id,
      teacher_id: this.$route.query.t_id,
      user_id: localStorage.user_id,
      records: [],
      teacher: {},
      showConcat: false,
      fileList: [],
      upload: [],
      content: "",
      isFabu:true,
      cancelBtn: false
    };
  },
  computed: {
    app() {
      return this.$store.state.app;
    }
  },
  methods: {
  	file_kzm(filename){
  		return /\.[^\.]+$/.exec(filename);
  	},
  	beforeUpload(file) {
  	let file_name=file.name;
      var flag = false; //状态
			var arr = ['gif','jpeg','jpg','png','doc','docx','pdf','ppt','pptx','txt','xlsx','xls'];
			//取出上传文件的扩展名
			var index = file_name.lastIndexOf(".");
			var ext = file_name.substr(index+1);
			//循环比较
			for(var i=0;i<arr.length;i++)
			{
				if(ext == arr[i])
				{
					flag = true; //一旦找到合适的，立即退出循环
					break;
				}
			}
			//条件判断
			if(!flag)
			{
				this.$toast({message:"请上传gif,jpeg,jpg,png,doc,docx,pdf,ppt,pptx,txt,xlsx,xls"});
        return false;
			}
			else
			{
				return true;
			}
  	},
    iosToTop(){
      // if(this.app == "ios"){
        let textarea = document.getElementsByTagName('textarea')[0];
        window.scrollTo(0,0);
      // }
    },
    onBack() {
      // app
      if (this.$store.state.app) {
        this.$pub.appAction("closeAppPage");
      } else {
        this.$router.go(-1)
      }
    },
    getRecord() {
      this.$http
        .post(`/api/app/oto/communicate/index`, {
          teacher_id: this.teacher_id,
          oto_course_id: this.id,
          user_id: this.user_id
        })
        .then(res => {
          this.teacher = res.base_info;
          let list = [];
          for (let i in res.communicate) {
            res.communicate[i].forEach(item => {
              list.push(item);
            });
          }
          this.records = list;
        });
    },
    appUploadImg() {
      if (this.$store.state.app) {
        this.$pub.appAction("selectPhoto", {
          num: 9 - this.upload.length,
          photoType: 2
        });
      }
    },
    preview(img){
		var arr=[];
		arr.push(img);
    	ImagePreview(arr);
    },
    afterRead(file) {
    	this.isFabu=false;
      const formdata = new FormData();
      formdata.append("file", file.file);
    	this.$http.post(`/api/app/public/file`, formdata).then(res => {
      this.upload.push(res);
      var i_fileList=this.upload;
     	for(var i=0; i<i_fileList.length; i++){
     	let exit_img=i_fileList[i].ext;
     	if(exit_img=='doc'||exit_img=='docx'||exit_img=='DOC'||exit_img=='DOCX')
        {
        	$(".van-uploader__preview").eq(i).find('.van-uploader__file').html('<img src="'+this.doc_img+'" style="max-width:80%">').addClass('van-image van-uploader__preview-image');
        }
        else if(exit_img=='pdf'||exit_img=='PDF')
        {
        	$(".van-uploader__preview").eq(i).find('.van-uploader__file').html('<img src="'+this.pdf_img+'" style="max-width:80%">').addClass('van-image van-uploader__preview-image');
        }
        else if(exit_img=='ppt'||exit_img=='pptx')
        {
        	 $(".van-uploader__preview").eq(i).find('.van-uploader__file').html('<img src="'+this.ppt_img+'" style="max-width:80%">').addClass('van-image van-uploader__preview-image');
        }
     };
      this.cancelBtn = false;
      this.isFabu=true;
    });
      this.setIndex();
    },
    deleteImg(file) {
      this.upload.splice(file.index, 1);
    },
    setIndex() {
      this.fileList.forEach((item, index) => {
        item["index"] = index;
      });
    },
    submit() {
       if (this.cancelBtn) {
        return;
      }
      let img_url = "";
      if (this.upload.length) {
        img_url = this.$pub.objToStr(this.upload, ",", "path");
      }
      this.$http
        .post(`/api/app/oto/communicate/send`, {
          oto_course_id: this.id,
          teacher_id: this.teacher_id,
          user_id: this.user_id,
          content: this.content,
          img_url: img_url
        })
        .then(() => {
          this.fileList = [];
          this.upload = [];
          this.content = "";
          this.$toast({
            message: "评论成功",
            type: "success",
            duration: 1000,
            onClose: () => {
              this.getRecord();
            }
          });
          this.showConcat = false;
        });
    },
    deleteConcat(id) {
      this.$http.delete(`/api/app/oto/communicate/${id}`).then(() => {
        this.getRecord();
      });
    },
	downloadFile(file) {
      // 移动端预览方法
      if (this.$store.state.app == "android") {
        this.$pub.appAction("filePreView", {
          file_url: file,
          name: file
        });
      } else {
        window.location.href = file;
      }
    }
  },
  created() {
    this.getRecord();
    if (this.$store.state.app) {
      setTimeout(() => {
        this.$pub.appAction("setAppStatusBarColor", {
          color: "#FF63B6FE"
        });
      }, 100);
      this.$pub.registerWebViewJavascriptBridge(data => {
        let imgSrc = JSON.parse(data);
        let len = this.upload.length;
        imgSrc.forEach((item, index) => {
          item["index"] = len + index;
          item["content"] = item.path;
          this.upload.push(item);
          this.fileList.push(item);
        });
      });
    }
  },
  mounted() {
    let _this = this;
    window.$("body").on("click", ".van-uploader__input", function () {
      _this.appUploadImg();
    });
  }
};
</script>

<style lang='scss' scoped>
.communi-page {
  @extend %default-bg;
  .header {
    height: 200px;
    line-height: 88px;
    header {
      display: flex;
      height: 200px;
      width: 100%;
      padding-right: 50px;
      box-sizing: border-box;
      position: fixed;
      top: 0;
      background: linear-gradient(
        180deg,
        rgba(99, 183, 254, 1) 0%,
        rgba(78, 125, 227, 1) 100%
      );
      .back {
        @extend %flex-center;
        width: 50px;
        height: 88px;
        padding-left: 20px;
        img {
          width: 18px;
          height: 32px;
        }
      }
      h3 {
        flex: 2;
        text-align: center;
        font-size: 36px;
        color: #fff;
        height: 88px;
      }
    }
    .teacher-info {
      position: fixed;
      left: 20px;
      top: 88px;
      width: 710px;
      padding: 0 30px;
      background: #fff;
      border-radius: 8px;
      box-sizing: border-box;
      .ti-base {
        height: 152px;
        display: flex;
        align-items: center;
        img {
          width: 80px;
          height: 80px;
          margin-right: 24px;
          border-radius: 50%;
          flex: none;
        }
        div {
          flex: 1;
          p {
            font-family: PingFangSC-Regular;
            font-weight: 400;
            font-size: 30px;
            color: rgba(89, 89, 89, 1);
            line-height: 60px;
            &:nth-child(2) {
              font-size: 24px;
              color: rgba(183, 183, 183, 1);
              line-height: 34px;
            }
          }
        }
        button {
          flex: none;
          width: 152px;
          height: 56px;
          line-height: 56px;
          background: #fff;
          border-radius: 31px;
          font-size: 26px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: $theme_color;
          border: none;
          border: 1px solid $theme_color;
          //   @extend %flex-center;
          span {
            margin-left: 5px;
          }
        }
        .has-collect {
          font-size: 30px;
          color: #b7b7b7;
        }
      }
      .ti-label {
        padding-bottom: 30px;
        span {
          display: inline-block;
          width: 144px;
          height: 48px;
          line-height: 48px;
          background: rgba(255, 228, 211, 1);
          border-radius: 24px;
          font-size: 24px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(234, 122, 47, 1);
          margin-right: 30px;
          text-align: center;
        }
      }
    }
  }
  .record-list {
    padding: 50px 0;
    .rl-item {
      padding: 30px 30px 20px;
      .rl-box {
        display: flex;
        flex-direction: column;
        .name {
          font-size: 30px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(89, 89, 89, 1);
          line-height: 42px;
          letter-spacing: 2px;
          padding-bottom: 14px;
        }
        .rl-content {
          min-height: 172px;
          width: 588px;
          box-sizing: border-box;
          background: #fff;
          border-radius: 15px;
          box-shadow: 0px 3px 7px 0px rgba(207, 207, 207, 0.35);
          padding: 36px 44px 36px;
          .text {
            font-size: 28px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(89, 89, 89, 1);
            line-height: 40px;
            letter-spacing: 2px;
          }
          .time {
            font-size: 24px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(140, 140, 140, 1);
            line-height: 30px;
            letter-spacing: 2px;
            padding-top: 14px;
            padding-bottom: 20px;
          }
          .img-list {
            border-top: 1px solid #f1f1f1;
            display: flex;
            flex-wrap: wrap;
            img {
              width: 140px;
              height: 140px;
              border-radius: 8px;
              border: 8px solid #e6e6e6;
              box-sizing: border-box;
              margin-right: 20px;
              margin-top: 20px;
            }
          }
        }
        button {
          width: 152px;
          height: 56px;
          font-size: 24px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(89, 89, 89, 1);
          line-height: 56px;
          background: #fff;
          border: 0;
          margin-top: 20px;
          margin-right: 20px;
          border-radius: 28px;
        }
      }
      .rl-own {
        align-items: flex-end;
        .rl-content {
          background: $theme_color;
          .text {
            color: #fff;
          }
          .time {
            color: rgba($color: #fff, $alpha: 0.5);
          }
          .img-list {
            border-color: #a1b4ff;
          }
        }
      }
    }
  }
  .c-content {
    padding: 30px 70px;
    padding-bottom: 100px;
    box-sizing: border-box;
    min-height: 70vh;
    textarea {
      border: none;
      width: 100%;
      min-height: 200px;
      font-size: 24px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: #666;
      line-height: 48px;
      margin-bottom: 40px;
    }
  }
    .cancelBtn {
    background: #ccc;
  }
}
</style>
