<template>
  <div>
    <div id="pathAnalysis">
      <div class="esri-ui-top-right esri-ui-corner">
        <v-card min-width="400px" color="rgba(255, 255, 255, 0.7)">
          <v-card-title> 路径分析 </v-card-title>
          <v-card-text>
            <v-radio-group v-model="pointType" row mandatory>
              <v-radio label="停靠点" value="1"></v-radio>
              <v-radio label="障碍点" value="2"></v-radio>
            </v-radio-group>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="primary" depressed tile @click="addListening"
              >绘制</v-btn
            >
            <v-btn color="primary" depressed tile @click="solveResults"
              >求解</v-btn
            >
            <v-btn color="primary" depressed tile @click="cleanAll">清空</v-btn>
          </v-card-actions>
        </v-card>
      </div>
      <div id="lackTip" class="esri-ui-inner-container" v-show="lackTip">
        <v-alert type="error" dismissible dark v-model="lackTip" outlined text>
          请至少选择 <strong>2个</strong> 点！
        </v-alert>
      </div>
      <div id="errorTip" class="esri-ui-inner-container" v-show="errorTip">
        <v-alert type="error" dismissible dark v-model="errorTip" outlined text>
          无结果，请重新选择！
        </v-alert>
      </div>
    </div>
  </div>
</template>

<script>
import { loadModules } from "esri-loader";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css';
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';

