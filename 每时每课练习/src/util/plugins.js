import store from '../store'
import router from '../router';
import Vue from 'vue';
import { Dialog } from 'vant';

Vue.use(Dialog);

const plugins = {
    isPoneAvailable(s) {
        if (s != null) {
            var length = s.length;
            if (length == 11 && /^1[345789]\d{9}$/.test(s)) {
                return true;
            } else {
                return false;
            }
        }
    },
    thirdpartLogin(type) {
        const url = location.protocol + "//" + location.host;
        switch (type) {
            case 'wx':
                localStorage.setItem('login_way', '1');
                window.location.href =
                    `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc263297b035384d8&redirect_uri=${url}/CAPTCHA_Login&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
                break;
            case 'qq':
                localStorage.setItem('login_way', '2');
                window.location.href =
                    `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101682192&redirect_uri=${url}/CAPTCHA_Login`;
                break;
        }
    },
    timestampToTime_point(timestamp) {
        var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '.';
        var M =
            (date.getMonth() + 1 < 10
                ? '0' + (date.getMonth() + 1)
                : date.getMonth() + 1) + '.';
        var D =
            (date.getDate() + 1 < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
        // return Y + M + D + h + m + s;
        return Y + M + D;
    },
    /**
     * 注册连接app的方法 
     * @param {Function} callbacks  回调方法
     */
    registerWebViewJavascriptBridge(callbacks) {
        if (store.state.app == 'ios') {
            iosEvent(callbacks)
        } else {
            androidEvent(callbacks)
        }
        function androidEvent(callbacks) {
            function connectWebViewJavascriptBridge(callback) {
                if (window.WebViewJavascriptBridge) {
                    callback(WebViewJavascriptBridge)
                } else {
                    document.addEventListener(
                        'WebViewJavascriptBridgeReady'
                        , function () {
                            callback(WebViewJavascriptBridge)
                        },
                        false
                    );
                }
            }
            connectWebViewJavascriptBridge(function (bridge) {

                bridge.init(function (message, responseCallback) {
                    let data = { "init": "success" };
                    if (responseCallback) {
                        responseCallback(data);
                    }
                });
                //demo 的js注册方法给native调用
                bridge.registerHandler("functionInJs", function (data, responseCallback) {
                    if (responseCallback) {
                        let responseData = "Javascript Says Right back aka!";
                        responseCallback(responseData);
                    }
                    callbacks(data)
                });
            });
        }
        function iosEvent(callbacks) {
            function setupWebViewJavascriptBridge(callback) {
                if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
                if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
                window.WVJBCallbacks = [callback];
                var WVJBIframe = document.createElement('iframe');
                WVJBIframe.style.display = 'none';
                WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
                document.documentElement.appendChild(WVJBIframe);
                setTimeout(function () { document.documentElement.removeChild(WVJBIframe) }, 0)
            }
            setupWebViewJavascriptBridge(function (bridge) {
                // 日志
                var uniqueId = 1
                function log(message, data) {
                    var log = document.getElementById('log')
                    var el = document.createElement('div')
                    el.className = 'logLine'
                    el.innerHTML = uniqueId++ + '. ' + message + ':<br/>' + JSON.stringify(data)
                    if (log.children.length) {
                        log.insertBefore(el, log.children[0])
                    } else {
                        log.appendChild(el)
                    }
                }
                // 注册
                bridge.registerHandler('functionInJs', function (data, responseCallback) {
                    responseCallback(data)
                    if (callbacks) {
                        callbacks(data)
                    }
                })
                // bridge.callHandler('ObjC Echo', { 'key': 'value' }, function responseCallback(responseData) {
                //     console.log("JS received response:", responseData)
                // })
            })
        }
    },
    /**
     * app内部方法
     * @param {String} name  方法名称  必选   // 登录：'login'、 退出web：'closeAppPage'
     * @param {Object} params  方法需要的参数, 非必选   
     */
    appAction(name, params) {
        window.WebViewJavascriptBridge.callHandler(
            'action'
            , { name, params }
        );
    },

    /**
     * 路由名 参数  跳转app页面
     * @param {String} name 
     * @param {Object} params 
     */
    InAppPage(name, params) {
        if (store.state.app) {
            window.WebViewJavascriptBridge.callHandler(
                'action'
                , { name, params }
            );
        } else {
            router.push({
                name,
                query: params
            })
        }
    },
    /**
     * 获取url的参数
     **/
    getQueryVariable(variable){
        let query = window.location.search.substring(1);
        let vars = query.split("&");
        for (let i=0;i<vars.length;i++) {
                let pair = vars[i].split("=");
                if(pair[0] == variable){return pair[1];}
        }
        return(false);   
    },
    /**
     * 新开web页面
     * @param {String} url 路径（必选）  例 'detail?id=322' 
     */
    appJump(url) {
        window.WebViewJavascriptBridge.callHandler(
            'action'
            , { 'name': 'web', url }
        );
    },

    /**
     * 返回app页面
     * @param {String} name 需要检测的页面
     */
    filterAppPage(name) {
        let array = ['Pay', 'Purchase',"Info", "MyPlan", "MyPeriod", "Concern", "Collect", "Order", "Coupon", "Card", "Message", "Oto", "Vip", "MyCurrency","IosCurrency", "PictureCourseDetail","Feedback"];
        return array.includes(name)
    },
    // 两周
    initDays() {
        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;
        let day = new Date().getDate();
        let weekIndex = new Date().getDay();
        if (weekIndex == 0) weekIndex = 7;
        let cur_month_day = new Date(year, month, 0).getDate();
        let prev_month_day = new Date(year, month - 1, 0).getDate(); //上月天数
        // let next_month_day = new Date(year, month + 1, 0).getDate(); //下月天数
        // 年初和年尾
        if (month - 1 == 0) {
            prev_month_day = new Date(year - 1, 12, 0).getDate();
            // next_month_day = new Date(year, month + 1, 0).getDate();
        } else if (month + 1 == 13) {
            prev_month_day = new Date(year, month - 1, 0).getDate();
            // next_month_day = new Date(year + 1, 1, 0).getDate();
        }
        let d_value = 14 - weekIndex; //差值
        let days = [];
        if (day + d_value > cur_month_day) {
            // 包含下个月
            let d = 14 - (day + d_value - cur_month_day);
            for (let i = 0; i < d; i++) {
                days[i] = {
                    year,
                    month,
                    day: cur_month_day - (d - i - 1)
                };
            }
            days[d] = {
                year: month + 1 > 12 ? year + 1 : year,
                month: month + 1 > 12 ? 1 : month + 1,
                day: 1
            };
            for (let i = d + 1; i < 14; i++) {
                days[i] = {
                    year: days[i - 1].year,
                    month: days[i - 1].month,
                    day: days[i - 1].day + 1
                };
            }
        } else if (weekIndex - day > 0) {
            // 包含上个月
            let d = weekIndex - day;
            for (let i = 0; i < d; i++) {
                days[i] = {
                    year: month - 1 < 1 ? year - 1 : year,
                    month: month - 1 < 1 ? 12 : month - 1,
                    day: prev_month_day - (d - i - 1)
                };
            }
            days[d] = {
                year,
                month,
                day: 1
            };
            for (let i = d + 1; i < 14; i++) {
                days[i] = {
                    year,
                    month,
                    day: days[i - 1].day + 1
                };
            }
        } else {
            // 本月
            days[0] = {
                year,
                month,
                day: day - weekIndex + 1
            };
            for (let i = 1; i < 14; i++) {
                days[i] = {
                    year,
                    month,
                    day: days[i - 1].day + 1
                };
            }
        }
        let currentWeek = 1, flag = 0;
        days.forEach((item, index) => {
            if (item.day == day) {
                flag = 1;
            }
            if (index == 7) {
                currentWeek = 0;
            }
            item.disable = flag; // 0 今天之前 1 之后
            item.currentWeek = currentWeek; // 本周 下周
        })
        // days: [{month: 4, day: 1}...]
        // day: today
        return { days, day };
    },
    // app环境
    app_js() {
        let app = 0;
        let token = '';
        let arrcookie = document.cookie.split("; ");//获取cookie字符串
        for (var i = 0; i < arrcookie.length; i++) {
            let arr = arrcookie[i].split("=");
            if (arr[0] == 'token') {
                token = arr[1];
            } else if (arr[0] == "deviceType") {
                app = arr[1]
            }
        }
        return { app, token }
    },
    /**
     * 对象转字符串
     * @param {Object} obj 对象、数组
     * @param {String} str 间隔符
     * @param {String} attr 遍历属性值
     * @param {Number} len 截点
     */
    objToStr(obj, str = ",", attr, len) {
        let result = ''
        if (attr) {
            for (let i = 0; i < obj.length; i++) {
                if (len && len < i) {
                    result += "等"
                    break
                }
                if (obj[i][attr]) {
                    result += obj[i][attr] + str
                }
            }
        } else {
            for (let i in obj) {
                if (obj[i]) {
                    result += obj[i] + str;
                }
            }
        }
        if (result) result = result.substr(0, result.length - 1);
        return result;

    },
    checkLogin(isCheck = true) {
        if (isCheck) {
            if (!localStorage.adminToken) {
                login()
                return false
            } else {
                return true
            }
        } else {
            login()
        }
        function login() {
            if (store.state.app) {
                window.WebViewJavascriptBridge.callHandler(
                    'action'
                    , { name: 'login' }
                );
            } else {
                router.replace({
                    name: 'Login'
                })

                // Dialog
                // .confirm({
                //     title: "提示",
                //     message: "赶紧登录一下吧"
                // })
                // .then(() => {
                //     router.replace({
                //         name: 'Login'
                //     })
                // })
                // .catch(() => {});

            }
        }
    },
    //时间转换
    tsToTime(timestamp, hasSecond = true) {
        var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '.';
        var M =
            (date.getMonth() + 1 < 10 ?
                '0' + (date.getMonth() + 1) :
                date.getMonth() + 1) + '.';
        var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
        var h =
            (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        var s =
            ':' +
            (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        if (hasSecond) {
            return Y + M + D + h + m + s;
        } else {
            return Y + M + D + h + m;
        }
    },
    /**
     * 跳转订单
     * @param {String} type 
     */
    ToOrder(type) {
        // replace  
        router.replace({
            name: "Order",
            query: {
                order_type: type == '1' ? "1" : type == '14' ? '3' : "2"
            }
        });
    },
    /**
     * 跳转余额
     * @param {String} type 
     */
    ToCurrency(type) {
        // replace  
        router.replace({
            name: "MyCurrency",
            query: {
                order_type: type == '1' ? "1" : type == '14' ? '3' : "2"
            }
        });
    },
    //判断是否为微信内置浏览器
    isWeiXin() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    },
    // px 转 vw
    px2vw(pxVal) {
        return (100 / 750) * parseInt(pxVal) + 'vw';
    },
    showTrySee(courseType) {
        switch (parseInt(courseType)) {
            case 7:
            case 9:
            case 10:
                return false;
            default:
                return true;
        }
    },
    showPlayType(courseType) {
        switch (parseInt(courseType)) {
            case 5:
            case 8:
            case 9:
            case 10:
                return false;
            default:
                return true;
        }
    },
    showDuration(courseType) {
        switch (parseInt(courseType)) {
            case 5:
            case 8:
            case 9:
            case 10:
                return false;
            default:
                return true;
        }
    },
    showProgress(courseType) {
        switch (parseInt(courseType)) {
            case 7:
            case 9:
            case 10:
                return false;
            default:
                return true;
        }
    }
};
export default plugins