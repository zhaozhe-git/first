<template>
  <div class="info">
    <Header :title="{name: '个人信息'}"></Header>
    <ul>
      <li @click="onChangeInfo('avatar')">
        <span>头像</span>
        <span>
          <img :src="userInfo.avatar" />
        </span>
      </li>
      <li @click="onChangeInfo('nickname')">
        <span>昵称</span>
        <span>{{userInfo.nickname}}</span>
      </li>
      <li class="mobile">
        <span>手机号</span>
        <span>{{userInfo.mobile}}</span>
      </li>
      <li @click="onChangeInfo('sex')">
        <span>性别</span>
        <span>{{userInfo.sex_name}}</span>
      </li>
      <li @click="onChangeInfo('birthday')">
        <span>出生日期</span>
        <span>{{userInfo.birthday}}</span>
      </li>
      <li @click="onChangeInfo('address')">
        <span>所在城市</span>
        <span>{{userInfo.province_name}}{{userInfo.city_name?"，"+userInfo.city_name:''}}{{userInfo.district_name?"，"+userInfo.district_name:''}}</span>
      </li>
      <li @click="onChangeInfo('subjects')">
        <span>学科</span>
        <span>{{userInfo.subjectNames}}</span>
      </li>
      <li v-for="(item, index) in attrs" v-if="item.id!=2" :key="index"y @click="onChangeInfo('attrs', item)">
        <span>{{item.attr}}</span>
        <span>{{item.selectIdx == -1 ? '请选择' : item.value[item.selectIdx].text}}</span>
      </li>
    </ul>
    <van-popup v-model="showPopup" position="bottom">
      <ul v-if="changeTag == 'avatar'" class="popup">
        <li @click="appUploadImg(1)">
          拍照
          <input type="file" accept="image/*" capture="camera" @change="onChangeAvatar" />
        </li>
        <li @click="appUploadImg(2)">
          从手机相册选择
          <input type="file" accept="image/*" @change="onChangeAvatar" />
        </li>
        <li @click="showPopup = false">取消</li>
      </ul>
      <van-datetime-picker
        v-else-if="changeTag == 'birthday'"
        v-model="birthday.currentDate"
        type="date"
        :min-date="birthday.minDate"
        :max-date="birthday.maxDate"
        @cancel="onCancel"
        @confirm="onConfirmBirthday"
      />
      <van-area
        v-else-if="changeTag == 'address'"
        :area-list="areaList"
        :columns-num="3"
        @change="onChangeAddress"
        @cancel="onCancel"
        @confirm="onConfirmAddress"
        :value="userInfo.district_id + ''"
      />
      <van-picker
        v-if="changeTag == 'attrs'"
        :columns="attrsColums"
        :default-index="attrsSelectIdx"
        show-toolbar
        @cancel="onCancel"
        @confirm="onConfirmAttrs"
      />
    </van-popup>
  </div>
</template>

