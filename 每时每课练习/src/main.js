import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import http from './util/http';
import plugins from './util/plugins'
import Vant from 'vant';
import qrcode from 'qrcode'
import * as filters from './util/filter';
import 'vant/lib/index.css';
import './util/flexiable';
import './css/common.scss';
import './util/extension';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// import Vconsole from 'vconsole'
// let vConsole = new Vconsole()
// Vue.use(vConsole)

Vue.use(Vant);
Vue.use(ElementUI);
import { ImagePreview } from "vant";
Vue.prototype.$http = http;
Vue.prototype.$pub = plugins;
Vue.prototype.$qrcode = qrcode;
Vue.prototype.$theme_color = 'rgb(235, 97, 0)';
Vue.config.productionTip = false;
Vue.prototype.$imgPreview = ImagePreview;
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.prototype.$storage = function() {
    let that = this;
    return {
        set: (key, data) => {
            let rawData = localStorage.getItem(key);
            if (rawData) {
                rawData = JSON.parse(rawData);
            } else {
                rawData = {};
            }
            rawData[that.$store.state.personInfo.id] = data;
            localStorage[key] = JSON.stringify(rawData);
        },
        get: key => {
            let rawData = localStorage.getItem(key);
            if (rawData) {
                let data = JSON.parse(rawData)[
                    that.$store.state.personInfo.id
                ];
                return data;
            }
        },
    };
};
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
