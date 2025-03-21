module.exports = {
  lintOnSave:false,
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: './',
  productionSourceMap: false,
  // 用cdn的时候取消注释
   configureWebpack: {
     externals: {
       'vue': 'Vue',
       'vue-router': 'VueRouter',
       'vuex': 'Vuex',
       'axios': 'axios',
     }
   },
   
    

}
