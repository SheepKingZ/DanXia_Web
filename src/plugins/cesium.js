import * as Cesium from 'cesium';

export default {
  install(app) {
    // 确保Cesium全局可用
    window.Cesium = Cesium;
    
    // 设置Cesium ion的访问令牌
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYTUyYWRjOC01MzFmLTRiYTctYmQyNi0zNDM2M2JkNDJiNjIiLCJpZCI6Mjg4OTE3LCJpYXQiOjE3NDMyMzg4OTZ9.mq_pp9fovtEegMrSlKjn_7lO3AZOot5uW64BfrhO0ds';
    
    // 将Cesium添加到Vue实例
    app.config.globalProperties.$cesium = Cesium;
    
    console.log('Cesium插件已初始化');
  }
}; 