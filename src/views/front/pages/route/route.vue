<template>
  <div class="route-container">
    <v-row no-gutters class="fill-height">
      <!-- 点列表 -->
      <v-col cols="auto" class="h-100">
        <v-navigation-drawer
          v-model="drawer"
          v-model:mini-variant="mini"
          permanent
          class="elevation-3 h-100"
          :rail-width="56"
        >
          <v-list-item class="px-2">
            <v-list-item-title class="text-h6">实习点</v-list-item-title>

            <v-btn icon @click.stop="mini = !mini">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
          </v-list-item>

          <v-divider></v-divider>

          <v-list dense nav class="drawer-content py-0">
            <v-list-group no-action>
              <template #activator="{ props }">
                <v-list-item v-bind="props" prepend-icon="mdi-map-marker-path">
                  <v-list-item-title>阳元山-通泰桥路线</v-list-item-title>
                </v-list-item>
              </template>

              <v-list-item
                v-for="(item, i) in items0"
                :key="i"
                link
                @click="onListClickHandler"
                class="location-item"
              >
                <template #prepend>
                  <v-icon size="small">mdi-map-marker</v-icon>
                </template>
                <v-list-item-title v-text="item"></v-list-item-title>
              </v-list-item>
            </v-list-group>
            
            <v-list-group no-action>
              <template #activator="{ props }">
                <v-list-item v-bind="props" prepend-icon="mdi-map-marker-path">
                  <v-list-item-title>锦石岩-长老峰路线</v-list-item-title>
                </v-list-item>
              </template>

              <v-list-item
                v-for="(item, i) in items1"
                :key="i"
                link
                @click="onListClickHandler"
                class="location-item"
              >
                <template #prepend>
                  <v-icon size="small">mdi-map-marker</v-icon>
                </template>
                <v-list-item-title v-text="item"></v-list-item-title>
              </v-list-item>
            </v-list-group>
            
            <v-list-group no-action>
              <template #activator="{ props }">
                <v-list-item v-bind="props" prepend-icon="mdi-map-marker-path">
                  <v-list-item-title>阴元石-祥龙湖路线</v-list-item-title>
                </v-list-item>
              </template>

              <v-list-item
                v-for="(item, i) in items2"
                :key="i"
                link
                @click="onListClickHandler"
                class="location-item"
              >
                <template #prepend>
                  <v-icon size="small">mdi-map-marker</v-icon>
                </template>
                <v-list-item-title v-text="item"></v-list-item-title>
              </v-list-item>
            </v-list-group>
          </v-list>
        </v-navigation-drawer>
      </v-col>

      <!-- 地图容器 - 占据中间主要空间 -->
      <v-col class="pa-0 h-100 position-relative">
        <div id="route1" class="map-container">
          <!-- 坐标信息卡片 -->
          <div class="esri-ui-bottom-left esri-ui-corner">
            <v-card elevation="3" class="coordinate-card">
              <v-card-title class="py-2 text-body-1">
                点击处坐标：<span class="font-weight-medium">{{ long }}, {{ lat }}</span> (WKID: 4326)
              </v-card-title>
            </v-card>
          </div>
          
          <!-- 底图切换控制面板 -->
          <div class="esri-ui-top-right esri-ui-corner">
            <v-card min-width="250px" class="control-panel" elevation="3">
              <v-card-title class="py-2 text-h6">
                <v-icon class="mr-2">mdi-layers</v-icon>底图控制
              </v-card-title>
              
              <v-card-text class="pt-0">
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
                
                <div class="d-flex flex-wrap justify-space-between mt-2">
                  <v-btn
                    prepend-icon="mdi-map-marker"
                    variant="outlined"
                    class="location-btn mb-2"
                    color="primary"
                    @click="goDan"
                  >
                    丹霞山
                  </v-btn>
                  
                  <v-btn
                    prepend-icon="mdi-map-marker"
                    variant="outlined"
                    class="location-btn mb-2"
                    color="success"
                    @click="goMang"
                  >
                    莽山
                  </v-btn>
                  
                  <v-btn
                    prepend-icon="mdi-map-marker"
                    variant="outlined"
                    class="location-btn mb-2"
                    color="info"
                    @click="goXiang"
                  >
                    象鼻山
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </div>
          
          <!-- 十字线指示器 -->
          <div
            id="horizontalLine"
            class="esri-ui-inner-container"
            v-show="horizontalLine"
          ></div>
          <div
            id="verticalLine"
            class="esri-ui-inner-container"
            v-show="verticalLine"
          ></div>
        </div>
        
        <!-- 点详情控制按钮 - 放在地图上 -->
        <v-btn
          @click.stop="anmini = !anmini"
          icon="mdi-chevron-right"
          color="primary"
          class="detail-toggle-btn"
          elevation="3"
          size="small"
        ></v-btn>
      </v-col>

      <!-- 点详情面板 -->
      <v-col cols="auto" class="h-100">
        <v-navigation-drawer
          v-model="andrawer"
          v-model:mini-variant="anmini"
          permanent
          location="right"
          width="360"
          mini-variant-width="0"
          class="elevation-3 h-100"
        >
          <v-card flat class="h-100">
            <v-card-title class="d-flex align-center py-3 px-4">
              <v-icon color="primary" class="mr-2">mdi-information-outline</v-icon>
              <div v-if="!isTeacher" class="text-h6 text-center flex-grow-1">
                {{ pointTitle }}
              </div>
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
            
            <div class="drawer-content pa-2">
              <!-- 点介绍和属性信息 -->
              <v-expansion-panels variant="accordion">
                <v-expansion-panel expanded>
                  <v-expansion-panel-title>
                    简介与基本信息
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <div class="py-2">
                      <div class="text-subtitle-1 font-weight-bold mb-2">简介</div>
                      <div v-if="!isTeacher" class="text-body-2">{{ pointIntroduce }}</div>
                      <v-textarea
                        v-if="isTeacher"
                        @change="edit_info"
                        v-model="pointIntroduce"
                        rows="4"
                        variant="outlined"
                        hide-details
                      ></v-textarea>
                    </div>
                    
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
              
              <!-- 图片轮播 -->
              <v-card flat class="mt-3">
                <v-card-subtitle class="pb-0 pt-2">
                  <v-icon size="small" class="mr-1">mdi-image-multiple</v-icon>
                  图片资料
                </v-card-subtitle>
                <v-slide-group
                  v-model="model"
                  class="pa-2"
                  center-active
                  show-arrows
                >
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
                        v-lazy="item.src"
                        height="100"
                        cover
                        class="rounded"
                      ></v-img>
                    </v-card>
                  </v-slide-group-item>
                </v-slide-group>
              </v-card>
              
              <!-- 视频播放器 -->
              <v-card flat class="mt-3" v-if="srcvideo">
                <v-card-subtitle class="pb-0 pt-2">
                  <v-icon size="small" class="mr-1">mdi-video</v-icon>
                  视频资料
                </v-card-subtitle>
                <div class="pa-2">
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
      </v-col>
    </v-row>
    
    <!-- 图片放大查看器 -->
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
import { loadModules } from "esri-loader";
import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { ref, reactive, onMounted, nextTick } from 'vue';
import { VideoPlayer } from 'vue-video-player';

