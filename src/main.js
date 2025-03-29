/* import Vue from 'vue'//用cdn的时候要注释掉 */
/* global Vue */
import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import store from "@/store";
import axiosPlugin from './plugins/axios'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import vuetify from './plugins/vuetify';

// 视频播放相关
import Video from 'video.js'
import 'video.js/dist/video-js.css'
// 注册video-player组件
import VueVideoPlayer from 'vue-video-player'

// 图片查看器
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';

// 懒加载
import VueLazyload from 'vue-lazyload'
import circle from './assets/loading.gif'

const app = createApp(App)

// 全局属性设置
app.config.globalProperties.$video = Video
app.config.globalProperties.$bus = app

// 使用插件
app.use(store)
app.use(vuetify)
app.use(router)
app.use(axiosPlugin)
app.use(VueLazyload, {
  loading: circle
})
app.use(Viewer, { 
  defaultOptions: { 
    zIndex: 9999 
  } 
})

// 注册视频播放组件
app.component('video-player', VueVideoPlayer)

// 视图器设置
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

app.config.productionTip = false

app.mount('#app')

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.auth)) {
    //对路由进行验证
    if (sessionStorage.getItem("loginState")) {//已经登录
      next()//正常跳转到设置好的界面
    } else {
      // 未登录则跳转到登陆界面，query:{ Rurl: to.fullPath}表示把当前路由信息传递过去方便登录后跳转回来；
      next({ path: '/Login', query: { redirect: to.fullPath } })//路由重定向
    }
  } else {
    next();
  }
})