export default {
  name: "Home",
  setup() {
    // 响应式状态
    const map = ref("");
    const mapConfig = reactive({
      container: "pathAnalysis",
      mapView: null,
    });
    const lackTip = ref(false); //缺少点的提示信息
    const errorTip = ref(false); //路径分析没有结果的提示信息
    const pointType = ref(1); //设置停靠点或者障碍点
    const routeLayer = ref(null); //路径分析结果图层
    const stopSymbol = ref(null); //停靠点样式
    const barrierSymbol = ref(null); //障碍点样式
    const routeSymbol = ref(null); //返回的路线样式
    const routeParams = ref(null); //查询参数
    const routeTask = ref(null); //路径导航的服务
    const addPointsL = ref(null); //地图绘制点的监听器

    //创建地图
    const _createMapView = function () {
      const _self = { 
        map, 
        mapConfig, 
        routeLayer, 
        stopSymbol, 
        barrierSymbol, 
        routeSymbol, 
        routeParams, 
        routeTask 
      }; //定义一个_self对象引用响应式变量
      
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
          "esri/layers/WebTileLayer",
          "esri/layers/support/TileInfo",
          "esri/geometry/SpatialReference",
          "esri/Basemap",
          "esri/layers/MapImageLayer",
          "esri/layers/GraphicsLayer",
          "esri/tasks/RouteTask",
          "esri/tasks/support/RouteParameters",
          "esri/tasks/support/FeatureSet",
          "esri/layers/FeatureLayer",
        ],
        option
      )
        .then(
          ([
            Map,
            MapView,
            WebTileLayer,
            TileInfo,
            SpatialReference,
            Basemap,
            MapImageLayer,
            GraphicsLayer,
            RouteTask,
            RouteParameters,
            FeatureSet,
            FeatureLayer
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
                "http://{subDomain}.tianditu.gov.cn/vec_c/esri/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=94a9c789edc5d02e50a129a2276d3ab7",
              subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
              tileInfo,
              spatialReference,
            });
            const basemap = new Basemap({
              baseLayers: [webTileLayer],
            });
            //路径分析的结果图层
            _self.routeLayer.value = new GraphicsLayer();
            //原始路网图层
            var layer = new MapImageLayer({
              url: "https://danxiagis.top:6443/arcgis/rest/services/DanXia/DXNetwork/MapServer",
            });
           
            
            _self.map.value = new Map({
              //实例化地图
              basemap,
              layers: [layer, _self.routeLayer.value],
            });
         // 范围图层
            var boder_featureLayer = new FeatureLayer({
              url: "https://danxiagis.top:6443/arcgis/rest/services/DanXia/danxiaBorder/FeatureServer",
              renderer: {
                type: "simple",
                symbol: {
                  type: "simple-line",
                  width: "3px",
                  color: "#BB5500",
                },
              },
            });
            _self.map.value.add(boder_featureLayer);
            //停靠点样式
            _self.stopSymbol.value = {
              type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
              path: "M246.4 682.9V173.3c-1.8-13 1.4-32.8 15.8-51.1 30.6-38.5 100.1-58 206.6-58 66.3 0 111.8 41.6 148.4 75 21.6 19.7 42 38.3 60.5 42.9 55.5 13.6 144.3-27.7 173.8-44.8l46.6-27-63.5 464.2-7.9 6.5c-3 2.5-74.5 60.9-158.7 40.7-31.5-7.6-60.6-19.7-88.7-31.5C542.1 574.7 507 560 474.1 560c-115.8 0-181.2 71.1-181.8 71.8l-45.9 51.1z m227.7-175.6c43.4 0 85.2 17.4 125.5 34.3 26.2 11 53.3 22.3 80.7 28.9 45 10.8 87.9-13.1 104.9-24.4l46.6-340.6c-44.2 19.1-112.1 41.2-166.8 27.7-31.6-7.8-56.8-30.8-83.5-55.1-33-30.1-67-61.2-112.9-61.2-117.8 0-153.7 25.3-163.7 36.2-5.6 6.1-6.4 10.9-6.4 12.8l1.4 3.7-1 1.5V559c37.4-24.4 96.7-51.7 175.2-51.7z m335.8 53.5h0.1-0.1zM298.3 165.1 M278.3 959.8c-85.5 0-152.4-42.9-152.4-97.6s66.9-97.6 152.4-97.6 152.4 42.9 152.4 97.6-66.9 97.6-152.4 97.6z m0-142.5c-60.9 0-99.7 26.6-99.7 44.9s38.8 44.9 99.7 44.9 99.7-26.6 99.7-44.9-38.8-44.9-99.7-44.9z",
              size: 20,
              outline: {
                color: "black",
                width: 1,
              },
            };

            //障碍点样式
            _self.barrierSymbol.value = {
              type: "simple-marker",
              path: "M477.866667 436.48m10.666666 0l42.666667 0q10.666667 0 10.666667 10.666667l0 192q0 10.666667-10.666667 10.666666l-42.666667 0q-10.666667 0-10.666666-10.666666l0-192q0-10.666667 10.666666-10.666667Z M477.866667 713.813333m10.666666 0l42.666667 0q10.666667 0 10.666667 10.666667l0 42.666667q0 10.666667-10.666667 10.666666l-42.666667 0q-10.666667 0-10.666666-10.666666l0-42.666667q0-10.666667 10.666666-10.666667Z M932.266667 786.773333a117.76 117.76 0 0 0-85.333334-30.293333c-5.12 0-10.24 1.493333-15.146666 2.346667L587.946667 239.573333a100.266667 100.266667 0 0 0 10.88-10.453333 117.333333 117.333333 0 0 0-92.586667-196.053333 117.333333 117.333333 0 0 0-111.36 122.88 116.053333 116.053333 0 0 0 37.973333 80.853333L187.733333 757.76a135.253333 135.253333 0 0 0-22.826666-1.28 117.333333 117.333333 0 1 0 92.586666 196.053333 115.626667 115.626667 0 0 0 25.6-46.72h457.6a117.12 117.12 0 1 0 192-119.04zM472.533333 114.346667a53.76 53.76 0 0 1 75.306667-3.626667 54.4 54.4 0 0 1 17.493333 36.906667 52.906667 52.906667 0 0 1-13.866666 38.4 53.546667 53.546667 0 0 1-75.306667 3.84 54.4 54.4 0 0 1-17.493333-36.906667 53.76 53.76 0 0 1 13.866666-38.613333zM210.133333 909.653333a53.333333 53.333333 0 0 1-75.306666 3.626667 53.973333 53.973333 0 0 1-17.493334-36.906667 53.333333 53.333333 0 0 1 89.173334-42.666666 53.12 53.12 0 0 1 3.626666 75.306666z m556.373334-114.773333a116.48 116.48 0 0 0-25.6 46.933333H283.306667a118.613333 118.613333 0 0 0-33.706667-55.04 21.333333 21.333333 0 0 1-3.626667-2.56L490.666667 265.386667a108.16 108.16 0 0 0 21.333333 2.133333 121.386667 121.386667 0 0 0 17.706667-1.493333l245.333333 521.173333a98.986667 98.986667 0 0 0-8.533333 7.68z m126.293333 114.773333a53.333333 53.333333 0 0 1-75.306667 3.626667 53.973333 53.973333 0 0 1-17.493333-36.906667 53.333333 53.333333 0 0 1 89.173333-42.666666 53.12 53.12 0 0 1 3.626667 75.306666z",
              size: 20,
              outline: {
                color: "red",
                width: 1,
              },
            };

            //返回的路线样式
            _self.routeSymbol.value = {
              type: "simple-line", // autocasts as SimpleLineSymbol()
              color: [0, 0, 255, 0.5],
              width: 5,
            };

            //查询参数
            _self.routeParams.value = new RouteParameters({
              stops: new FeatureSet(), //停靠点
              pointBarriers: new FeatureSet(), //障碍点
              outSpatialReference: {
                // 输出投影
                wkid: 3857,
              },
            });

            //路径导航的服务
            _self.routeTask.value = new RouteTask({
              url: "https://danxiagis.top:6443/arcgis/rest/services/DanXia/DXNetwork/NAServer/path",
            });

            _self.mapConfig.mapView = new MapView({
              //实例化地图视图
              map: _self.map.value,
              zoom: 14,
              center: [113.754555, 25.026711],
              container: _self.mapConfig.container,
              constraints: {
                maxZoom: 17,
              },
            });
            _self.mapConfig.sceneView.when().then(function() {
                // 完成加载
                NProgress.done();
            }).catch(function(error) {
                console.error("地图加载出错: ", error);
                NProgress.done();
            });
          }
        )
        .catch((err) => {
          console.error("地图创建失败，" + err);
        });
    };

    //地图上添加监听
    const addListening = function () {
      addPointsL.value = mapConfig.mapView.on("click", addPoints);
    };

    //添加点
    const addPoints = function (event) {
      const option = {
        //定义一个包含有JS API中js开发包和css样式文件的对象
        url: "https://js.arcgis.com/4.19/init.js",
        css: "https://js.arcgis.com/4.19/esri/themes/light/main.css",
      };
      //通过loadModules来做衔接
      loadModules(["esri/Graphic"], option).then(([Graphic]) => {
        if (pointType.value == 1) {
          // 将停靠点添加在地图上
          var stop = new Graphic({
            geometry: event.mapPoint,
            symbol: stopSymbol.value,
          });
          routeLayer.value.add(stop);
          routeParams.value.stops.features.push(stop);
        }
        if (pointType.value == 2) {
          //将障碍点添加到地图上
          var barrier = new Graphic({
            geometry: event.mapPoint,
            symbol: barrierSymbol.value,
          });
          routeLayer.value.add(barrier);
          routeParams.value.pointBarriers.features.push(barrier);
        }
      });
    };

    //得到分析结果
    const solveResults = function () {
      // 将点击点加入到计算参数中，超过两个点则开始计算路线
      if (routeParams.value.stops.features.length < 2) {
        lackTip.value = true;
        return;
      }
      if (routeParams.value.stops.features.length >= 2) {
        console.log(routeParams.value);
        // 进行查询
        routeTask.value
          .solve(routeParams.value)
          .then(showRoute, logError);
      }
    };

    //输出查询的结果
    const showRoute = function (data) {
      var routeResult = data.routeResults[0].route;
      routeResult.symbol = routeSymbol.value;
      routeLayer.value.add(routeResult);
    };
    
    //输出查询错误信息
    const logError = function (error) {
      errorTip.value = true;
      console.error(error);
    };

    //清空数据
    const cleanAll = function () {
      addPointsL.value.remove();
      routeLayer.value.removeAll();
      routeParams.value.stops.features.length = 0; //清空参数
      routeParams.value.pointBarriers.features.length = 0; //清空参数
    };
    
    // 生命周期钩子
    onMounted(() => {
      NProgress.start();
      _createMapView();
    });
    
    onBeforeUnmount(() => {
      // 组件销毁前的逻辑
      NProgress.remove(); 
    });
    
    // 暴露给模板的内容
    return {
      map,
      mapConfig,
      lackTip,
      errorTip,
      pointType,
      routeLayer,
      stopSymbol,
      barrierSymbol,
      routeSymbol,
      routeParams,
      routeTask,
      addPointsL,
      _createMapView,
      addListening,
      addPoints,
      solveResults,
      showRoute,
      logError,
      cleanAll
    };
  }
};
</script>

<style scoped>
#pathAnalysis {
  height:  calc(100vh - 50px);
  width: 100%;
  position: relative;
}
#lackTip {
  left: 25%;
  width: 50%;
  position: absolute;
  top: 40%;
}
#errorTip {
  left: 25%;
  width: 50%;
  position: absolute;
  top: 40%;
}
</style>