<script>
import Header from "@/components/Header";
import { SexType } from "@/util/enums";
export default {
  name: "info",
  components: {
    Header
  },
  data() {
    return {
      userInfo: {},
      showPopup: false,
      changeTag: "",
      birthday: {
        minDate: new Date(1901, 1, 1),
        maxDate: new Date(),
        currentDate: new Date()
      },
      areaList: {
        province_list: {},
        city_list: {},
        county_list: {}
      },
      attrs: [],
      attrsColums: [],
      attrsSelectIdx: -1
    };
  },
  created() {
    this.requestUserInfo();
    let _this = this;
    // 注册连接app的方法
    this.$pub.registerWebViewJavascriptBridge(function(data) {
      _this.requestUpdateUserInfo({ avatar: JSON.parse(data)[0].path });
    });
  },
  methods: {
    // on event
    onChangeInfo(tag, item) {
      switch (tag) {
        case "nickname":
          this.$router.push({
            name: "SetInfo",
            query: {
              tag,
              value: this.userInfo.nickname
            }
          });
          return;
        case "sex":
          this.$router.push({
            name: "SetInfo",
            query: {
              tag,
              value: this.userInfo.sex
            }
          });
          return;
        case "address":
          this.requestArea();
          break;
        case "subjects":
          let val;
          this.attrs.forEach(res => {
            if(res.id==2){
              val = res.value
            }
          })
          this.$router.push({
            name: "SetInfo",
            query: {
              tag,
              value: val,
              select: this.userInfo.subjects
            }
          });
          return 
          break;
        case "attrs":   
          this.attrsColums = item.value;
          this.attrsSelectIdx = item.selectIdx;
          break;
      }
      this.changeTag = tag;
      this.showPopup = true;
    },
    appUploadImg(type) {
      if (this.$store.state.app) {
        this.$pub.appAction("selectPhoto", { photoType: type });
        this.showPopup = false;
      }
    },
    onChangeAvatar(e) {
      const formdata = new FormData();
      formdata.append("file", e.target.files[0]);
      this.$http.post("/api/app/public/img", formdata).then(data => {
        this.requestUpdateUserInfo({ avatar: data.path });
      });
      this.showPopup = false;
    },
    onCancel() {
      this.showPopup = false;
    },
    onConfirmBirthday(val) {
      this.showPopup = false;
      this.requestUpdateUserInfo({ birthday: val.format("yyyy-MM-dd") });
    },
    async onChangeAddress(picker, data, index) {
      switch (index) {
        case 0: // province
          {
            const province = await this.$http.get(
              `/api/app/sonArea/${data[index].code}`
            );
            let obj = {};
            province.forEach(i => {
              obj[i.id] = i.area_name;
            });
            this.areaList.city_list = obj;
            const city = await this.$http.get(
              `/api/app/sonArea/${province[0].id}`
            );
            obj = {};
            city.forEach(i => {
              obj[i.id] = i.area_name;
            });
            this.areaList.county_list = obj;
          }
          break;
        case 1: // city
          {
            const city = await this.$http.get(
              `/api/app/sonArea/${data[index].code}`
            );
            let obj = {};
            city.forEach(i => {
              obj[i.id] = i.area_name;
            });
            this.areaList.county_list = obj;
          }
          break;
        case 2: // county
          break;
      }
    },
    onConfirmAddress(val) {
      this.showPopup = false;
      this.requestUpdateUserInfo({
        province_id: val[0].code,
        city_id: val[1].code,
        district_id: val[2].code
      });
    },
    onConfirmAttrs(value, index) {
      this.showPopup = false;
      this.attrs[value.parentIdx].selectIdx = index;
      const attrAry = [];
      this.attrs.forEach(i => {
        if (i.selectIdx == -1) return;
        attrAry.push({
          attr_id: i.id,
          attr_val_id: i.value[i.selectIdx].id
        });
      });
      this.requestUpdateUserInfo({
        user_attr: JSON.stringify(attrAry)
      });
    },
    // request
    requestUserInfo() {
      this.$http.get("/api/app/userInfo").then(data => {
        this.userInfo = data;
        // 性别
        this.userInfo.sex_name = SexType.getValue(data.sex);
        // 生日
        if (this.userInfo.birthday == 0) {
          this.userInfo.birthday = "请选择";
        }
        // 城市
        if (!this.userInfo.province_name) {
          this.userInfo.province_name = "请选择";
        }
        //学科
        let subArr = []
        let subNames = ''
        data.attr.forEach(res=>{
          if(res.attr_id==2){
            subArr.push(res.attr_val_id)
            subNames = subNames + " " + res.attr_value
          }
        })
        this.userInfo.subjects = subArr
        this.userInfo.subjectNames = subNames

        // 动态属性
        this.attrs = [];
        this.$http.get("/api/app/module/attribute/1").then(attrData => {
          attrData.forEach(i => {
            if (i.value.length == 0) return;
            // 修改
            i.value.forEach(ci => {
              ci.text = ci.name;
              ci.parentIdx = this.attrs.length;
            });
            // 选中
            i.selectIdx = -1;
            for (const attri of this.userInfo.attr) {
              if (attri.attr_id == i.id) {
                for (let vali = 0; vali < i.value.length; ++vali) {
                  if (attri.attr_val_id == i.value[vali].id) {
                    i.selectIdx = vali;
                    break;
                  }
                }
                break;
              }
            }
            // 压入
            this.attrs.push(i);
          });
        });
        this.showPopup = false;
      });
    },
    requestUpdateUserInfo(params) {
      this.$http.put("/api/app/user", params).then(() => {
        this.$toast("数据更新成功");
        this.requestUserInfo();
      });
    },
    async requestArea() {
      let obj = {};
      const province = await this.$http.get("/api/app/sonArea/0");
      province.forEach(i => {
        obj[i.id] = i.area_name;
      });
      this.areaList.province_list = obj;
      const provinceID = this.userInfo.province_id || province[0].id;
      const city = await this.$http.get(`/api/app/sonArea/${provinceID}`);
      obj = {};
      city.forEach(i => {
        obj[i.id] = i.area_name;
      });
      this.areaList.city_list = obj;
      const cityID = this.userInfo.city_id || city[0].id;
      const district = await this.$http.get(`/api/app/sonArea/${cityID}`);
      obj = {};
      district.forEach(i => {
        obj[i.id] = i.area_name;
      });
      this.areaList.county_list = obj;
      if (!this.userInfo.district_id && district.length) {
        this.userInfo.district_id = district[0].id;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.info {
  @extend %default-bg;
  ul {
    background: #fff;
    margin: 20px 0;
    padding: 10px 30px;
    li {
      height: 110px;
      line-height: 110px;
      display: flex;
      justify-content: space-between;
      position: relative;
      span:nth-child(1) {
        font-size: 28px;
        color: #595959;
      }
      span:nth-child(2) {
        font-size: 28px;
        color: #8c8c8c;
        margin-right: 50px;
      }
      span > img {
        width: 74px;
        height: 74px;
        border-radius: 50%;
        vertical-align: middle;
      }
      &:before {
        content: "";
        display: block;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%) rotate(45deg);
        width: 20px;
        height: 20px;
        border-top: 1px solid #b7b7b7;
        border-right: 1px solid #b7b7b7;
      }
      &:after {
        content: "";
        display: block;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        height: 1px;
        background-color: #f5f5f5;
      }
      &:last-child:after {
        display: none;
      }
    }
    .mobile:before {
      display: none;
    }
  }
  .popup {
    margin: 0;
    li {
      height: 92px;
      line-height: 92px;
      font-size: 34px;
      font-weight: 300;
      color: #030303;
      text-align: center;
      display: block;
      // position: relative;
      &:before {
        display: none;
      }
      input {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
      }
    }
  }
}
</style>