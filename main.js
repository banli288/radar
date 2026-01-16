import Vue from 'vue';
import App from './App';

//import wsManager from '@/tools/wsManager'

//wsManager.connect('http://10.127.234.242:3000/ws')

Vue.config.productionTip = false;

App.mpType = 'app';

// 此处为演示Vue.prototype使用，非uView的功能部分
Vue.prototype.vuePrototype = '枣红';

// 引入全局uView
import uView from 'uview-ui';
Vue.use(uView);

// 此处为演示vuex使用，非uView的功能部分
import store from '@/store';

// 引入uView提供的对vuex的简写法文件
let vuexStore = require('@/store/$u.mixin.js');
Vue.mixin(vuexStore);

// 引入uView对小程序分享的mixin封装
let mpShare = require('uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare);

import i18n from './common';

Vue.prototype._i18n = i18n;

const app = new Vue({
  i18n,
  store,
  ...App
});

import httpInterceptor from '@/common/http.interceptor.js';
Vue.use(httpInterceptor, app);

import httpApi from '@/common/http.api.js';
Vue.use(httpApi, app);

app.$mount();