import plugins from './plugins'
import { Guid } from './guid';
import { Toast } from 'vant';

Toast.allowMultiple();
const buildConfig = require('../build/' + process.env.BUILD_ENV + '.js');

const Http = function () {
  let DeviceID = localStorage.DeviceID;
  if (!DeviceID) {
    DeviceID = Guid.NewGuid().ToString('D');
    localStorage.DeviceID = DeviceID;
  }
  this.DeviceID = DeviceID;
};

Http.prototype.fetch = function (url, method, params = {}) {
  url = buildConfig.BASE_URL + url;
  let config = { method: method, mode: 'cors' };
    //判断是否为wx内置浏览器
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
      config.headers = {
        DeviceType: 'WXH5',
        DeviceID: this.DeviceID,
      };
    } 
//     else if (ua.match(/QQ/i) == "qq") {
//         return "QQ";
//     }
    else{
      config.headers = {
        DeviceType: 'H5',
        DeviceID: this.DeviceID,
      };
    }





  // config.headers = {
  //   DeviceType: 'H5',
  //   DeviceID: this.DeviceID,
  // };
  Toast.loading({
    className: 'toast-loading'
  });
  if (params instanceof FormData) {
    config.body = params;
  } else {
    if (method == 'get' || method == 'head') {
      if (url.indexOf('?') > 0) {
        url += '&';
      } else {
        url += '?';
      }
      for (let key in params) {
        url += key + '=' + params[key] + '&';
      }
    } else {
      config.body = JSON.stringify(params);
    }
    config.headers['Content-Type'] = 'application/json'
  }
  if (localStorage.adminToken) {
    config.headers.Authorization = 'Bearer ' + localStorage.adminToken;
  }
  return new Promise((resolve, reject) => {
    fetch(url, config).then(async res => {
      Toast.clear();
      if (res.status == 200) {
        let data = await res.json();
        if (data.code == 200) {
          resolve(data.data || data);
        } else {
          if (data.code == 202) {
            plugins.checkLogin(false)
          } else if (data.code == 203) {
            resolve(data);
          } else {
            Toast({
              message: data.msg,
              duration: 1000,
              forbidClick: true
            });
          }
        }
      } else {
        reject(res.statusText);
      }
    });
  });
};

Http.prototype.get = function (url, params) {
  return this.fetch(url, 'get', params);
};

Http.prototype.post = function (url, params) {
  return this.fetch(url, 'post', params);
};

Http.prototype.put = function (url, params) {
  return this.fetch(url, 'put', params);
};

Http.prototype.delete = function (url, params) {
  return this.fetch(url, 'delete', params);
};

export default new Http();
