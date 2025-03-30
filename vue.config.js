const { VueLoaderPlugin } = require('vue-loader')
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
    plugins: [
      // 复制Cesium资源到静态目录
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'node_modules/cesium/Build/Cesium',
            to: 'cesium'
          }
        ]
      }),
      // 定义Cesium基础URL
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify('cesium')
      })
    ],
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm-bundler.js' // 使用包含运行时编译器的版本
      }
    },
    module: {
      // 添加对glTF内容的支持
      rules: [
        {
          test: /\.(glb|gltf)$/,
          use: {
            loader: 'file-loader',
            options: {
              outputPath: 'models',
            },
          },
        },
      ],
    },
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
