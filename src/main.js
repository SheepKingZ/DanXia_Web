/* import Vue from 'vue'//用cdn的时候要注释掉 */
/* global Vue */

// 导入Vue 3的createApp函数，用于创建Vue应用实例
import { createApp } from 'vue'
// 导入根组件App
import App from './App.vue'
// 导入路由配置
import router from "./router";
// 导入Vuex状态管理
import store from "@/store";
// 导入axios插件，用于HTTP请求
import axiosPlugin from './plugins/axios'

// Vuetify UI框架相关导入
import 'vuetify/styles'  // 导入Vuetify的样式
import '@mdi/font/css/materialdesignicons.css'  // 导入Material Design图标
import vuetify from './plugins/vuetify';  // 导入Vuetify插件配置

// 视频播放相关导入
import Video from 'video.js'  // 导入video.js库
import 'video.js/dist/video-js.css'  // 导入video.js的CSS样式
// 导入vue-video-player组件
import VueVideoPlayer from 'vue-video-player'

// 图片查看器相关导入
import Viewer from 'v-viewer';  // 导入v-viewer图片查看器
import 'viewerjs/dist/viewer.css';  // 导入viewer.js的CSS样式

// 图片懒加载相关导入
import VueLazyload from 'vue-lazyload'  // 导入懒加载插件
import circle from './assets/loading.gif'  // 导入加载中显示的图片

// 导入Cesium地图库的CSS样式
import 'cesium/Build/Cesium/Widgets/widgets.css';

// 导入Cesium插件配置
import cesiumPlugin from './plugins/cesium';

// 创建Vue应用实例
const app = createApp(App)

// 设置全局属性，可在任何组件中通过this.$video和this.$bus访问
app.config.globalProperties.$video = Video  // 将video.js实例添加为全局属性
app.config.globalProperties.$bus = app  // 将app实例作为事件总线

// 注册和使用各种插件
app.use(store)  // 注册Vuex状态管理
app.use(vuetify)  // 注册Vuetify UI框架
app.use(cesiumPlugin)  // 注册Cesium地图插件
app.use(router)  // 注册Vue Router路由
app.use(axiosPlugin)  // 注册axios HTTP请求插件
app.use(VueLazyload, {
  loading: circle  // 配置懒加载插件，设置加载中显示的图片
})
app.use(Viewer, { 
  defaultOptions: { 
    zIndex: 9999  // 配置图片查看器的z-index层级
  } 
})

// 全局注册视频播放组件
app.component('video-player', VueVideoPlayer)

// 配置图片查看器的默认选项
Viewer.setDefaults({
  Options: {
    'inline': false,  // 是否内联显示
    'button': true,   // 是否显示右上角按钮
    "navbar": true,   // 是否显示底部缩略图导航栏
    "title": true,    // 是否显示当前图片标题
    "toolbar": true,  // 是否显示底部工具栏
    "tooltip": true,  // 是否显示缩放百分比提示
    "movable": true,  // 是否可以移动图片
    "zoomable": true, // 是否可以缩放图片
    "rotatable": true, // 是否可以旋转图片
    "scalable": true,  // 是否可以翻转图片
    "transition": true, // 是否使用CSS3过渡效果
    "fullscreen": true, // 播放时是否全屏
    "keyboard": true,   // 是否支持键盘操作
    "url": "data-source", // 获取原图URL的属性名
  },
  // 以下是图片查看器的各种事件回调
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

// 设置生产环境提示，在Vue 3中已弃用但保留兼容
app.config.productionTip = false

// 将Vue应用挂载到DOM中id为app的元素
app.mount('#app')

// 配置全局路由守卫，用于处理路由访问权限
router.beforeEach((to, from, next) => {
  // 检查目标路由是否需要身份验证
  if (to.matched.some(m => m.meta.auth)) {
    // 如果路由需要验证，检查用户是否已登录
    if (sessionStorage.getItem("loginState")) {
      // 已登录，允许访问
      next()
    } else {
      // 未登录，重定向到登录页面，并传递原目标路由以便登录后跳回
      next({ path: '/Login', query: { redirect: to.fullPath } })
    }
  } else {
    // 路由不需要验证，直接允许访问
    next();
  }
})