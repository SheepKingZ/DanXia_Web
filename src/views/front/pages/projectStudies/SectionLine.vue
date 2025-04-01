<template>
  <!-- 主容器 -->
  <div>
    <!-- 剖面线工具容器 -->
    <div id="sectionLine">
      <!-- 右上角控制面板 -->
      <div class="esri-ui-top-right esri-ui-corner">
        <!-- 控制卡片 -->
        <v-card min-width="400px" color="rgba(255, 255, 255, 0.7)">
          <!-- 卡片标题 -->
          <v-card-title> 剖面线 </v-card-title>
          <!-- 图表容器，仅在有图表配置时显示 -->
          <div id="echartDiv" v-show="chartOption"></div>
          <!-- 分隔线 -->
          <v-divider></v-divider>
          <!-- 操作按钮区域 -->
          <v-card-actions>
            <!-- 自定义绘制按钮，点击后激活绘制模式 -->
            <v-btn color="primary" depressed tile @click="createSketch">
              自定义绘制
            </v-btn>
            <!-- 使用采集路线按钮，仅对学生显示 -->
            <v-btn color="primary" depressed tile @click="collectRoutes" v-show="isstudent">
              使用采集路线
            </v-btn>
            <!-- 清空按钮，清除所有图层和图表 -->
            <v-btn color="primary" depressed tile @click="clearAll">
              清空
            </v-btn>
            <!-- 下载采集路线按钮，当前隐藏 -->
            <v-btn color="primary" depressed tile @click="handleDownloadRoutes" v-show="false">
              下载采集路线
            </v-btn>
            <!-- 图表缩放按钮，切换图表显示状态 -->
            <v-btn v-model="showChart" fab color="primary" @click="toggleChartSize" small>
              <!-- 当图表显示时，显示折叠图标 -->
              <v-icon v-if="showChart"> mdi-arrow-collapse </v-icon>
              <!-- 当图表隐藏时，显示展开图标 -->
              <v-icon v-else> mdi-arrow-expand </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
// 导入 ArcGIS API 加载器
import { loadModules } from "esri-loader";
// 导入 Vue 组合式 API
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue';
// 导入进度条组件
import NProgress from 'nprogress';
// 导入进度条样式
import 'nprogress/nprogress.css';

