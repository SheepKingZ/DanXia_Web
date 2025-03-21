/* import Vue from 'vue'//用cdn的时候要注释掉 */
/* global Vue */
import './plugins/axios'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from "./router";

import store from "@/store";


import VideoPlayer from 'vue-video-player';
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
import Video from 'video.js'
import 'video.js/dist/video-js.css'
Vue.prototype.$video = Video
Vue.use(VideoPlayer)
import 'videojs-contrib-hls'

import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
Vue.component("Viewer", Viewer);
/* import {reqMeterial} from './api'
reqMeterial() */
import VueLazyload from 'vue-lazyload'
import circle from './assets/loading.gif'
Vue.use(VueLazyload,{
  //懒加载默认的图片
  loading:circle
})
Vue.config.productionTip = false

new Vue({
  store,
  vuetify,
  router,
  render: h => h(App),
  beforeCreate(){
    Vue.prototype.$bus=this
  },
}).$mount('#app')//注入路由对象到new Vue实例中，建立关联

router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.auth)) {
    //对路由进行验证
    if (sessionStorage.getItem("loginState")) {//已经登录
      next()//正常跳转到设置好的界面
    }
    else {
      // 未登录则跳转到登陆界面，query:{ Rurl: to.fullPath}表示把当前路由信息传递过去方便登录后跳转回来；

      next({ path: '/Login',query: {redirect: to.fullPath} })//路由重定向
    }
  }else{
    next();
  }
  })

Vue.use(VideoPlayer);
Vue.use(Viewer, { defaultOptions: { zIndex: 9999 } });
Viewer.setDefaults({
  Options: {
    'inline': false,
    'button': true, //右上角按钮
    "navbar": true, //底部缩略图
    "title": true, //当前图片标题
    "toolbar": true, //底部工具栏
    "tooltip": true, //显示缩放百分比
    "movable": true, //是否可以移动
    "zoomable": true, //是否可以缩放
    "rotatable": true, //是否可旋转
    "scalable": true, //是否可翻转
    "transition": true, //使用 CSS3 过度
    "fullscreen": true, //播放时是否全屏
    "keyboard": true, //是否支持键盘
    "url": "data-source",
  },
  ready: function (e) {
    console.log(e.type, '组件以初始化');
  },
  show: function (e) {
    console.log(e.type, '图片显示开始');
  },
  shown: function (e) {
    console.log(e.type, '图片显示结束');
  },
  hide: function (e) {
    console.log(e.type, '图片隐藏完成');
  },
  hidden: function (e) {
    console.log(e.type, '图片隐藏结束');
  },
  view: function (e) {
    console.log(e.type, '视图开始');
  },
  viewed: function (e) {
    console.log(e.type, '视图结束');
  },
  zoom: function (e) {
    console.log(e.type, '图片缩放开始');
  },
  zoomed: function (e) {
    console.log(e.type, '图片缩放结束');
  }
});