export default {
  name: "Home",
  components: {
    'video-player': VideoPlayer
  },
  setup() {
    const isTeacher = ref(sessionStorage.getItem("isteacher") == "true" ? true : false);
    // 路线复选框
    const r1 = ref(true);
    const r2 = ref(true);
    const r3 = ref(true);
    const map = ref("");
    const mapConfig = reactive({
      container: "route1",
      mapView: null,
    });
    const graphics = ref("");
    const highlighSelect = ref("");
    const pointTitle = ref("");
    const desserts = ref([]); //存储表格内容
    const selectedItem = ref(0);
    const items0 = ref([]); //存储通泰桥路线（r1）点列表
    const items1 = ref([]); //存储长老峰路线（r2）点列表
    const items2 = ref([]); //存储阴元石路线（r3）点列表
    const drawer = ref(true);
    const mini = ref(false); //控制点列表是否伸出
    const andrawer = ref(true);
    const anmini = ref(true); //控制点详情是否伸出
    const model = ref(null);
    const pointItems = ref([]); //存储相应点的图片
    const viewer1 = ref(false); //图片大图查看
    const picModel = ref(0); //控制放大的图片显示的是第几张
    const i = ref(0); //监控这是第几次开始点击图片查看大图
    const srcvideo = ref(""); //视频地址
    const viewer = ref(null);
    //控制视频的相关详情
    const playerOptions = reactive({
      // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
      autoplay: false, // 如果true,浏览器准备好时开始回放。
      muted: false, // 默认情况下将会消除任何音频。
      loop: false, // 导致视频一结束就重新开始。
      preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
      language: "zh-CN",
      aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
      fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
      sources: [], //存储视频url以及视频类型
      hls: true,
      poster: "", // 你的封面地址
      width: document.documentElement.clientWidth, // 播放器宽度
      notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
      controlBar: {
        timeDivider: false,
        durationDisplay: true,
        remainingTimeDisplay: false,
        fullscreenToggle: true, // 全屏按钮
      },
    });
    //控制点闪烁的graphic
    const pointGraphic = ref("");
    const pointGraphicLayer = ref(""); //闪烁点的graphicLayer图层
    const horizontalLine = ref(false); //控制水平虚线是否可见
    const verticalLine = ref(false); //控制垂直虚线是否可见
    const pointIntroduce = ref(null); //点简介
    const type = ref("img");
    const selectedMapType = ref("1");
    const p_id = ref("");
    const mangMount = ref([112.977, 25.02841]);
    const xiangMount = ref([110.295494, 25.266705]);
    const danMount = ref([113.754555, 25.026711]);
    const baseLayers = ref(null);
    const current_mount = ref("danxia");
    const lat = ref("");
    const long = ref("");

    const edit_info = () => {
      axios({
        url: "https://danxiagis.top:8081/pointData/update",
        method: "post",
        params: {
          pointId: p_id.value,
          introduce: pointIntroduce.value,
          point_name: pointTitle.value,
        },
      }).then((res) => {
        console.log("respp", res);
        axios({
          url: "https://danxiagis.top:8081/pointData/get",
          method: "post",
          params: {
            pointId: p_id.value,
          },
        }).then((res) => {
          pointIntroduce.value = res.data.introduce;
          pointTitle.value = res.data.point_name;
        });
      });
    };

    const changeMapType = () => {
      if (selectedMapType.value === "1") type.value = "img";
      else if (selectedMapType.value === "2") type.value = "vec";
      if (current_mount.value == "danxia") createMapView(danMount.value);
      else if (current_mount.value == "mang")
        createMapView(mangMount.value);
      else if (current_mount.value == "xiangbi")
        createMapView(xiangMount.value);
    };

    const createMapView = (center) => {
      NProgress.start();
      const _self = {
        map: map,
        mapConfig: mapConfig,
        type: type,
        baseLayers: baseLayers,
        pointGraphic: pointGraphic,
        pointGraphicLayer: pointGraphicLayer,
        items0: items0,
        items1: items1,
        items2: items2,
        lat: lat,
        long: long
      }; // Define _self with reactive variables

      const option = {
        //定义一个包含有JS API中js开发包和css样式文件的对象
        url: "https://js.arcgis.com/4.19/init.js",
        css: "https://js.arcgis.com/4.19/esri/themes/light/main.css",
      };
      
      //通过loadModules来做衔接
      loadModules(
        [
          "esri/Map",
          "esri/views/MapView",
          "esri/layers/FeatureLayer",
          "esri/Graphic",
          "esri/layers/GraphicsLayer",
          "esri/layers/WebTileLayer",
          "esri/layers/support/TileInfo",
          "esri/geometry/SpatialReference",
          "esri/Basemap",
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
            //业务代码在此处编写
            const spatialReference = SpatialReference.WGS84;

            const tileInfo = new TileInfo({
              dpi: 90.71428571427429,
              lods: [
                {
                  level: 0,
                  levelValue: "1",
                  scale: 295828763.79585470937713011037,
                  resolution: 0.703125,
                },
                {
                  level: 1,
                  levelValue: "2",
                  scale: 147914381.89792735468856505518,
                  resolution: 0.3515625,
                },
                {
                  level: 2,
                  levelValue: "3",
                  scale: 73957190.948963677344282527592,
                  resolution: 0.17578125,
                },
                {
                  level: 3,
                  levelValue: "4",
                  scale: 36978595.474481838672141263796,
                  resolution: 0.087890625,
                },
                {
                  level: 4,
                  levelValue: "5",
                  scale: 18489297.737240919336070631898,
                  resolution: 0.0439453125,
                },
                {
                  level: 5,
                  levelValue: "6",
                  scale: 9244648.868620459668035315949,
                  resolution: 0.02197265625,
                },
                {
                  level: 6,
                  levelValue: "7",
                  scale: 4622324.4343102298340176579745,
                  resolution: 0.010986328125,
                },
                {
                  level: 7,
                  levelValue: "8",
                  scale: 2311162.2171551149170088289872,
                  resolution: 0.0054931640625,
                },
                {
                  level: 8,
                  levelValue: "9",
                  scale: 1155581.1085775574585044144937,
                  resolution: 0.00274658203125,
                },
                {
                  level: 9,
                  levelValue: "10",
                  scale: 577790.55428877872925220724681,
                  resolution: 0.001373291015625,
                },
                {
                  level: 10,
                  levelValue: "11",
                  scale: 288895.2771443893646261036234,
                  resolution: 0.0006866455078125,
                },
                {
                  level: 11,
                  levelValue: "12",
                  scale: 144447.63857219468231305181171,
                  resolution: 0.00034332275390625,
                },
                {
                  level: 12,
                  levelValue: "13",
                  scale: 72223.819286097341156525905853,
                  resolution: 0.000171661376953125,
                },
                {
                  level: 13,
                  levelValue: "14",
                  scale: 36111.909643048670578262952926,
                  resolution: 0.0000858306884765625,
                },
                {
                  level: 14,
                  levelValue: "15",
                  scale: 18055.954821524335289131476463,
                  resolution: 0.00004291534423828125,
                },
                {
                  level: 15,
                  levelValue: "16",
                  scale: 9027.977410762167644565738231,
                  resolution: 0.000021457672119140625,
                },
                {
                  level: 16,
                  levelValue: "17",
                  scale: 4513.9887053810838222828691158,
                  resolution: 0.0000107288360595703125,
                },
                {
                  level: 17,
                  levelValue: "18",
                  scale: 2256.9943526905419111414345579,
                  resolution: 0.00000536441802978515625,
                },
                {
                  level: 18,
                  levelValue: "19",
                  scale: 1128.4971763452709555707172788,
                  resolution: 0.000002682209014892578125,
                },
              ],
              size: [256, 256],
              origin: {
                x: -180,
                y: 90,
              },
              spatialReference,
            });

            const webTileLayer = new WebTileLayer({
              urlTemplate:
                "http://{subDomain}.tianditu.gov.cn/" +
                _self.type.value +
                "_c/esri/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=" +
                _self.type.value +
                "&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=94a9c789edc5d02e50a129a2276d3ab7",
              subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
              tileInfo,
              spatialReference,
            });
            const basemap = new Basemap({
              baseLayers: [webTileLayer],
            });
            _self.map.value = new Map({
              basemap,
              ground: "world-elevation",
            });

            //点击获取经纬度
            _self.mapConfig.mapView = new MapView({
              map: _self.map.value,
              zoom: 14,
              center: center,
              container: _self.mapConfig.container,
              constraints: {
                minZoom: 11,
              },
            });

            // Map view click to get coordinates
            _self.mapConfig.mapView.on("click", (event) => {
              const point = _self.mapConfig.mapView.toMap({
                x: event.x,
                y: event.y,
              });
              // Update coordinates display
              if (event.mapPoint) {
                _self.lat.value = event.mapPoint.latitude.toFixed(6);
                _self.long.value = event.mapPoint.longitude.toFixed(6);
              }
            });

            // Create feature layers for each route
            //创建点注记样式
            const labelClass = {
              symbol: {
                type: "text",
                color: "black",
                font: {
                  family: "Playfair Display",
                  size: 12,
                  weight: "bold",
                },
              },
              labelPlacement: "above-center",
              labelExpressionInfo: {
                expression: "$feature.name",
              },
            };

            //初始化点闪烁的graphic以及相应的图层
            _self.pointGraphic.value = new Graphic();
            _self.pointGraphicLayer.value = new GraphicsLayer();

            // Create and add feature layers for routes
            // Route 1 layer
            const r1Points = new FeatureLayer({
              url: "https://danxiagis.top:6443/arcgis/rest/services/VirtualDanxia/route1/MapServer/0",
              outFields: ["*"],
              title: "通泰桥路线",
              visible: r1.value,
              labelingInfo: [labelClass],
              popupEnabled: false,
            });

            // Route 2 layer
            const r2Points = new FeatureLayer({
              url: "https://danxiagis.top:6443/arcgis/rest/services/VirtualDanxia/route2/MapServer/0",
              outFields: ["*"],
              title: "长老峰路线",
              visible: r2.value,
              labelingInfo: [labelClass],
              popupEnabled: false,
            });

            // Route 3 layer
            const r3Points = new FeatureLayer({
              url: "https://danxiagis.top:6443/arcgis/rest/services/VirtualDanxia/route3/MapServer/0",
              outFields: ["*"],
              title: "祥龙湖路线",
              visible: r3.value,
              labelingInfo: [labelClass],
              popupEnabled: false,
            });

            _self.map.value.add(r1Points);
            _self.map.value.add(r2Points);
            _self.map.value.add(r3Points);

            // Load route points
            _self.mapConfig.mapView.when(() => {
              // Fetch points for route 1
              axios({
                method: "get",
                url: "https://danxiagis.top:3005/getPointName/route1",
              }).then((response) => {
                const pointNameList = response.data;
                for (let i = 0; i < pointNameList.length; i++) {
                  _self.items0.value.push(pointNameList[i].name);
                }
              });

              // Fetch points for route 2
              axios({
                method: "get",
                url: "https://danxiagis.top:3005/getPointName/route2",
              }).then((response) => {
                const pointNameList = response.data;
                for (let i = 0; i < pointNameList.length; i++) {
                  _self.items1.value.push(pointNameList[i].name);
                }
              });

              // Fetch points for route 3
              axios({
                method: "get",
                url: "https://danxiagis.top:3005/getPointName/route3",
              }).then((response) => {
                const pointNameList = response.data;
                for (let i = 0; i < pointNameList.length; i++) {
                  _self.items2.value.push(pointNameList[i].name);
                }
              });

              NProgress.done();
            });

            // Add feature layers to map
            _self.baseLayers.value = {
              r1: r1Points,
              r2: r2Points,
              r3: r3Points,
            };

            // Set up popup events
            _self.mapConfig.mapView.popup.defaultPopupTemplateEnabled = true;
          }
        )
        .catch((err) => {
          console.log(err);
          NProgress.done();
        });
    };

    // Navigation methods
    const goDan = () => {
      current_mount.value = "danxia";
      createMapView(danMount.value);
    };

    const goMang = () => {
      current_mount.value = "mang";
      createMapView(mangMount.value);
    };

    const goXiang = () => {
      current_mount.value = "xiangbi";
      createMapView(xiangMount.value);
    };

    //点闪烁
    const flicker = (graphic) => {
      let temp = 0;
      let handler = setInterval(function () {
        if (temp === 6) {
          if (handler) {
            if (!graphic.visible)
              graphic.visible = true;
            clearInterval(handler);
            handler = null;
          }
          return;
        }
        if (graphic.visible) graphic.visible = false;
        else graphic.visible = true;
        temp++;
      }, 400);
    };

    //图片放大
    const clickLocation = (Item) => {
      i.value = i.value + 1;
      if (i.value > 1) {
        inited(viewer.value);
      }
      viewer1.value = true;
      picModel.value = Item;
      viewer.value.view(picModel.value);
    };

    //初始化预览组件
    const inited = (viewerInstance) => {
      viewer.value = viewerInstance;
    };

    // 视频播放暂停事件
    const onPlayerPlay = (player) => {
      // Handle video play event if needed
    };

    const onPlayerPause = (player) => {
      // Handle video pause event if needed
    };

    // 用于列表点击的处理
    const onListClickHandler = (event) => {
      const target = event.target;
      pointIntroduce.value = null;
      //清空图片列表
      pointItems.value = [];
      //视频容器不可见
      srcvideo.value = "";

      //展开点详情表
      anmini.value = false;

      // Determine which route the point belongs to
      let featureLayer;
      let routeTitle;

      // Check if point belongs to route 1
      if (items0.value.includes(target.innerHTML)) {
        featureLayer = baseLayers.value.r1;
        routeTitle = "通泰桥路线";
      }
      // Check if point belongs to route 2
      else if (items1.value.includes(target.innerHTML)) {
        featureLayer = baseLayers.value.r2;
        routeTitle = "长老峰路线";
      }
      // Otherwise it belongs to route 3
      else {
        featureLayer = baseLayers.value.r3;
        routeTitle = "阴元石-祥龙湖路线";
      }

      // Create query
      const query = featureLayer.createQuery();
      query.where = "name='" + target.innerHTML + "'";

      // Execute query
      mapConfig.mapView
        .whenLayerView(featureLayer)
        .then(function (layerView) {
          featureLayer.queryFeatures(query).then(function (response) {
            if (highlighSelect.value) {
              highlighSelect.value.remove();
              pointGraphicLayer.value.graphics.remove(pointGraphic.value);
            }

            // Highlight point and move map view
            const feature = response.features[0];
            highlighSelect.value = layerView.highlight(
              feature.attributes["objectid"]
            );
            mapConfig.mapView.goTo({
              target: feature.geometry,
            });

            // Fill in point details
            pointTitle.value = routeTitle + "——" + feature.attributes.name;
            p_id.value = feature.attributes.objectid;
            desserts.value = [];

            // Add point attributes to table
            const rock = { name: "岩石", calories: feature.attributes.rock };
            const tectonic = {
              name: "地质构造",
              calories: feature.attributes.tectonic,
            };
            const landscape = {
              name: "地貌",
              calories: feature.attributes.landscape,
            };
            const soil = { name: "土壤", calories: feature.attributes.soil };
            const vegetation = {
              name: "植被",
              calories: feature.attributes.vegetation,
            };
            const slope = { name: "坡度", calories: feature.attributes.slope };
            desserts.value.push(
              rock,
              tectonic,
              landscape,
              soil,
              vegetation,
              slope
            );

            // Create flashing point graphic
            const pointSymbol = {
              type: "simple-marker",
              style: "circle",
              color: "red",
              size: "10px",
              outline: {
                color: [255, 255, 0],
                width: 10,
              },
            };
            pointGraphic.value.geometry = feature.geometry;
            pointGraphic.value.symbol = pointSymbol;
            pointGraphicLayer.value.graphics.add(pointGraphic.value);
            map.value.add(pointGraphicLayer.value);
            flicker(pointGraphic.value);
            horizontalLine.value = "true";
            verticalLine.value = "true";

            // Control crosshair appearance
            setTimeout(() => {
              horizontalLine.value = false;
              verticalLine.value = false;
              map.value.remove(pointGraphicLayer.value);
            }, 2400);

            // Fetch point media and details
            axios({
              method: "post",
              url: "https://danxiagis.top:3005/pointData/get",
              data: `pointId=${feature.attributes.objectid}`,
            }).then((response) => {
              pointIntroduce.value = response.data.introduce;
              
              // Add images to slideshow
              const imgUrls = response.data.Img;
              for (let i = 0; i < imgUrls.length; i++) {
                const imgUrl = { src: imgUrls[i] };
                pointItems.value.push(imgUrl);
              }

              // Set up video player if video exists
              playerOptions.poster = "https://danxiagis.top:3007/image/banner1.jpg";
              if (response.data.Video.length != 0) {
                const video = response.data.Video;
                playerOptions.sources[0] = {
                  type: "video/mp4",
                  src: video[0],
                };
                srcvideo.value = video;
              }
            });
          });
        });
    };

    // Initialize map on component mount
    onMounted(() => {
      // 使用nextTick确保DOM已更新
      nextTick(() => {
        createMapView(danMount.value);
      });
    });

    // Return all reactive variables and methods (will add these in the next edit)
    return {
      isTeacher,
      r1, r2, r3, 
      map, mapConfig, graphics, highlighSelect,
      pointTitle, desserts, selectedItem,
      items0, items1, items2, 
      drawer, mini, andrawer, anmini,
      model, pointItems, viewer1, picModel, i, srcvideo,
      playerOptions,
      pointGraphic, pointGraphicLayer,
      horizontalLine, verticalLine, pointIntroduce,
      type, selectedMapType, p_id,
      mangMount, xiangMount, danMount,
      baseLayers, current_mount, lat, long,
      edit_info,
      changeMapType,
      createMapView,
      goDan,
      goMang,
      goXiang,
      flicker,
      clickLocation,
      inited,
      onPlayerPlay,
      onPlayerPause,
      onListClickHandler,
    };
  }
};
</script>