export default {
  // 组件名称
  name: "SectionLine",
  // 使用 Vue3 组合式 API
  setup() {
    // === 响应式状态声明 ===
    
    // 是否在绘制中的标志
    const c_flag = ref(false);
    // 地图对象引用
    const map = ref(null);
    // 地图配置对象
    const mapConfig = reactive({
      container: "sectionLine", // 容器ID
      sceneView: null, // 场景视图对象
    });
    // 图形图层，用于显示线条
    const graphicsLayer = ref(null);
    // 存储绘制点的数组
    const pointList = ref([]);
    // 线条对象
    const polyline = ref(null);
    // 草图模型，用于绘制交互
    const sketchViewModel = ref(null);
    // 线段长度数组
    const lengthArray = ref([]);
    // 路线要素图层
    const RoutesfeatureLayer = ref(null);
    // 高亮选中对象
    const highlighSelect = ref(null);
    // 选中的路线
    const routeSelect = ref(null);
    // 图表配置对象
    const chartOption = ref(null);
    // 控制图表显示状态
    const showChart = ref(false);
    // 图表对象
    const chart = ref(null);
    // 是否是学生身份
    const isstudent = ref(true);
    
    // ArcGIS API 配置
    const option = {
      url: "https://js.arcgis.com/4.19/init.js", // API JavaScript 文件路径
      css: "https://js.arcgis.com/4.19/esri/themes/light/main.css", // API CSS 文件路径
    };

    // === 方法定义 ===

    /**
     * 创建地图视图
     * 初始化三维场景并加载地形数据
     */
    const createMapView = function() {
      // 开始显示进度条
      NProgress.start();
      
      // 清理现有地图资源
      if (map.value) {
        try {
          if (mapConfig.sceneView) {
            // 销毁当前场景视图
            mapConfig.sceneView.destroy();
            mapConfig.sceneView = null;
          }
        } catch (err) {
          console.warn("清理地图视图失败", err);
        }
      }
      
      // 使用 esri-loader 加载 ArcGIS API 模块
      loadModules(
        [
          "esri/Map", // 地图核心类
          "esri/views/SceneView", // 3D 场景视图
          "esri/layers/SceneLayer", // 3D 场景图层
          "esri/layers/GraphicsLayer", // 图形图层
          "esri/widgets/Sketch/SketchViewModel", // 草图工具模型
          "esri/layers/FeatureLayer", // 要素图层
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
          try {
            // 创建地图实例
            map.value = new Map({
              basemap: "satellite", // 使用卫星影像作为底图
              ground: "world-elevation" // 启用全球高程数据
            });
            
            // 创建图形图层用于绘制线条
            graphicsLayer.value = new GraphicsLayer();
            
            // 创建包含丹霞地形的场景图层
            var sceneLayer = new SceneLayer({
              url: "https://danxiagis.top:6443/arcgis/rest/services/DanXia/dxDEM/SceneServer",
            });
            
            // 加载场景图层并处理错误
            sceneLayer.load().catch((error) => {
              console.log("图层加载失败:", error);
            });
            
            // 将图层添加到地图
            map.value.add(sceneLayer);
            map.value.add(graphicsLayer.value);
            
            // 创建并配置 3D 场景视图
            mapConfig.sceneView = new SceneView({
              container: mapConfig.container, // 容器元素 ID
              map: map.value, // 使用上面创建的地图
              camera: {
                position: [113.754, 25.0267, 1500], // 相机初始位置（经度、纬度、高度）
                heading: 0, // 相机朝向（方位角）
                tilt: 60 // 相机倾斜角度
              }
            });
            
            // 启用弹出窗口
            mapConfig.sceneView.popup.defaultPopupTemplateEnabled = true;
            
            // 初始化折线几何对象
            polyline.value = {
              type: "polyline", // 几何类型为折线
              paths: [], // 路径数组初始为空
              "spatialReference": { // 空间参考系统
                "latestWkid": 3857,
                "wkid": 102100
              }
            };
            
            // 创建草图视图模型，用于交互式绘制
            sketchViewModel.value = new SketchViewModel({
              layer: graphicsLayer.value, // 绘制到的图层
              view: mapConfig.sceneView // 关联的视图
            });
            
            // 创建路线要素图层
            RoutesfeatureLayer.value = new FeatureLayer({
              url: "https://danxiagis.top:6443/arcgis/rest/services/DanXia/dxRoutes/FeatureServer/0",
              outFields: ["*"] // 获取所有字段
            });
            
            // 将路线图层添加到地图
            map.value.add(RoutesfeatureLayer.value);
            
            // 场景加载完成后执行
            mapConfig.sceneView.when(() => {
              // 关闭进度条
              NProgress.done();
            });
          } catch (error) {
            // 处理初始化过程中的错误
            console.error("地图初始化过程中出错:", error);
            NProgress.done();
          }
        }
      )
      .catch((err) => {
        // 处理模块加载错误
        console.error("地图创建失败,", err);
        NProgress.done();
      });
    };
    
    /**
     * 创建绘制草图
     * 清除现有高亮并激活绘制模式
     */
    const createSketch = function() {
      // 移除现有高亮
      if (highlighSelect.value) {
        highlighSelect.value.remove();
      }
      // 激活绘制模式
      activedrawPolyline();
    };
    
    /**
     * 激活绘制折线模式
     * 启用草图工具并监听绘制完成事件
     */
    const activedrawPolyline = function() {
      // 设置绘制中标志
      c_flag.value = true;
      
      // 检查草图模型是否已初始化
      if (sketchViewModel.value) {
        // 创建折线绘制模式
        sketchViewModel.value.create("polyline");
        // 监听创建事件
        sketchViewModel.value.on(["create"], function(event) {
          // 绘制完成时
          if (event.state === "complete") {
            // 取消绘制标志
            c_flag.value = false;
            // 清空点列表
            pointList.value = [];
            // 遍历线条节点
            event.graphic.geometry.paths[0].forEach(point => {
              // 添加到点列表，包含 x,y,z 坐标
              pointList.value.push({
                x: point[0],
                y: point[1],
                z: point[2] || 0 // 如果没有 z 值则默认为 0
              });
            });
            
            // 启动地形剖面分析
            drawProfile(pointList.value, event.graphic);
          }
        });
      }
    };
    
    /**
     * 收集路线
     * 从要素服务加载预设路线
     */
    const collectRoutes = function() {
      // 清空当前图形图层
      if (graphicsLayer.value) {
        graphicsLayer.value.removeAll();
      }
      
      // 检查路线图层是否已初始化
      if (!RoutesfeatureLayer.value) {
        console.error("路线图层未初始化");
        return;
      }
      
      // 创建查询参数，获取所有路线
      const queryParams = {
        where: "1=1", // 查询所有记录
        returnGeometry: true, // 返回几何信息
        outFields: ["*"] // 返回所有字段
      };
      
      // 执行要素查询
      RoutesfeatureLayer.value.queryFeatures(queryParams).then(function(results) {
        // 加载 Graphic 类
        loadModules(["esri/Graphic"], option).then(([Graphic]) => {
          // 遍历每条路线要素
          results.features.forEach(function(feature) {
            // 创建折线几何对象
            const polyline = {
              type: "polyline",
              paths: feature.geometry.paths,
              spatialReference: feature.geometry.spatialReference
            };
            
            // 设置线条符号样式
            const lineSymbol = {
              type: "simple-line",
              color: [226, 119, 40], // 橙色
              width: 4 // 4像素宽
            };
            
            // 创建图形对象
            const polylineGraphic = new Graphic({
              geometry: polyline,
              symbol: lineSymbol,
              attributes: feature.attributes // 保留原始属性
            });
            
            // 添加到图形图层
            graphicsLayer.value.add(polylineGraphic);
          });
        });
      });
      
      // 清除现有点击事件监听器
      if (highlighSelect.value) {
        highlighSelect.value.remove();
      }
      
      // 添加点击事件监听器，用于选择路线
      highlighSelect.value = mapConfig.sceneView.on("click", function(event) {
        // 获取点击位置的屏幕坐标
        const screenPoint = event.screenPoint;
        // 执行命中测试
        mapConfig.sceneView.hitTest(screenPoint).then(function(response) {
          // 查找点击的是否是图形图层上的图形
          const graphic = response.results.find(result => 
            result.graphic.layer === graphicsLayer.value);
          
          // 如果找到路线图形
          if (graphic) {
            // 保存选中的路线
            routeSelect.value = graphic.graphic;
            // 处理路线变更
            handleRouteChange();
          }
        });
      });
    };
    
    /**
     * 处理路线变更
     * 当用户选择了一条路线时处理
     */
    const handleRouteChange = function() {
      // 获取选中的图形
      const graphic = routeSelect.value;
      
      // 检查图形是否有效
      if (graphic && graphic.geometry) {
        // 清空点列表
        pointList.value = [];
        // 遍历线条节点
        graphic.geometry.paths[0].forEach(point => {
          // 添加到点列表
          pointList.value.push({
            x: point[0],
            y: point[1],
            z: point[2] || 0 // 如果没有 z 值则默认为 0
          });
        });
        
        // 启动地形剖面分析
        drawProfile(pointList.value, graphic);
      }
    };
    
    /**
     * 绘制剖面图
     * 使用地理处理服务分析地形剖面
     * @param {Array} points - 路径点数组
     * @param {Object} graphic - 路径图形对象
     */
    const drawProfile = function(points, graphic) {
      // 检查点数量是否足够
      if (points.length < 2) {
        alert("至少需要2个点才能绘制剖面图");
        return;
      }
      
      // 计算每个点的累计距离
      const distances = [];
      let totalDistance = 0;
      distances.push(totalDistance); // 起点距离为0
      
      // 遍历所有点计算距离
      for (let i = 1; i < points.length; i++) {
        // 计算与前一点的 x,y 差值
        const dx = points[i].x - points[i-1].x;
        const dy = points[i].y - points[i-1].y;
        // 计算段距离（欧几里得距离）
        const segmentDistance = Math.sqrt(dx*dx + dy*dy);
        // 累加到总距离
        totalDistance += segmentDistance;
        // 添加到距离数组
        distances.push(totalDistance);
      }
      
      // 构建地理处理服务参数
      const params = {
        InputLineFeatures: graphic, // 输入线要素
        ProfileIDField: "OBJECTID", // 使用 OBJECTID 作为标识
        DEMResolution: "FINEST" // 使用最精细的分辨率
      };
      
      // 加载地理处理服务模块
      loadModules(["esri/tasks/Geoprocessor"], option).then(([Geoprocessor]) => {
        // 创建地理处理服务对象
        const gp = new Geoprocessor({
          url: "https://danxiagis.top:6443/arcgis/rest/services/DanXia/ProfileTool/GPServer/Profile%20Tool"
        });
        
        // 提交分析任务
        gp.submitJob(params).then(function(jobInfo) {
          // 获取任务 ID
          const jobId = jobInfo.jobId;
          
          // 设置定时器检查任务状态
          const jobCheckTimer = setInterval(function() {
            // 检查任务状态
            gp.checkJobStatus(jobId).then(function(jobInfo) {
              // 如果任务成功完成
              if (jobInfo.jobStatus === "job-succeeded") {
                // 清除检查定时器
                clearInterval(jobCheckTimer);
                
                // 获取剖面结果
                gp.getResultData(jobId, "OutputProfile_JSON").then(function(result) {
                  // 解析 JSON 结果
                  const profileJson = result.value;
                  const profileData = JSON.parse(profileJson);
                  
                  // 绘制剖面图表
                  drawChart(profileData, distances);
                  // 显示图表
                  showChart.value = true;
                });
              } else if (jobInfo.jobStatus === "job-failed") {
                // 如果任务失败
                clearInterval(jobCheckTimer);
                alert("剖面分析失败");
              }
            });
          }, 1000); // 每秒检查一次
        }).catch(function(error) {
          // 处理任务提交错误
          console.error("提交GP任务失败:", error);
        });
      });
    };
    
    /**
     * 绘制图表
     * 使用 ECharts 绘制地形剖面图
     * @param {Array} profileData - 剖面数据
     * @param {Array} distances - 距离数组
     */
    const drawChart = function(profileData, distances) {
      // 如果图表未初始化
      if (!chart.value) {
        // 加载工具模块
        loadModules(["esri/core/promiseUtils"], option).then(([promiseUtils]) => {
          // 获取全局 echarts 对象
          const echarts = window.echarts;
          
          // 检查 echarts 是否可用
          if (echarts) {
            // 初始化图表实例
            chart.value = echarts.init(document.getElementById('echartDiv'));
            
            // 创建图表配置
            chartOption.value = {
              title: {
                text: '地形剖面图', // 图表标题
                left: 'center' // 标题居中
              },
              tooltip: {
                trigger: 'axis' // 显示坐标轴提示
              },
              xAxis: {
                type: 'category', // 分类型 X 轴
                name: '距离(米)', // X 轴名称
                data: distances // X 轴数据
              },
              yAxis: {
                type: 'value', // 数值型 Y 轴
                name: '高程(米)' // Y 轴名称
              },
              series: [{
                name: '高程', // 系列名称
                type: 'line', // 线型图表
                data: profileData.map(point => point.z), // 使用点的 z 值作为高程
                smooth: true // 平滑曲线
              }]
            };
            
            // 应用配置绘制图表
            chart.value.setOption(chartOption.value);
          } else {
            console.error("未找到echarts库");
          }
        });
      } else {
        // 如果图表已存在，更新配置
        chartOption.value = {
          xAxis: {
            data: distances // 更新距离数据
          },
          series: [{
            data: profileData.map(point => point.z) // 更新高程数据
          }]
        };
        
        // 应用更新后的配置
        chart.value.setOption(chartOption.value);
      }
    };
    
    /**
     * 清除图层和数据
     * 重置工具状态
     */
    const clearAll = function() {
      // 清除图形图层
      if (graphicsLayer.value) {
        graphicsLayer.value.removeAll();
      }
      
      // 移除点击事件监听器
      if (highlighSelect.value) {
        highlighSelect.value.remove();
      }
      
      // 清除图表
      if (chart.value) {
        chart.value.clear();
        chartOption.value = null;
        showChart.value = false;
      }
      
      // 重置点列表和选中路线
      pointList.value = [];
      routeSelect.value = null;
    };
    
    /**
     * 下载路线数据
     * 导出路线为文件（未实现）
     */
    const handleDownloadRoutes = function() {
      console.log("下载路线功能暂未实现");
      // 这里可以实现路线数据的导出功能
    };
    
    /**
     * 切换图表大小
     * 控制图表的显示/隐藏
     */
    const toggleChartSize = function() {
      // 切换图表显示状态
      showChart.value = !showChart.value;
      
      // 如果显示图表，则在下一帧重新调整图表大小
      if (chart.value && showChart.value) {
        nextTick(() => {
          chart.value.resize();
        });
      }
    };
    
    // === 生命周期钩子 ===
    
    /**
     * 组件挂载时
     * 初始化地图和场景
     */
    onMounted(() => {
      // 显示进度条
      NProgress.start();
      // 创建地图视图
      createMapView();
    });
    
    /**
     * 组件卸载前
     * 清理资源和释放内存
     */
    onBeforeUnmount(() => {
      // 移除事件监听器
      if (highlighSelect.value) {
        highlighSelect.value.remove();
      }
      
      // 销毁图表对象
      if (chart.value) {
        chart.value.dispose();
        chart.value = null;
      }
      
      // 销毁地图视图
      if (mapConfig.sceneView) {
        mapConfig.sceneView.destroy();
        mapConfig.sceneView = null;
      }
      
      // 移除进度条
      NProgress.remove();
    });
    
    // 返回模板可用的属性和方法
    return {
      c_flag,                // 是否在绘制中标志
      map,                   // 地图对象
      mapConfig,             // 地图配置
      graphicsLayer,         // 图形图层
      pointList,             // 点列表
      polyline,              // 折线对象
      sketchViewModel,       // 草图模型
      lengthArray,           // 长度数组
      RoutesfeatureLayer,    // 路线图层
      highlighSelect,        // 高亮选中
      routeSelect,           // 选中路线
      chartOption,           // 图表配置
      showChart,             // 图表显示状态
      chart,                 // 图表对象
      isstudent,             // 学生身份标志
      createMapView,         // 创建地图视图
      createSketch,          // 创建草图绘制
      activedrawPolyline,    // 激活绘制模式
      collectRoutes,         // 收集路线
      handleRouteChange,     // 处理路线变更
      drawProfile,           // 绘制剖面
      drawChart,             // 绘制图表
      clearAll,              // 清除所有
      handleDownloadRoutes,  // 下载路线
      toggleChartSize        // 切换图表大小
    };
  }
};
</script>

<style scoped>
/* 剖面线容器样式 */
#sectionLine {
  height:  calc(100vh - 50px); /* 高度为视口高度减去50px */
  width: 100%; /* 宽度占满父容器 */
  position: relative; /* 相对定位 */
}

/* 图表容器样式 */
#echartDiv {
  width: 600px; /* 固定宽度 */
  height: 360px; /* 固定高度 */
  background-color: rgba(250, 250, 250, 0.5); /* 半透明背景 */
}
</style>