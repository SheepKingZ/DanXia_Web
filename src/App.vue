<template>
  <!-- v-app是Vuetify的根组件，包裹整个应用 -->
  <v-app>
    <!-- router-view是Vue Router的视图出口，根据当前路由渲染对应的组件 -->
    <!-- 所有页面级组件都将在这里被渲染 -->
    <router-view />  
  </v-app>
</template>

<script>
// 导入Vue 3的组合式API钩子函数onMounted
import { onMounted } from 'vue';

export default {
  // 组件名称，用于调试和开发工具中识别组件
  name: 'App',
  
  // setup函数是Composition API的入口点
  // 在组件实例创建之前执行，没有this上下文
  setup() {
    // onMounted钩子在组件挂载到DOM后执行
    onMounted(() => {
      // 查找ID为'Loading'的元素（通常是初始加载动画）
      // 如果存在则将其从DOM中移除
      // 这是一种常见的初始加载屏幕处理方式
      if (document.getElementById('Loading'))
        document.getElementById('Loading').remove();
    });
    
    // setup函数需要返回一个对象，包含模板中可以使用的数据和方法
    // 这里返回空对象，因为模板中不需要使用任何数据
    return {};
  }
};
</script>

<!-- 可以在这里添加全局样式，但当前没有定义任何样式 -->