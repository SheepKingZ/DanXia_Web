const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  lintOnSave: false,
  publicPath: './',
  productionSourceMap: false,
  
  transpileDependencies: ['vuetify', 'vue-easy-lightbox'],
  
  configureWebpack: {
    externals: {
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm-bundler.js' // 使用包含运行时编译器的版本
      }
    }
  },
  
  chainWebpack: config => {
    // 添加对node_modules中vue3库的转译
    config.module
      .rule('js')
      .include
      .add(/node_modules\//)
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      
    // 确保vuetify组件正确加载
    config.plugin('define').tap(args => {
      args[0]['__VUE_OPTIONS_API__'] = true;
      args[0]['__VUE_PROD_DEVTOOLS__'] = false;
      return args;
    });
  }
}