<style scoped>
.route-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.fill-height {
  height: 100%;
  width: 100%;
}

.h-100 {
  height: 100%;
}

.position-relative {
  position: relative;
}

.map-container {
  height: 100%;
  width: 100%;
  position: relative;
  min-height: calc(100vh - 64px); /* 减去可能的头部高度 */
}

.coordinate-card {
  background-color: rgba(255, 255, 255, 0.9);
  max-width: 350px;
}

.control-panel {
  background-color: rgba(255, 255, 255, 0.9);
}

.location-btn {
  min-width: 100px;
  flex-basis: 31%;
}

.detail-toggle-btn {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: 10;
}

#horizontalLine {
  height: 2px;
  background: linear-gradient(
    to right,
    #4caf50,
    #4caf50 7.5px,
    transparent 7.5px,
    transparent
  );
  background-size: 15px 100%;
  width: 100%;
  position: absolute;
  top: 50%;
  z-index: 999;
}

#verticalLine {
  width: 2px;
  background: linear-gradient(
    to bottom,
    #4caf50,
    #4caf50 7.5px,
    transparent 7.5px,
    transparent
  );
  background-size: 100% 15px;
  height: 100%;
  position: absolute;
  left: 50%;
  z-index: 999;
}

.drawer-content {
  max-height: calc(100vh - 64px);
  overflow-y: auto;
}

.location-item {
  transition: background-color 0.2s;
}

.location-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* 确保视频播放器响应式适应容器 */
.video-player {
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
}

/* 确保导航抽屉能够正确适应内容但不影响整体布局 */
.v-navigation-drawer {
  position: relative !important;
  height: 100% !important;
}
</style>