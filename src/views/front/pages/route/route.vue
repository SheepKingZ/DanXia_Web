<template>
  <!-- 主容器 - 包含整个路线探索界面 -->
  <div class="route-container">
    <!-- 主要布局 - 使用flex布局组织左侧抽屉、地图和右侧详情面板 -->
    <div class="route-layout">
      <!-- 左侧路线点列表 - 使用Vuetify导航抽屉组件 -->
      <v-navigation-drawer
        v-model="drawer"      
        :rail="mini"          
        permanent            
        width="280"          
        :rail-width="56"     
        class="elevation-2 route-drawer"
        @click="mini = false" 
      >
        <!-- 抽屉标题 -->
        <v-list-item class="px-2">
          <v-list-item-title class="text-h6">实习点</v-list-item-title>
          <!-- 收起/展开按钮 -->
          <template #append>
            <v-btn icon @click.stop="mini = !mini">
              <v-icon>{{ mini ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
            </v-btn>
          </template>
        </v-list-item>

        <v-divider></v-divider>

        <!-- 路线点列表 - 使用紧凑型列表布局 -->
        <v-list density="compact" class="route-list py-0">
          <!-- 路线1组 - 阳元山-通泰桥路线 -->
          <v-list-group value="route1">
            <!-- 路线组标题 -->
            <template #activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-map-marker-path" title="阳元山-通泰桥路线"></v-list-item>
            </template>

            <!-- 路线1点列表项 - 动态生成 -->
            <v-list-item
              v-for="(item, i) in items0"
              :key="i"
              :title="item"
              link
              @click="onListClickHandler"
              class="location-item"
              prepend-icon="mdi-map-marker"
              density="compact"
            ></v-list-item>
          </v-list-group>
          
          <!-- 路线2组 - 锦石岩-长老峰路线 -->
          <v-list-group value="route2">
            <template #activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-map-marker-path" title="锦石岩-长老峰路线"></v-list-item>
            </template>

            <!-- 路线2点列表项 - 动态生成 -->
            <v-list-item
              v-for="(item, i) in items1"
              :key="i"
              :title="item" 
              link
              @click="onListClickHandler"
              class="location-item"
              prepend-icon="mdi-map-marker"
              density="compact"
            ></v-list-item>
          </v-list-group>
          
          <!-- 路线3组 - 阴元石-祥龙湖路线 -->
          <v-list-group value="route3">
            <template #activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-map-marker-path" title="阴元石-祥龙湖路线"></v-list-item>
            </template>

            <!-- 路线3点列表项 - 动态生成 -->
            <v-list-item
              v-for="(item, i) in items2"
              :key="i"
              :title="item"
              link
              @click="onListClickHandler"
              class="location-item"
              prepend-icon="mdi-map-marker"
              density="compact"
            ></v-list-item>
          </v-list-group>
        </v-list>
      </v-navigation-drawer>

      <!-- 地图容器 - 中央部分，包含地图和控制面板 -->
      <div class="map-wrapper">
        <!-- ArcGIS地图元素 - id作为地图初始化的目标容器 -->
        <div id="route1" class="map-container">
          <!-- 坐标信息卡片 - 显示鼠标点击位置的经纬度 -->
          <div class="coordinate-card-container">
            <v-card elevation="2" class="coordinate-card">
              <v-card-title class="py-2 text-body-1">
                点击处坐标：<span class="font-weight-medium">{{ long }}, {{ lat }}</span> (WKID: 4326)
              </v-card-title>
            </v-card>
          </div>
          
          <!-- 底图切换控制面板 - 提供底图类型选择和快速导航 -->
          <div class="basemap-control-container">
            <v-card class="control-panel" elevation="2">
              <v-card-title class="py-2 text-h6">
                <v-icon class="mr-2">mdi-layers</v-icon>底图控制
              </v-card-title>
              
              <v-card-text class="pt-0">
                <!-- 底图类型切换 - 卫星影像/矢量地图 -->
                <v-radio-group row v-model="selectedMapType" density="compact">
                  <v-radio
                    label="卫星影像"
                    value="1"
                    @change="changeMapType"
                    color="primary"
                  ></v-radio>
                  <v-radio
                    label="矢量地图"
                    value="2"
                    @change="changeMapType"
                    color="primary"
                  ></v-radio>
                </v-radio-group>
                
                <!-- 快速导航按钮组 - 跳转到不同地理位置 -->
                <div class="d-flex flex-wrap location-buttons">
                  <!-- 丹霞山按钮 -->
                  <v-btn
                    prepend-icon="mdi-map-marker"
                    variant="outlined"
                    class="location-btn"
                    color="primary"
                    @click="goDan"
                  >
                    丹霞山
                  </v-btn>
                  
                  <!-- 莽山按钮 -->
                  <v-btn
                    prepend-icon="mdi-map-marker"
                    variant="outlined"
                    class="location-btn"
                    color="success"
                    @click="goMang"
                  >
                    莽山
                  </v-btn>
                  
                  <!-- 象鼻山按钮 -->
                  <v-btn
                    prepend-icon="mdi-map-marker"
                    variant="outlined"
                    class="location-btn"
                    color="info"
                    @click="goXiang"
                  >
                    象鼻山
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </div>
          
          <!-- 十字线指示器 - 高亮显示选中的点 -->
          <div class="crosshair-line horizontal" v-show="horizontalLine"></div>
          <div class="crosshair-line vertical" v-show="verticalLine"></div>
        </div>
        
        <!-- 点详情切换按钮 - 控制右侧详情面板的显示隐藏 -->
        <v-btn
          @click.stop="anmini = !anmini"
          :icon="anmini ? 'mdi-chevron-left' : 'mdi-chevron-right'"
          color="primary"
          class="detail-toggle-btn"
          elevation="2"
          size="small"
        ></v-btn>
      </div>

      <!-- 右侧点详情面板 - 使用Vuetify导航抽屉组件 -->
      <v-navigation-drawer
        v-model="andrawer"
        :width="anmini ? 0 : 360"  
        permanent                   
        location="right"            
        class="elevation-2 detail-drawer"
      >
        <!-- 详情卡片 -->
        <v-card flat class="detail-card">
          <!-- 详情标题 -->
          <v-card-title class="d-flex align-center py-3 px-4">
            <v-icon color="primary" class="mr-2">mdi-information-outline</v-icon>
            <!-- 学生模式 - 只显示点名称 -->
            <div v-if="!isTeacher" class="text-h6 flex-grow-1">
              {{ pointTitle }}
            </div>
            <!-- 教师模式 - 可编辑点名称 -->
            <div v-if="isTeacher" class="flex-grow-1">
              <v-textarea
                v-model="pointTitle"
                @change="edit_info"
                variant="outlined"
                rows="1"
                hide-details
                density="compact"
              ></v-textarea>
            </div>
          </v-card-title>
          
          <v-divider></v-divider>
          
          <!-- 详情内容区域 -->
          <div class="detail-content">
            <!-- 点介绍和属性信息 - 使用手风琴面板 -->
            <v-expansion-panels variant="accordion">
              <v-expansion-panel expanded>
                <v-expansion-panel-title>
                  简介与基本信息
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <!-- 点简介 -->
                  <div class="py-2">
                    <div class="text-subtitle-1 font-weight-bold mb-2">简介</div>
                    <!-- 学生模式 - 只显示简介文本 -->
                    <div v-if="!isTeacher" class="text-body-2">{{ pointIntroduce }}</div>
                    <!-- 教师模式 - 可编辑简介 -->
                    <v-textarea
                      v-if="isTeacher"
                      @change="edit_info"
                      v-model="pointIntroduce"
                      rows="4"
                      variant="outlined"
                      hide-details
                    ></v-textarea>
                  </div>
                  
                  <!-- 点属性表格 -->
                  <v-table density="compact" class="mt-2">
                    <tbody>
                      <tr v-for="item in desserts" :key="item.name">
                        <td width="30%" class="font-weight-medium">{{ item.name }}</td>
                        <td>{{ item.calories }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
            
            <!-- 图片轮播 - 显示点的相关图片 -->
            <v-card flat class="mt-3">
              <v-card-subtitle class="pb-0 pt-2">
                <v-icon size="small" class="mr-1">mdi-image-multiple</v-icon>
                图片资料
              </v-card-subtitle>
              <!-- 图片滑动组 -->
              <v-slide-group
                v-model="model"
                class="pa-2"
                center-active
                show-arrows
              >
                <!-- 动态生成图片卡片 -->
                <v-slide-group-item
                  v-for="(item, i) in pointItems"
                  :key="i"
                  v-slot="{ isSelected, toggle }"
                >
                  <v-card
                    :color="isSelected ? 'primary' : undefined"
                    class="ma-1"
                    width="150"
                    height="100"
                    @click="toggle(); clickLocation(i);"
                  >
                    <v-img
                      :src="item.src"
                      height="100"
                      cover
                      class="rounded"
                    ></v-img>
                  </v-card>
                </v-slide-group-item>
              </v-slide-group>
            </v-card>
            
            <!-- 视频播放器 - 仅当有视频资源时显示 -->
            <v-card flat class="mt-3" v-if="srcvideo">
              <v-card-subtitle class="pb-0 pt-2">
                <v-icon size="small" class="mr-1">mdi-video</v-icon>
                视频资料
              </v-card-subtitle>
              <div class="pa-2">
                <!-- 视频播放器组件 -->
                <video-player
                  ref="videoPlayer"
                  class="video-player vjs-custom-skin rounded"
                  :playsinline="true"
                  :options="playerOptions"
                  @play="onPlayerPlay"
                  @pause="onPlayerPause"
                >
                </video-player>
              </div>
            </v-card>
          </div>
        </v-card>
      </v-navigation-drawer>
    </div>
    
    <!-- 图片放大查看器 - 点击图片时激活 -->
    <div>
      <viewer
        ref="viewer"
        :images="pointItems"
        @inited="inited"
        style="display: none"
        v-if="viewer1"
        rebuild
      >
        <img v-for="(pic, index) in pointItems" :key="index" :src="pic.src" />
      </viewer>
    </div>
  </div>
</template>

<script>
// 导入ArcGIS API加载器，用于动态加载地图相关模块
import { loadModules } from "esri-loader";
// 导入HTTP请求库，用于与服务器交互
import axios from "axios";
// 导入进度条组件，用于显示加载状态
import NProgress from "nprogress";
// 导入进度条样式
import "nprogress/nprogress.css";
// 导入Vue 3组合式API
import { ref, reactive, onMounted, nextTick } from 'vue';
// 导入视频播放器组件
import { VideoPlayer } from 'vue-video-player';

export default {
  // 组件名称
  name: "RouteExplorer",
  // 注册子组件
  components: {
    'video-player': VideoPlayer // 注册视频播放器组件
  },
  // 使用Vue 3组合式API
  setup() {
    // === 状态变量声明 ===
    
    // 从会话存储中获取教师身份标识
    const isTeacher = ref(sessionStorage.getItem("isteacher") == "true" ? true : false);
    
    // 路线显示控制标志
    const r1 = ref(true); // 控制路线1的显示
    const r2 = ref(true); // 控制路线2的显示
    const r3 = ref(true); // 控制路线3的显示
    
    // 地图相关对象
    const map = ref(null); // 地图对象引用
    const mapConfig = reactive({
      container: "route1", // 地图容器ID
      mapView: null, // 地图视图对象
    });
    const graphics = ref(null); // 图形对象
    const highlighSelect = ref(null); // 高亮选择对象
    
    // 点详情信息
    const pointTitle = ref(""); // 点标题
    const desserts = ref([]); // 存储表格内容（点属性）
    const selectedItem = ref(0); // 当前选中项
    
    // 路线点列表
    const items0 = ref([]); // 存储通泰桥路线（r1）点列表
    const items1 = ref([]); // 存储长老峰路线（r2）点列表
    const items2 = ref([]); // 存储阴元石路线（r3）点列表
    
    // 抽屉控制
    const drawer = ref(true); // 左侧抽屉显示状态
    const mini = ref(false); // 控制左侧点列表是否收起
    const andrawer = ref(true); // 右侧抽屉显示状态
    const anmini = ref(true); // 控制右侧点详情是否收起
    
    // 图片和视频相关
    const model = ref(null); // 图片滑动组选中模型
    const pointItems = ref([]); // 存储当前点的图片列表
    const viewer1 = ref(false); // 图片大图查看器显示状态
    const picModel = ref(0); // 控制放大的图片显示的索引
    const i = ref(0); // 监控图片查看大图的点击次数
    const srcvideo = ref(""); // 视频地址
    const viewer = ref(null); // 图片查看器实例
    
    // 视频播放器配置
    const playerOptions = reactive({
      autoplay: false, // 如果true,浏览器准备好时开始回放
      muted: false, // 默认情况下是否静音
      loop: false, // 是否循环播放
      preload: "auto", // 视频预加载方式
      language: "zh-CN", // 语言设置
      aspectRatio: "16:9", // 视频比例
      fluid: true, // 是否使用流体布局
      sources: [], // 存储视频源信息
      hls: true, // 是否支持HLS格式
      poster: "", // 视频封面地址
      width: document.documentElement.clientWidth, // 播放器宽度
      notSupportedMessage: "此视频暂无法播放，请稍后再试", // 无法播放时的提示信息
      controlBar: { // 控制栏配置
        timeDivider: false, // 时间分隔符
        durationDisplay: true, // 显示总时长
        remainingTimeDisplay: false, // 显示剩余时间
        fullscreenToggle: true, // 全屏按钮
      },
    });
    
    // 地图交互相关
    const pointGraphic = ref(null); // 控制点闪烁的图形对象
    const pointGraphicLayer = ref(null); // 闪烁点的图形图层
    const horizontalLine = ref(false); // 控制水平十字线是否可见
    const verticalLine = ref(false); // 控制垂直十字线是否可见
    const pointIntroduce = ref(null); // 点简介
    
    // 地图配置
    const type = ref("img"); // 当前底图类型（img为影像，vec为矢量）
    const selectedMapType = ref("1"); // 底图类型选择值
    const p_id = ref(""); // 当前选中点的ID
    
    // 预设位置坐标
    const mangMount = ref([112.977, 25.02841]); // 莽山坐标
    const xiangMount = ref([110.295494, 25.266705]); // 象鼻山坐标
    const danMount = ref([113.754555, 25.026711]); // 丹霞山坐标
    
    // 图层和位置状态
    const baseLayers = ref(null); // 底图图层引用
    const current_mount = ref("danxia"); // 当前位置
    
    // 点击位置坐标
    const lat = ref(""); // 纬度
    const long = ref(""); // 经度

    // === 方法定义 ===

    /**
     * 编辑点信息
     * 向服务器提交点的更新信息（仅教师模式可用）
     */
    const edit_info = () => {
      // 检查是否有选中的点
      if (!p_id.value) return;
      
      // 发送更新请求
      axios({
        url: "https://danxiagis.top:8081/pointData/update",
        method: "post",
        params: {
          pointId: p_id.value, // 点ID
          introduce: pointIntroduce.value, // 更新的介绍
          point_name: pointTitle.value, // 更新的名称
        },
      }).then((res) => {
        console.log("响应:", res);
        // 更新成功后重新获取点信息以确认更新
        axios({
          url: "https://danxiagis.top:8081/pointData/get",
          method: "post",
          params: {
            pointId: p_id.value,
          },
        }).then((res) => {
          // 更新界面显示的值
          pointIntroduce.value = res.data.introduce;
          pointTitle.value = res.data.point_name;
        });
      }).catch(err => {
        console.error("更新点信息失败:", err);
      });
    };

    /**
     * 切换底图类型
     * 根据用户选择更改底图类型并重新加载地图
     */
    const changeMapType = () => {
      // 根据选择设置底图类型
      if (selectedMapType.value === "1") type.value = "img"; // 卫星影像
      else if (selectedMapType.value === "2") type.value = "vec"; // 矢量地图
      
      // 重新创建地图视图，保持当前位置
      if (current_mount.value == "danxia") createMapView(danMount.value);
      else if (current_mount.value == "mang") createMapView(mangMount.value);
      else if (current_mount.value == "xiangbi") createMapView(xiangMount.value);
    };

    /**
     * 创建地图视图
     * 初始化ArcGIS地图并加载相关图层
     * @param {Array} center - 地图中心点坐标 [经度, 纬度]
     */
    const createMapView = (center) => {
      // 显示进度条
      NProgress.start();
      
      // 清理现有地图资源
      if (map.value) {
        try {
          if (mapConfig.mapView) {
            // 销毁当前地图视图
            mapConfig.mapView.destroy();
            mapConfig.mapView = null;
          }
        } catch (err) {
          console.warn("清理地图视图失败", err);
        }
      }
      
      // ArcGIS API配置
      const option = {
        url: "https://js.arcgis.com/4.19/init.js", // JavaScript API URL
        css: "https://js.arcgis.com/4.19/esri/themes/light/main.css", // CSS URL
      };
      
      // 使用loadModules加载ArcGIS API模块
      loadModules(
        [
          "esri/Map", // 地图核心类
          "esri/views/MapView", // 2D地图视图
          "esri/layers/FeatureLayer", // 要素图层
          "esri/Graphic", // 图形对象
          "esri/layers/GraphicsLayer", // 图形图层
          "esri/layers/WebTileLayer", // Web瓦片图层
          "esri/layers/support/TileInfo", // 瓦片信息
          "esri/geometry/SpatialReference", // 空间参考
          "esri/Basemap", // 底图
        ],
        option
      )
        .then(
          ([
            Map,
            MapView,
            FeatureLayer,
            Graphic,
            GraphicsLayer,
            WebTileLayer,
            TileInfo,
            SpatialReference,
            Basemap,
          ]) => {
            try {
              // 使用WGS84坐标系
              const spatialReference = SpatialReference.WGS84;

              // 创建瓦片信息对象，定义地图分辨率和比例
              const tileInfo = new TileInfo({
                dpi: 90.71428571427429,
                lods: [
                  // 定义不同缩放级别的分辨率和比例尺
                  {
                    level: 0,
                    levelValue: "1",
                    scale: 295828763.79585470937713011037,
                    resolution: 0.703125,
                  },
                  // ... 其他缩放级别定义
                  {
                    level: 18,
                    levelValue: "19",
                    scale: 1128.4971763452709555707172788,
                    resolution: 0.000002682209014892578125,
                  },
                ],
                size: [256, 256], // 瓦片大小
                origin: { // 原点坐标
                  x: -180,
                  y: 90,
                },
                spatialReference, // 空间参考
              });

              // 创建底图图层（使用天地图服务）
              const webTileLayer = new WebTileLayer({
                urlTemplate:
                  "http://{subDomain}.tianditu.gov.cn/" +
                  type.value +
                  "_c/esri/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=" +
                  type.value +
                  "&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=94a9c789edc5d02e50a129a2276d3ab7",
                subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"], // 子域名，用于负载均衡
                tileInfo, // 瓦片信息
                spatialReference, // 空间参考
              });
              
              // 创建底图对象
              const basemap = new Basemap({
                baseLayers: [webTileLayer], // 底图图层
              });
              
              // 创建地图对象
              map.value = new Map({
                basemap, // 底图
                ground: "world-elevation", // 使用全球高程数据
              });

              // 创建地图视图
              mapConfig.mapView = new MapView({
                map: map.value, // 地图对象
                zoom: 14, // 初始缩放级别
                center: center, // 中心点
                container: mapConfig.container, // 容器ID
                constraints: {
                  minZoom: 11, // 最小缩放级别限制
                },
              });

              // 设置地图点击事件，获取点击位置坐标
              mapConfig.mapView.on("click", (event) => {
                if (event.mapPoint) {
                  lat.value = event.mapPoint.latitude.toFixed(6); // 保留6位小数
                  long.value = event.mapPoint.longitude.toFixed(6); // 保留6位小数
                }
              });

              // 创建标注样式，用于显示地点名称
              const labelClass = {
                symbol: {
                  type: "text", // 文本符号
                  color: "black", // 颜色
                  font: { // 字体设置
                    family: "Playfair Display",
                    size: 12,
                    weight: "bold",
                  },
                },
                labelPlacement: "above-center", // 标签放置位置
                labelExpressionInfo: {
                  expression: "$feature.name", // 显示name字段的值
                },
              };

              // 初始化点闪烁效果相关对象
              pointGraphic.value = new Graphic(); // 创建图形对象
              pointGraphicLayer.value = new GraphicsLayer(); // 创建图形图层

              // 创建路线1图层（通泰桥路线）
              const r1Points = new FeatureLayer({
                url: "https://danxiagis.top:6443/arcgis/rest/services/VirtualDanxia/route1/MapServer/0", // 图层服务URL
                outFields: ["*"], // 输出所有字段
                title: "通泰桥路线", // 图层标题
                visible: r1.value, // 根据r1状态控制是否可见
                labelingInfo: [labelClass], // 标注样式
                popupEnabled: false, // 禁用弹出窗口
              });

              // 创建路线2图层（长老峰路线）
              const r2Points = new FeatureLayer({
                url: "https://danxiagis.top:6443/arcgis/rest/services/VirtualDanxia/route2/MapServer/0",
                outFields: ["*"],
                title: "长老峰路线",
                visible: r2.value,
                labelingInfo: [labelClass],
                popupEnabled: false,
              });

              // 创建路线3图层（祥龙湖路线）
              const r3Points = new FeatureLayer({
                url: "https://danxiagis.top:6443/arcgis/rest/services/VirtualDanxia/route3/MapServer/0",
                outFields: ["*"],
                title: "祥龙湖路线",
                visible: r3.value,
                labelingInfo: [labelClass],
                popupEnabled: false,
              });

              // 添加路线图层到地图
              map.value.add(r1Points); // 添加路线1
              map.value.add(r2Points); // 添加路线2
              map.value.add(r3Points); // 添加路线3

              // 地图加载完成后加载路线点数据
              mapConfig.mapView.when(() => {
                // 获取路线1点列表
                axios({
                  method: "get",
                  url: "https://danxiagis.top:3005/getPointName/route1",
                })
                  .then((response) => {
                    if (response.data && Array.isArray(response.data)) {
                      const pointNameList = response.data;
                      // 提取点名称到数组
                      items0.value = pointNameList.map(point => point.name);
                    }
                  })
                  .catch(err => {
                    console.error("获取路线1点失败:", err);
                  });

                // 获取路线2点列表
                axios({
                  method: "get",
                  url: "https://danxiagis.top:3005/getPointName/route2",
                })
                  .then((response) => {
                    if (response.data && Array.isArray(response.data)) {
                      const pointNameList = response.data;
                      items1.value = pointNameList.map(point => point.name);
                    }
                  })
                  .catch(err => {
                    console.error("获取路线2点失败:", err);
                  });

                // 获取路线3点列表
                axios({
                  method: "get",
                  url: "https://danxiagis.top:3005/getPointName/route3",
                })
                  .then((response) => {
                    if (response.data && Array.isArray(response.data)) {
                      const pointNameList = response.data;
                      items2.value = pointNameList.map(point => point.name);
                    }
                  })
                  .catch(err => {
                    console.error("获取路线3点失败:", err);
                  });

                // 加载完成，隐藏进度条
                NProgress.done();
              });

              // 存储图层引用，便于后续操作
              baseLayers.value = {
                r1: r1Points, // 路线1图层
                r2: r2Points, // 路线2图层
                r3: r3Points, // 路线3图层
              };

              // 启用默认弹出窗口模板
              mapConfig.mapView.popup.defaultPopupTemplateEnabled = true;
            } catch (error) {
              // 处理地图初始化错误
              console.error("地图初始化过程中出错:", error);
              NProgress.done(); // 确保进度条关闭
            }
          }
        )
        .catch((err) => {
          // 处理模块加载错误
          console.error("地图创建失败，", err);
          NProgress.done(); // 确保进度条关闭
        });
    };

    /**
     * 导航到丹霞山
     * 将地图中心移动到丹霞山位置
     */
    const goDan = () => {
      current_mount.value = "danxia"; // 更新当前位置标记
      createMapView(danMount.value); // 重新创建地图，中心为丹霞山
    };

    /**
     * 导航到莽山
     * 将地图中心移动到莽山位置
     */
    const goMang = () => {
      current_mount.value = "mang"; // 更新当前位置标记
      createMapView(mangMount.value); // 重新创建地图，中心为莽山
    };

    /**
     * 导航到象鼻山
     * 将地图中心移动到象鼻山位置
     */
    const goXiang = () => {
      current_mount.value = "xiangbi"; // 更新当前位置标记
      createMapView(xiangMount.value); // 重新创建地图，中心为象鼻山
    };

    /**
     * 点闪烁效果
     * 创建点的闪烁动画效果以突出显示
     * @param {Object} graphic - 要闪烁的图形对象
     */
    const flicker = (graphic) => {
      // 检查图形对象是否有效
      if (!graphic) return;
      
      // 闪烁计数和间隔控制
      let temp = 0;
      let handler = setInterval(function () {
        // 完成6次闪烁后停止
        if (temp === 6) {
          if (handler) {
            // 确保最后是可见状态
            if (!graphic.visible)
              graphic.visible = true;
            // 清除定时器
            clearInterval(handler);
            handler = null;
          }
          return;
        }
        // 切换可见性以产生闪烁效果
        if (graphic.visible) graphic.visible = false;
        else graphic.visible = true;
        temp++;
      }, 400); // 每400毫秒切换一次
    };

    /**
     * 图片放大查看
     * 激活图片查看器并显示选中的图片
     * @param {Number} Item - 要查看的图片索引
     */
    const clickLocation = (Item) => {
      // 增加点击计数
      i.value = i.value + 1;
      // 如果不是第一次点击且查看器存在，则重新初始化
      if (i.value > 1 && viewer.value) {
        inited(viewer.value);
      }
      // 显示图片查看器
      viewer1.value = true;
      // 设置要显示的图片索引
      picModel.value = Item;
      // 如果查看器已初始化，跳转到指定图片
      if (viewer.value) {
        viewer.value.view(picModel.value);
      }
    };

    /**
     * 初始化图片预览组件
     * 存储查看器实例以便后续操作
     * @param {Object} viewerInstance - 图片查看器实例
     */
    const inited = (viewerInstance) => {
      viewer.value = viewerInstance;
    };

    /**
     * 视频播放事件处理
     * 视频开始播放时的回调
     * @param {Object} player - 播放器实例
     */
    const onPlayerPlay = (player) => {
      // 记录视频播放事件
      console.log("视频播放");
      // 这里可以添加其他播放相关逻辑
    };

    /**
     * 视频暂停事件处理
     * 视频暂停时的回调
     * @param {Object} player - 播放器实例
     */
    const onPlayerPause = (player) => {
      // 记录视频暂停事件
      console.log("视频暂停");
      // 这里可以添加其他暂停相关逻辑
    };

    /**
     * 列表点击处理
     * 处理用户点击路线点列表项的事件
     * @param {Event} event - 点击事件对象
     */
    const onListClickHandler = (event) => {
      // 获取点击的列表项文本内容
      const clickedText = event.target.closest('.v-list-item').title || 
                          event.target.closest('.v-list-item').querySelector('.v-list-item-title')?.textContent;
      
      // 如果无法获取文本，退出处理
      if (!clickedText) {
        console.error("无法获取点击的列表项文本");
        return;
      }
      
      // 重置点详情数据
      pointIntroduce.value = null;
      pointItems.value = [];
      srcvideo.value = "";
      // 展开右侧详情面板
      anmini.value = false;

      // 根据点名确定所属的路线和标题
      let featureLayer;
      let routeTitle;

      if (items0.value.includes(clickedText)) {
        // 点属于路线1（通泰桥路线）
        featureLayer = baseLayers.value.r1;
        routeTitle = "通泰桥路线";
      } else if (items1.value.includes(clickedText)) {
        // 点属于路线2（长老峰路线）
        featureLayer = baseLayers.value.r2;
        routeTitle = "长老峰路线";
      } else {
        // 点属于路线3（阴元石-祥龙湖路线）
        featureLayer = baseLayers.value.r3;
        routeTitle = "阴元石-祥龙湖路线";
      }

      // 如果找不到对应图层，退出处理
      if (!featureLayer) {
        console.error("找不到对应的图层");
        return;
      }

      // 创建查询对象，按名称查找点
      const query = featureLayer.createQuery();
      query.where = "name='" + clickedText + "'";

      // 执行要素查询
      mapConfig.mapView
        .whenLayerView(featureLayer) // 获取图层视图
        .then(function (layerView) {
          featureLayer.queryFeatures(query).then(function (response) {
            // 移除现有高亮和图形
            if (highlighSelect.value) {
              highlighSelect.value.remove();
              if (pointGraphicLayer.value && pointGraphic.value) {
                pointGraphicLayer.value.graphics.remove(pointGraphic.value);
              }
            }

            // 检查是否找到要素
            if (!response.features || response.features.length === 0) {
              console.error("未找到匹配的要素");
              return;
            }

            // 获取第一个匹配要素
            const feature = response.features[0];
            
            // 高亮显示要素
            highlighSelect.value = layerView.highlight(
              feature.attributes["objectid"]
            );
            
            // 将地图视图移动到要素位置
            mapConfig.mapView.goTo({
              target: feature.geometry,
            });

            // 设置点详情标题和ID
            pointTitle.value = routeTitle + "——" + feature.attributes.name;
            p_id.value = feature.attributes.objectid;
            desserts.value = [];

            // 提取要素属性并添加到表格数据
            const attributes = [
              { name: "岩石", calories: feature.attributes.rock },
              { name: "地质构造", calories: feature.attributes.tectonic },
              { name: "地貌", calories: feature.attributes.landscape },
              { name: "土壤", calories: feature.attributes.soil },
              { name: "植被", calories: feature.attributes.vegetation },
              { name: "坡度", calories: feature.attributes.slope }
            ];
            
            // 过滤掉未定义的属性
            desserts.value = attributes.filter(attr => attr.calories !== undefined);

            // 创建闪烁点符号样式
            const pointSymbol = {
              type: "simple-marker", // 简单标记符号
              style: "circle", // 圆形样式
              color: "red", // 红色填充
              size: "10px", // 大小
              outline: {
                color: [255, 255, 0], // 黄色轮廓
                width: 10, // 轮廓宽度
              },
            };
            
            // 设置点几何和符号
            pointGraphic.value.geometry = feature.geometry;
            pointGraphic.value.symbol = pointSymbol;
            // 添加到图形图层
            pointGraphicLayer.value.graphics.add(pointGraphic.value);
            map.value.add(pointGraphicLayer.value);
            // 启动闪烁效果
            flicker(pointGraphic.value);
            // 显示十字线
            horizontalLine.value = true;
            verticalLine.value = true;

            // 2.4秒后隐藏十字线和闪烁点
            setTimeout(() => {
              horizontalLine.value = false;
              verticalLine.value = false;
              map.value.remove(pointGraphicLayer.value);
            }, 2400);

            // 获取点的媒体和详情信息
            axios({
              method: "post",
              url: "https://danxiagis.top:3005/pointData/get",
              data: `pointId=${feature.attributes.objectid}`,
            }).then((response) => {
              if (response.data) {
                // 设置点介绍，如果没有则显示默认文本
                pointIntroduce.value = response.data.introduce || "暂无介绍";
                
                // 处理图片数据
                const imgUrls = response.data.Img || [];
                // 将图片URL转换为对象数组
                pointItems.value = imgUrls.map(url => ({ src: url }));

                // 设置视频播放器
                playerOptions.poster = "https://danxiagis.top:3007/image/banner1.jpg"; // 设置视频封面
                // 如果有视频资源，设置视频源
                if (response.data.Video && response.data.Video.length > 0) {
                  const video = response.data.Video;
                  playerOptions.sources = [{
                    type: "video/mp4", // 视频类型
                    src: video[0] // 视频URL
                  }];
                  srcvideo.value = video[0]; // 设置视频地址，触发视频播放器显示
                }
              }
            }).catch(err => {
              console.error("获取点数据失败:", err);
            });
          }).catch(err => {
            console.error("查询点要素失败:", err);
          });
        }).catch(err => {
          console.error("获取图层视图失败:", err);
        });
    };

    // === 生命周期钩子 ===

    /**
     * 组件挂载后
     * 在DOM加载完成后初始化地图
     */
    onMounted(() => {
      // 使用nextTick确保DOM已完全渲染
      nextTick(() => {
        // 创建地图视图，初始位置为丹霞山
        createMapView(danMount.value);
      });
    });

    // 返回模板可用的变量和方法
    return {
      // 状态变量
      isTeacher, // 教师身份标识
      r1, r2, r3, // 路线显示控制
      map, mapConfig, graphics, highlighSelect, // 地图相关对象
      pointTitle, desserts, selectedItem, // 点详情
      items0, items1, items2, // 路线点列表
      drawer, mini, andrawer, anmini, // 抽屉控制
      model, pointItems, viewer1, picModel, i, srcvideo, // 图片和视频相关
      playerOptions, // 视频播放器配置
      pointGraphic, pointGraphicLayer, // 闪烁点相关
      horizontalLine, verticalLine, pointIntroduce, // 界面交互元素
      type, selectedMapType, p_id, // 地图配置
      mangMount, xiangMount, danMount, // 预设位置坐标
      baseLayers, current_mount, lat, long, // 图层和位置状态
      
      // 方法
      edit_info, // 编辑点信息
      changeMapType, // 切换底图类型
      createMapView, // 创建地图视图
      goDan, // 导航到丹霞山
      goMang, // 导航到莽山
      goXiang, // 导航到象鼻山
      flicker, // 点闪烁效果
      clickLocation, // 图片放大查看
      inited, // 初始化图片预览组件
      onPlayerPlay, // 视频播放事件处理
      onPlayerPause, // 视频暂停事件处理
      onListClickHandler, // 列表点击处理
    };
  }
};
</script>

<style scoped>
/* === 主容器样式 === */
/* 主容器 - 占满整个视口并控制溢出，作为整个路线探索界面的根容器 */
.route-container {
  width: 100vw;          /* 宽度为视口宽度，确保铺满整个屏幕 */
  height: 100vh;         /* 高度为视口高度，确保铺满整个屏幕 */
  position: relative;    /* 相对定位，作为子元素的定位参考 */
  overflow: hidden;      /* 隐藏溢出内容，防止出现滚动条 */
  display: flex;         /* 使用弹性布局，便于垂直方向排列 */
  flex-direction: column; /* 列方向排列，从上到下布局 */
}

/* === 布局样式 === */
/* 主布局 - 包含左侧抽屉、地图和右侧详情面板的flex容器 */
.route-layout {
  display: flex;         /* 使用弹性布局，实现三栏布局 */
  flex-direction: row;   /* 行方向排列，从左到右 */
  height: 100%;          /* 占满父容器高度，确保内容充满整个高度 */
  width: 100%;           /* 占满父容器宽度，确保内容充满整个宽度 */
  position: relative;    /* 相对定位，为子元素提供定位上下文 */
}

/* === 抽屉样式 === */
/* 左侧路线抽屉样式 - 用于显示路线列表，可收缩 */
.route-drawer {
  position: relative !important; /* 覆盖Vuetify默认样式的定位方式，确保位置可控 */
  height: 100% !important;       /* 强制高度100%，让抽屉占满父容器高度 */
  z-index: 5;                    /* 层级设置，确保在地图上方，但不覆盖其他UI元素 */
}

/* 右侧详情抽屉样式 - 用于显示点详情，可收缩 */
.detail-drawer {
  position: relative !important; /* 覆盖Vuetify默认样式的定位方式 */
  height: 100% !important;       /* 强制高度100%，让抽屉占满父容器高度 */
  z-index: 5;                    /* 层级设置，确保在地图上方 */
}

/* === 地图容器样式 === */
/* 地图包装容器 - 中间弹性布局区域，包含地图和控制元素 */
.map-wrapper {
  flex: 1;               /* 占用剩余空间，确保地图区域自适应大小 */
  position: relative;    /* 相对定位，为地图和控制元素提供定位上下文 */
  height: 100%;          /* 占满父容器高度，确保地图充满整个区域 */
  overflow: hidden;      /* 隐藏溢出内容，防止地图边缘出现滚动条 */
}

/* 地图容器 - ArcGIS地图渲染区域，负责显示地图内容 */
.map-container {
  height: 100%;          /* 占满父容器高度，确保地图充满整个区域 */
  width: 100%;           /* 占满父容器宽度，确保地图充满整个区域 */
  position: relative;    /* 相对定位，用于定位坐标卡片和控制面板等子元素 */
}

/* === 坐标信息样式 === */
/* 坐标信息卡片容器 - 显示点击坐标的位置，固定在地图左下角 */
.coordinate-card-container {
  position: absolute;    /* 绝对定位，相对于地图容器定位 */
  bottom: 20px;          /* 距底部20px，确保有适当间距 */
  left: 20px;            /* 距左侧20px，确保有适当间距 */
  z-index: 10;           /* 层级设置，确保在地图上方，可被用户看到 */
}

/* 坐标信息卡片样式 - 美化坐标显示区域 */
.coordinate-card {
  background-color: rgba(255, 255, 255, 0.9) !important; /* 半透明白色背景，保证文字清晰 */
  max-width: 350px;      /* 最大宽度限制，避免在大屏幕上过宽 */
}

/* === 底图控制样式 === */
/* 底图控制面板容器 - 控制地图类型和导航，固定在地图右上角 */
.basemap-control-container {
  position: absolute;    /* 绝对定位，相对于地图容器定位 */
  top: 20px;             /* 距顶部20px，确保有适当间距 */
  right: 20px;           /* 距右侧20px，确保有适当间距 */
  z-index: 10;           /* 层级设置，确保在地图上方，可被用户操作 */
}

/* 控制面板卡片样式 - 底图和位置控制的容器 */
.control-panel {
  background-color: rgba(255, 255, 255, 0.9) !important; /* 半透明白色背景，保证控件清晰 */
  width: 280px;          /* 固定宽度，使控制面板大小合适 */
}

/* 位置按钮组容器 - 用于快速导航到不同位置的按钮布局 */
.location-buttons {
  display: flex;         /* 使用弹性布局，让按钮可以灵活排列 */
  flex-wrap: wrap;       /* 允许按钮换行，适应窄屏幕 */
  gap: 8px;              /* 按钮间距，提供合适的间隔 */
  margin-top: 12px;      /* 上边距，与上方的单选按钮组分隔 */
}

/* 位置按钮样式 - 单个导航按钮的外观 */
.location-btn {
  flex: 1 1 30%;         /* 弹性布局，基础大小30%，允许伸缩但保持比例 */
  min-width: 80px;       /* 最小宽度，确保按钮不会太窄 */
  margin-bottom: 8px;    /* 下边距，提供垂直方向的间隔 */
}

/* 详情切换按钮 - 控制右侧详情面板的显示隐藏，位于右侧中间 */
.detail-toggle-btn {
  position: absolute;    /* 绝对定位，相对于地图包装容器 */
  top: 50%;              /* 垂直居中，位于中间高度 */
  right: 0;              /* 靠右对齐，紧贴右边缘 */
  transform: translateY(-50%); /* 垂直居中偏移，确保按钮完全居中 */
  z-index: 10;           /* 层级设置，确保在地图上方，可被用户操作 */
}

/* === 十字线样式 === */
/* 十字线指示器基础样式 - 用于突出显示选中点的交叉线 */
.crosshair-line {
  position: absolute;    /* 绝对定位，相对于地图容器 */
  z-index: 5;            /* 层级适中，在地图上方但不覆盖其他控件 */
}

/* 水平十字线样式 - 横向指示线，有间断效果 */
.crosshair-line.horizontal {
  height: 2px;           /* 线条高度，细线 */
  width: 100%;           /* 占满容器宽度，横跨整个地图 */
  top: 50%;              /* 垂直居中，位于中间高度 */
  background: linear-gradient(
    to right,
    #4caf50,             /* 绿色起点 */
    #4caf50 7.5px,       /* 实线部分长度 */
    transparent 7.5px,   /* 透明部分起点 */
    transparent          /* 透明部分终点 */
  );
  background-size: 15px 100%; /* 背景大小，控制虚线效果的重复周期 */
}

/* 垂直十字线样式 - 纵向指示线，有间断效果 */
.crosshair-line.vertical {
  width: 2px;            /* 线条宽度，细线 */
  height: 100%;          /* 占满容器高度，纵跨整个地图 */
  left: 50%;             /* 水平居中，位于中间位置 */
  background: linear-gradient(
    to bottom,
    #4caf50,             /* 绿色起点 */
    #4caf50 7.5px,       /* 实线部分长度 */
    transparent 7.5px,   /* 透明部分起点 */
    transparent          /* 透明部分终点 */
  );
  background-size: 100% 15px; /* 背景大小，控制虚线效果的重复周期 */
}

/* === 详情面板样式 === */
/* 详情卡片样式 - 右侧详情面板的主体内容 */
.detail-card {
  height: 100%;          /* 占满父容器高度，确保卡片充满抽屉 */
  display: flex;         /* 使用弹性布局，便于组织标题和内容 */
  flex-direction: column; /* 列方向排列，标题在上，内容在下 */
}

/* 详情内容区域样式 - 包含介绍、属性、图片和视频的滚动区域 */
.detail-content {
  flex: 1;               /* 占用剩余空间，确保内容区域自适应高度 */
  padding: 12px;         /* 内边距，提供内容与边缘的间距 */
  overflow-y: auto;      /* 垂直方向可滚动，当内容超出高度时显示滚动条 */
  max-height: calc(100vh - 64px); /* 最大高度，减去标题高度，避免内容溢出 */
}

/* 路线列表样式 - 左侧路线点列表的滚动区域 */
.route-list {
  overflow-y: auto;      /* 垂直方向可滚动，当点列表过多时显示滚动条 */
  max-height: calc(100vh - 64px); /* 最大高度，减去标题高度，避免列表溢出 */
}

/* 位置项样式 - 路线点列表项的交互效果 */
.location-item {
  transition: background-color 0.2s; /* 背景色过渡效果，提供平滑的视觉反馈 */
  cursor: pointer;       /* 鼠标指针样式为手型，提示可点击 */
}

/* 位置项悬停效果 - 鼠标悬停在列表项上时的样式变化 */
.location-item:hover {
  background-color: rgba(0, 0, 0, 0.05); /* 悬停时轻微灰色背景，提供视觉反馈 */
}

/* 视频播放器样式 - 美化视频播放器外观 */
.video-player {
  width: 100%;           /* 占满容器宽度，确保视频播放器充满区域 */
  border-radius: 4px;    /* 圆角，与整体UI风格一致 */
  overflow: hidden;      /* 隐藏溢出内容，确保视频不超出边界 */
}

/* === 响应式布局 === */

/* 大屏幕设备 - 宽度不超过1200px的屏幕适配 */
@media (max-width: 1200px) {
  .control-panel {
    width: 250px;        /* 控制面板宽度减小，适应较窄的屏幕 */
  }
  
  .coordinate-card {
    max-width: 300px;    /* 坐标卡片最大宽度减小，避免占用太多空间 */
  }
}

/* 中等屏幕设备 - 宽度不超过960px的屏幕适配 */
@media (max-width: 960px) {
  .control-panel {
    width: 220px;        /* 控制面板宽度进一步减小，适应中等屏幕 */
  }
  
  .coordinate-card {
    max-width: 260px;    /* 坐标卡片最大宽度进一步减小，保持比例 */
  }
  
  .route-drawer, .detail-drawer {
    width: 240px !important; /* 抽屉宽度减小，为地图留出更多空间 */
  }
}

/* 平板设备 - 宽度不超过768px的屏幕适配 */
@media (max-width: 768px) {
  .coordinate-card-container {
    bottom: 60px;        /* 坐标卡片位置上移，避免被其他控件覆盖 */
  }
  
  .basemap-control-container {
    width: calc(100% - 40px); /* 底图控制面板宽度调整，几乎占满屏幕宽度 */
    top: auto;           /* 取消顶部定位，改为底部定位 */
    bottom: 10px;        /* 底部定位，放置在屏幕底部 */
    right: 20px;         /* 右侧距离保持不变 */
  }
  
  .control-panel {
    width: 100%;         /* 控制面板占满容器宽度，适应窄屏 */
  }
  
  .location-buttons {
    justify-content: space-between; /* 位置按钮间距均匀分布，优化按钮排布 */
  }
  
  .route-drawer, .detail-drawer {
    width: 280px !important; /* 抽屉宽度调整，确保内容可见 */
  }
}

/* 移动设备 - 宽度不超过600px的屏幕适配 */
@media (max-width: 600px) {
  .route-layout {
    flex-direction: column; /* 改为列方向排列，抽屉在上，地图在下 */
  }
  
  .route-drawer, .detail-drawer {
    height: auto !important; /* 抽屉高度自适应，根据内容决定高度 */
    width: 100% !important;  /* 抽屉宽度占满，横向铺满整个屏幕 */
  }
  
  .map-wrapper {
    flex: 1;             /* 占用剩余空间，确保地图区域自适应 */
    order: 2;            /* 排序顺序，放到第二位，在抽屉下方显示 */
    height: calc(100vh - 56px); /* 高度计算，减去头部高度，防止溢出 */
  }
  
  .coordinate-card-container {
    bottom: 70px;        /* 坐标卡片位置上移，避免被底部控件覆盖 */
    left: 10px;          /* 左侧距离减小，增加与屏幕边缘的贴合度 */
    max-width: calc(100% - 20px); /* 最大宽度调整，适应窄屏 */
  }
  
  .coordinate-card {
    max-width: 100%;     /* 坐标卡片占满容器宽度，确保文本不被截断 */
  }
  
  .basemap-control-container {
    top: 10px;           /* 恢复顶部定位，避免与其他控件冲突 */
    bottom: auto;        /* 取消底部定位 */
  }
  
  .detail-toggle-btn {
    display: none;       /* 隐藏详情切换按钮，在移动设备上使用其他方式导航 */
  }
}
</style>