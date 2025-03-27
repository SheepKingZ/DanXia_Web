<template>
  <div>
    <div id="sectionLine">
      <div class="esri-ui-top-right esri-ui-corner">
        <v-card min-width="400px" color="rgba(255, 255, 255, 0.7)">
          <v-card-title> 剖面线 </v-card-title>
          <div id="echartDiv" v-show="option"></div>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="primary" depressed tile @click="creatSke"
              >自定义绘制</v-btn
            >
            <v-btn color="primary" depressed tile @click="collectRoutes" v-show="isstudent"
              >使用采集路线</v-btn
            >
            <v-btn color="primary" depressed tile @click="Remove"
              >清空</v-btn
            >
            <v-btn color="primary" depressed tile @click="downloadRoutes" v-show="false"
              >下载采集路线</v-btn
            >
            <v-btn v-model="option" fab color="primary" @click="zoombtn" small>
              <v-icon v-if="option"> mdi-arrow-collapse </v-icon>
              <v-icon v-else> mdi-arrow-expand </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { loadModules } from "esri-loader";
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export default {
  name: "visible",
  setup() {
    // 响应式状态
    const c_flag = ref(false); //是否在绘制
    const map = ref(null); //地图对象
    const mapConfig = reactive({
      container: "sectionLine", //容器id
      sceneView: null,
    });
    const graphicsLayer = ref(null); //线图层
    const pointList = ref([]); //点数组
    const polyline = ref(null); //线
    const sketchViewModel = ref(null); //草图模型
    const lengthArray = ref([]); //线段长度
    const RoutesfeatureLayer = ref(null); //路线图层
    const highlighSelect = ref(null); //选中
    const routeSelect = ref(null); //选中的路线
    const option = reactive({
      //定义一个包含有JS API中js开发包和css样式文件的对象
      url: "https://js.arcgis.com/4.19/init.js",
      css: "https://js.arcgis.com/4.19/esri/themes/light/main.css",
    });
    const chart = ref(null); //图表
    const isstudent = ref(true); //是否是学生

    //创建地图
    const _createMapView = function() {
      const _self = { map, mapConfig, graphicsLayer, polyline, sketchViewModel, RoutesfeatureLayer }; //定义一个_self对象引用响应式变量
      
      //通过loadModules来做衔接
      loadModules(
        [
          "esri/Map",
          "esri/views/SceneView",
          "esri/layers/SceneLayer",
          "esri/layers/GraphicsLayer",
          "esri/widgets/Sketch/SketchViewModel",
          "esri/layers/FeatureLayer",
        ],
        option
      )
      .then(
        ([
          Map,
          SceneView,
          SceneLayer,
          GraphicsLayer,
          SketchViewModel,
          FeatureLayer,
        ]) => {
          //实例化地图
          _self.map.value = new Map({
            basemap: "satellite", // 地形底图
            ground: "world-elevation" // 地形
          });
          
          //实例化缓冲区
          _self.graphicsLayer.value = new GraphicsLayer();
          
          // 范围图层
          var sceneLayer = new SceneLayer({
            url: "https://danxiagis.top:6443/arcgis/rest/services/DanXia/dxDEM/SceneServer",
          });
          sceneLayer.load().catch((error) => {
            console.log("图层加载失败:", error);
          });
          
          // 添加到地图
          _self.map.value.add(sceneLayer);
          _self.map.value.add(_self.graphicsLayer.value);
          
          // 实例化视图
          _self.mapConfig.sceneView = new SceneView({
            container: _self.mapConfig.container,
            map: _self.map.value,
            camera: {
              position: [113.754, 25.0267, 1500],
              heading: 0,
              tilt: 60
            }
          });
          _self.mapConfig.sceneView.popup.defaultPopupTemplateEnabled = true;
          
          // 实例化线条
          _self.polyline.value = {
            type: "polyline",
            paths: [],
            "spatialReference": {
              "latestWkid": 3857,
              "wkid": 102100
            }
          };
          
          // 实例化草图控件
          _self.sketchViewModel.value = new SketchViewModel({
            layer: _self.graphicsLayer.value,
            view: _self.mapConfig.sceneView
          });
          
          // 线图层
          _self.RoutesfeatureLayer.value = new FeatureLayer({
            url: "https://danxiagis.top:6443/arcgis/rest/services/DanXia/dxRoutes/FeatureServer/0",
            outFields: ["*"]
          });
          _self.map.value.add(_self.RoutesfeatureLayer.value);
          
          // 在地图加载完后设置
          _self.mapConfig.sceneView.when(() => {
            NProgress.done();
          });
        }
      )
      .catch((err) => {
        console.error("地图创建失败,", err);
        NProgress.done();
      });
    };
    
    //激活绘制模式
    const activedrawPolyline = function() {
      c_flag.value = true;
      
      if (sketchViewModel.value) {
        sketchViewModel.value.create("polyline");
        sketchViewModel.value.on(["create"], function(event) {
          if (event.state === "complete") {
            c_flag.value = false;
            // 保存绘制点
            pointList.value = [];
            // 遍历线节点
            event.graphic.geometry.paths[0].forEach(point => {
              pointList.value.push({
                x: point[0],
                y: point[1],
                z: point[2] || 0
              });
            });
            
            // 发起GP分析
            drawProfile(pointList.value, event.graphic);
          }
        });
      }
    };
    
    //收集路线
    const collectRoutes = function() {
      //清空图层
      graphicsLayer.value.removeAll();
      
      //添加高亮
      const queryParams = {
        where: "1=1",
        returnGeometry: true,
        outFields: ["*"]
      };
      
      // 查询所有线
      RoutesfeatureLayer.value.queryFeatures(queryParams).then(function(results) {
        const option = {
          //定义一个包含有JS API中js开发包和css样式文件的对象
          url: "https://js.arcgis.com/4.19/init.js",
          css: "https://js.arcgis.com/4.19/esri/themes/light/main.css",
        };
        
        //通过loadModules来做衔接
        loadModules(["esri/Graphic"], option).then(([Graphic]) => {
          results.features.forEach(function(feature) {
            const polyline = {
              type: "polyline",
              paths: feature.geometry.paths,
              spatialReference: feature.geometry.spatialReference
            };
            
            const lineSymbol = {
              type: "simple-line",
              color: [226, 119, 40],
              width: 4
            };
            
            const polylineGraphic = new Graphic({
              geometry: polyline,
              symbol: lineSymbol,
              attributes: feature.attributes
            });
            
            graphicsLayer.value.add(polylineGraphic);
          });
        });
      });
      
      // 点击事件
      if (highlighSelect.value) {
        highlighSelect.value.remove();
      }
      
      highlighSelect.value = mapConfig.sceneView.on("click", function(event) {
        const screenPoint = event.screenPoint;
        // 获取点击位置的图形
        mapConfig.sceneView.hitTest(screenPoint).then(function(response) {
          const graphic = response.results.find(result => 
            result.graphic.layer === graphicsLayer.value);
          
          if (graphic) {
            //触发分析
            routeSelect.value = graphic.graphic;
            handleRouteChange();
          }
        });
      });
    };
    
    // 处理路线变更
    const handleRouteChange = function() {
      const graphic = routeSelect.value;
      
      if (graphic && graphic.geometry) {
        // 保存绘制点
        pointList.value = [];
        // 遍历线节点
        graphic.geometry.paths[0].forEach(point => {
          pointList.value.push({
            x: point[0],
            y: point[1],
            z: point[2] || 0
          });
        });
        
        // 发起GP分析
        drawProfile(pointList.value, graphic);
      }
    };
    
    // 绘制剖面图
    const drawProfile = function(points, graphic) {
      if (points.length < 2) {
        alert("至少需要2个点才能绘制剖面图");
        return;
      }
      
      // 计算每个点的距离
      const distances = [];
      let totalDistance = 0;
      distances.push(totalDistance);
      
      for (let i = 1; i < points.length; i++) {
        const dx = points[i].x - points[i-1].x;
        const dy = points[i].y - points[i-1].y;
        const segmentDistance = Math.sqrt(dx*dx + dy*dy);
        totalDistance += segmentDistance;
        distances.push(totalDistance);
      }
      
      // 构建GP请求参数
      const params = {
        InputLineFeatures: graphic,
        ProfileIDField: "OBJECTID",
        DEMResolution: "FINEST"
      };
      
      // 加载GP服务
      loadModules(["esri/tasks/Geoprocessor"], option).then(([Geoprocessor]) => {
        // 创建GP对象
        const gp = new Geoprocessor({
          url: "https://danxiagis.top:6443/arcgis/rest/services/DanXia/ProfileTool/GPServer/Profile%20Tool"
        });
        
        // 执行GP
        gp.submitJob(params).then(function(jobInfo) {
          const jobId = jobInfo.jobId;
          
          // 检查任务状态
          const jobCheckTimer = setInterval(function() {
            gp.checkJobStatus(jobId).then(function(jobInfo) {
              if (jobInfo.jobStatus === "job-succeeded") {
                clearInterval(jobCheckTimer);
                
                // 获取结果
                gp.getResultData(jobId, "OutputProfile_JSON").then(function(result) {
                  // 处理结果
                  const profileJson = result.value;
                  const profileData = JSON.parse(profileJson);
                  
                  // 绘制图表
                  drawChart(profileData, distances);
                });
              } else if (jobInfo.jobStatus === "job-failed") {
                clearInterval(jobCheckTimer);
                alert("剖面分析失败");
              }
            });
          }, 1000);
        }).catch(function(error) {
          console.error("提交GP任务失败:", error);
        });
      });
    };
    
    // 绘制图表
    const drawChart = function(profileData, distances) {
      // 初始化图表
      if (!chart.value) {
        loadModules(["esri/core/promiseUtils"], option).then(([promiseUtils]) => {
          // 使用echarts
          const echarts = window.echarts;
          
          if (echarts) {
            chart.value = echarts.init(document.getElementById('echartDiv'));
            
            // 设置图表配置
            const option = {
              title: {
                text: '地形剖面图',
                left: 'center'
              },
              tooltip: {
                trigger: 'axis'
              },
              xAxis: {
                type: 'category',
                name: '距离(米)',
                data: distances
              },
              yAxis: {
                type: 'value',
                name: '高程(米)'
              },
              series: [{
                name: '高程',
                type: 'line',
                data: profileData.map(point => point.z),
                smooth: true
              }]
            };
            
            // 绘制图表
            chart.value.setOption(option);
          } else {
            console.error("未找到echarts库");
          }
        });
      } else {
        // 更新已有图表
        chart.value.setOption({
          xAxis: {
            data: distances
          },
          series: [{
            data: profileData.map(point => point.z)
          }]
        });
      }
    };
    
    // 清除
    const clearAll = function() {
      // 清除图层
      graphicsLayer.value.removeAll();
      
      // 移除监听器
      if (highlighSelect.value) {
        highlighSelect.value.remove();
      }
      
      // 清除图表
      if (chart.value) {
        chart.value.clear();
      }
      
      // 重置状态
      pointList.value = [];
      routeSelect.value = null;
    };
    
    // 生命周期钩子
    onMounted(() => {
      NProgress.start();
      _createMapView();
    });
    
    onBeforeUnmount(() => {
      // 清除所有监听器
      if (highlighSelect.value) {
        highlighSelect.value.remove();
      }
      
      // 销毁图表
      if (chart.value) {
        chart.value.dispose();
      }
      
      NProgress.remove();
    });
    
    // 暴露给模板的内容
    return {
      c_flag,
      map,
      mapConfig,
      graphicsLayer,
      pointList,
      polyline,
      sketchViewModel,
      lengthArray,
      RoutesfeatureLayer,
      highlighSelect,
      routeSelect,
      option,
      chart,
      isstudent,
      _createMapView,
      activedrawPolyline,
      collectRoutes,
      handleRouteChange,
      drawProfile,
      drawChart,
      clearAll
    };
  }
};
</script>

<style scoped>
#sectionLine {
  height:  calc(100vh - 50px);
  width: 100%;
  position: relative;
}
#echartDiv {
  width: 600px;
  height: 360px;
  background-color: rgba(250, 250, 250, 0.5);
}
</style>