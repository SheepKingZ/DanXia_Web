/**
 * 导入Vue 3核心API，createApp用于创建应用实例
 * Vue 3使用函数式API代替Vue 2的构造函数方式
 */
import { createApp } from 'vue'

/**
 * 导入根组件App.vue，作为整个应用的入口组件
 * 包含应用的基本布局结构和根级路由视图
 */
import App from './App.vue'

/**
 * 导入路由配置，管理页面导航和视图切换
 * 定义了所有路由路径与组件的映射关系
 */
import router from "./router";

/**
 * 导入Vuex状态管理，用于集中管理应用状态
 * @符号是webpack配置的src目录别名
 */
import store from "@/store";

/**
 * 导入Axios HTTP客户端插件，用于与后端API通信
 * 封装了请求拦截器、响应拦截器和统一错误处理
 */
import axiosPlugin from './plugins/axios'

/**
 * Vuetify UI框架相关导入
 * =====================
 */
// 导入Vuetify 3材料设计UI框架的核心样式
import 'vuetify/styles'
// 导入Material Design Icons图标字体，为UI组件提供图标支持
import '@mdi/font/css/materialdesignicons.css'
// 导入配置好的Vuetify插件实例
import vuetify from './plugins/vuetify';

/**
 * 视频播放功能相关导入
 * ================
 */
// 导入video.js核心库，用于高级视频播放功能
import Video from 'video.js'
// 导入video.js样式，提供播放器UI
import 'video.js/dist/video-js.css'
// 导入Vue版video.js包装器，提供<video-player>组件
import VueVideoPlayer from 'vue-video-player'

/**
 * 图片查看功能相关导入
 * ================
 */
// 导入图片查看器组件，支持图片缩放、旋转等交互功能
import Viewer from 'v-viewer';
// 导入图片查看器样式
import 'viewerjs/dist/viewer.css';

/**
 * 性能优化相关导入
 * ==============
 */
// 导入图片懒加载插件，优化首屏加载性能和减少带宽消耗
import VueLazyload from 'vue-lazyload'
// 导入加载中显示的占位图标
import circle from './assets/loading.gif'

/**
 * 3D地图相关导入
 * ============
 */
// 导入Cesium 3D地图引擎的样式文件
import 'cesium/Build/Cesium/Widgets/widgets.css';

// 导入封装好的Cesium插件，用于3D丹霞地貌展示
import cesiumPlugin from './plugins/cesium';

/**
 * 创建Vue 3应用实例
 * 以App组件为根组件，整个应用从这里开始渲染
 */
const app = createApp(App)

/**
 * 全局属性设置
 * ==========
 */
// 将视频播放器实例添加到全局属性，所有组件可通过this.$video访问
app.config.globalProperties.$video = Video
// 将应用实例作为事件总线($bus)，用于跨组件通信
// 这是Vue 3中实现事件总线的一种方式，替代Vue 2的Vue.prototype.$bus
app.config.globalProperties.$bus = app

/**
 * 插件注册
 * =======
 */
// 注册Vuex状态管理插件
app.use(store)
// 注册Vuetify UI框架插件
app.use(vuetify)
// 注册Cesium 3D地图插件
app.use(cesiumPlugin)
// 注册Vue Router路由插件
app.use(router)
// 注册Axios HTTP客户端插件
app.use(axiosPlugin)
// 注册图片懒加载插件，配置加载中显示的图标
app.use(VueLazyload, {
  loading: circle // 设置加载状态图片
})
// 注册图片查看器插件，设置默认z-index确保显示在最上层
app.use(Viewer, { 
  defaultOptions: { 
    zIndex: 9999 
  } 
})

/**
 * 全局组件注册
 * ==========
 */
// 全局注册视频播放器组件，所有视图都可以直接使用<video-player>标签
app.component('video-player', VueVideoPlayer)

/**
 * 图片查看器详细配置
 * ==============
 * 配置图片查看器的UI和交互行为，以及各种生命周期钩子
 */
Viewer.setDefaults({
  Options: {
    'inline': false,    // 非内联模式，使用模态框展示
    'button': true,     // 显示右上角关闭按钮
    "navbar": true,     // 显示底部缩略图导航条
    "title": true,      // 显示当前图片标题
    "toolbar": true,    // 显示底部工具栏
    "tooltip": true,    // 显示缩放百分比提示
    "movable": true,    // 允许移动图片
    "zoomable": true,   // 允许缩放图片
    "rotatable": true,  // 允许旋转图片
    "scalable": true,   // 允许翻转图片
    "transition": true, // 使用CSS3过渡效果
    "fullscreen": true, // 支持全屏模式
    "keyboard": true,   // 支持键盘控制
    "url": "data-source", // 图片URL数据属性名
  },
  // 以下是生命周期钩子函数，用于监控查看器各状态
  // 初始化完成时触发
  ready: function (e) {
    console.log(e.type, '组件已初始化');
  },
  // 图片开始显示时触发
  show: function (e) {
    console.log(e.type, '图片显示开始');
  },
  // 图片完全显示后触发
  shown: function (e) {
    console.log(e.type, '图片显示结束');
  },
  // 图片开始隐藏时触发
  hide: function (e) {
    console.log(e.type, '图片隐藏完成');
  },
  // 图片完全隐藏后触发
  hidden: function (e) {
    console.log(e.type, '图片隐藏结束');
  },
  // 视图开始变化时触发
  view: function (e) {
    console.log(e.type, '视图开始');
  },
  // 视图变化完成后触发
  viewed: function (e) {
    console.log(e.type, '视图结束');
  },
  // 图片开始缩放时触发
  zoom: function (e) {
    console.log(e.type, '图片缩放开始');
  },
  // 图片缩放完成后触发
  zoomed: function (e) {
    console.log(e.type, '图片缩放结束');
  }
});

/**
 * 全局配置
 * =======
 */
// 禁用生产环境提示，减少控制台输出
app.config.productionTip = false

/**
 * 应用挂载
 * =======
 * 将Vue应用挂载到HTML中id为"app"的DOM元素上，开始渲染整个应用
 */
app.mount('#app')

/**
 * 路由导航守卫配置
 * =============
 * 在路由跳转前执行的全局前置守卫，用于实现权限控制和登录状态检查
 * @param {Object} to - 目标路由对象
 * @param {Object} from - 来源路由对象
 * @param {Function} next - 控制路由跳转的函数
 */
router.beforeEach((to, from, next) => {
  // 检查目标路由是否需要身份验证(通过meta.auth判断)
  if (to.matched.some(m => m.meta.auth)) {
    // 检查登录状态(sessionStorage中保存的loginState)
    if (sessionStorage.getItem("loginState")) {
      // 已登录状态，允许正常导航到目标路由
      next()
    } else {
      // 未登录状态，重定向到登录页面
      // 通过query参数传递原目标路径，便于登录后跳回
      next({ path: '/Login', query: { redirect: to.fullPath } })
    }
  } else {
    // 不需要身份验证的路由，直接放行
    next();
  }
})