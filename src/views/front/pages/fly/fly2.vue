<template>
  <div>
    <div id="fly2">
      <div class="esri-ui-top-right esri-ui-corner">
        <v-card min-width="400px" color="rgba(255, 255, 255, 0.7)">
          <v-card-title> 自定义路线飞行 </v-card-title>
          <v-card-text v-if="option">
            <div>飞行进度</div>
            <v-slider v-model="schedule" :max="Max"></v-slider>
            <div>飞行速度</div>
            <v-slider
              v-model="speed"
              step="1"
              :max="7"
              :tick-labels="tickLabels"
            ></v-slider>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="primary" depressed tile @click="creatSke"
              >画一条线</v-btn
            >
            <!-- flyTwo方法是飞到那个几何形状上，不能按顺序飞 -->
            <v-btn color="primary" depressed tile @click="fly(schedule)"
              >飞行</v-btn
            >
            <v-btn color="primary" depressed tile @click="clean">清除</v-btn>
            <v-btn color="primary" depressed tile @click="home">
              <v-icon dark> mdi-home </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, shallowRef, onMounted } from 'vue';
import { loadModules } from "esri-loader";

export default {
  setup() {
    const map = shallowRef(null);
    const mapConfig = reactive({
      container: "fly2",
      sceneView: null,
    });
    
    const graphicsLayer = shallowRef(null); // 绘制图层
    const option = ref(false);
    const sketchViewModel = shallowRef(null); // 绘制折线的工具
    const point = shallowRef(null); // 绘制的点转为gemory
    const schedule = ref("0"); // 浏览进度的值
    const Max = ref("10"); // 浏览进度的最大值
    // 存储用户画的点的经纬度及高程
    const paths = ref([]);
    const cam = shallowRef(null);
    const speed = ref("2"); // 飞行速度
    const tickLabels = ref(["0.6", "0.8", "1", "2", "4", "6", "8", "10"]);
    const homeCam = shallowRef(null); // 初始视图
    const ccWidget = shallowRef(null); // 坐标控件
    
    // 创建地图
    const _createMapView = () => {
      const option = {
        url: "https://js.arcgis.com/4.19/init.js",
        css: "https://js.arcgis.com/4.19/esri/themes/light/main.css",
      };
      
      loadModules(
        [
          "esri/Map",
          "esri/views/SceneView",
          "esri/Camera",
          "esri/layers/GraphicsLayer",
          "esri/widgets/Sketch/SketchViewModel",
          "esri/geometry/Point",
          "esri/widgets/CoordinateConversion",
        ],
        option
      )
        .then(
          ([
            Map,
            SceneView,
            Camera,
            GraphicsLayer,
            SketchViewModel,
            Point,
            CoordinateConversion,
          ]) => {
            graphicsLayer.value = new GraphicsLayer({
              elevationInfo: { mode: "on-the-ground" },
            });
            
            map.value = new Map({
              basemap: "hybrid",
              ground: "world-elevation",
              layers: [graphicsLayer.value],
            });

            mapConfig.sceneView = new SceneView({
              map: map.value,
              zoom: 14,
              camera: {
                position: [113.75665604199996, 25.04682589249998, 180],
                heading: 255,
                tilt: 80,
              },
              container: mapConfig.container,
            });

            cam.value = new Camera();
            homeCam.value = new Camera();

            // 画出的线的样式
            const line = {
              type: "line-3d",
              symbolLayers: [
                {
                  type: "line",
                  size: "8px",
                  material: {
                    color: "blue",
                  },
                },
              ],
            };
            
            // 设置sketchViewModel
            sketchViewModel.value = new SketchViewModel({
              layer: graphicsLayer.value,
              view: mapConfig.sceneView,
              polylineSymbol: line,
              snappingOptions: "selfEnabled", // 捕捉自己的状态
            });
            
            point.value = new Point();
            
            // 显示此时坐标
            ccWidget.value = new CoordinateConversion({
              view: mapConfig.sceneView,
            });
            
            mapConfig.sceneView.ui.add(ccWidget.value, "bottom-left");
          }
        )
        .catch((err) => {
          console.error("地图创建失败，" + err);
        });
    };

    // 激活sketchviewModel工具
    const creatSke = () => {
      // 调整摄像机为俯视
      schedule.value = 0;
      mapConfig.sceneView.camera.tilt = 0;
      mapConfig.sceneView.zoom = 17;

      sketchViewModel.value.create("polyline");
      // 设置SketchViewModel的监听状态，当绘画完成后、取消后
      const skeCreate = sketchViewModel.value.on("create", function (event) {
        if (event.state === "complete") {
          // 展开进度条以及飞行速度调节内容
          option.value = true;
          
          // 获得绘制的折点，并转为经纬度坐标，最后是经纬度坐标的数组[[],[]]
          const geometryItems =
            graphicsLayer.value.graphics.items[0].geometry.paths[0];

          for (var i = 0; i < geometryItems.length; i++) {
            const mercator = geometryItems[i];
            const endItem = mercatorToLoca(mercator);
            point.value.x = endItem[0];
            point.value.y = endItem[1];
            
            // 获得高程数据并加入到数组中
            map.value.ground
              .queryElevation(point.value, { returnSampleInfo: true })
              .then(function (result) {
                const z = result.geometry.z;
                endItem[2] = z;
              });
            
            paths.value.push(endItem);
          }
          
          skeCreate.remove(); // 断开事件侦听器的连接
        }
        
        if (event.state === "cancel") {
          option.value = false; // 关闭内容
          skeCreate.remove(); // 断开事件侦听器的连接
        }
      });
    };

    // 飞行方法
    const fly = (value) => {
      const len = paths.value.length;
      let num = Math.floor((parseInt(value) / 10) * len);
      
      // 如果进度值为0，就飞到起始点
      if (num == 0) {
        cam.value = {
          position: [paths.value[0][0], paths.value[0][1], paths.value[0][2] + 100],
          heading: 0,
          tilt: 75,
        };
        
        mapConfig.sceneView.goTo(cam.value, {
          speedFactor: 0.3,
          easing: "linear",
        });
        
        return;
      }
      
      if (num >= len) num = len - 1;
      
      // 获得两个点之间的偏转角、倾斜角并作为camera的值
      const heading = calcBearing(
        paths.value[num - 1][0],
        paths.value[num - 1][1],
        paths.value[num][0],
        paths.value[num][1]
      );
      
      cam.value = {
        position: [paths.value[num][0], paths.value[num][1], paths.value[num][2] + 100],
        heading: heading,
        tilt: 75,
      };
      
      mapConfig.sceneView.goTo(cam.value, {
        speedFactor: getSpeed(speed.value),
        easing: "linear",
      });
    };

    // 计算距离
    const calcDistance = (lon1, lat1, lon2, lat2) => {
      const radLon1 = (lon1 * Math.PI) / 180.0;
      const radLat1 = (lat1 * Math.PI) / 180.0;
      const radLon2 = (lon2 * Math.PI) / 180.0;
      const radLat2 = (lat2 * Math.PI) / 180.0;
      
      // 地球半径
      const earthR = 6371000.0;
      
      let distance =
        Math.acos(
          Math.sin(radLat1) * Math.sin(radLat2) +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radLon1 - radLon2)
        ) * earthR;
        
      return distance;
    };

    // 方位角的计算 heading  正北为0， 顺时针增加， 范围0-360
    const calcBearing = (lon1, lat1, lon2, lat2) => {
      const radLon1 = (lon1 * Math.PI) / 180.0;
      const radLat1 = (lat1 * Math.PI) / 180.0;
      const radLon2 = (lon2 * Math.PI) / 180.0;
      const radLat2 = (lat2 * Math.PI) / 180.0;
      
      const calcResult =
        Math.atan2(
          Math.sin(radLon2 - radLon1) * Math.cos(radLat2),
          Math.cos(radLat1) * Math.sin(radLat2) -
          Math.sin(radLat1) * Math.cos(radLat2) * Math.cos(radLon2 - radLon1)
        ) *
        (180.0 / Math.PI);
        
      const bearing = (calcResult + 360.0) % 360.0;
      return bearing;
    };

    // 在指定经纬度点朝向某个方位偏离一定距离的点的位置
    const calcReturn = (lon, lat, bearing) => {
      const lonLat = [];
      
      if (bearing < 90 || bearing >= 0) {
        lon = lon - 0.00214583333 * Math.cos((bearing * Math.pI) / 180.0);
        lat = lat - 0.00163888889 * Math.sin((bearing * Math.pI) / 180.0);
        lonLat.push(lon, lat);
      } else if (bearing >= 90 || bearing < 180) {
        lon =
          lon + 0.00214583333 * Math.cos(((180.0 - bearing) * Math.pI) / 180.0);
        lat =
          lat - 0.00163888889 * Math.sin(((180.0 - bearing) * Math.pI) / 180.0);
        lonLat.push(lon, lat);
      } else if (bearing >= 180 || bearing < 270) {
        lon =
          lon + 0.00214583333 * Math.cos(((270.0 - bearing) * Math.pI) / 180.0);
        lat =
          lat + 0.00163888889 * Math.sin(((270.0 - bearing) * Math.pI) / 180.0);
        lonLat.push(lon, lat);
      } else if (bearing >= 270) {
        lon =
          lon - 0.00214583333 * Math.cos(((360.0 - bearing) * Math.pI) / 180.0);
        lat =
          lat + 0.00163888889 * Math.sin(((360.0 - bearing) * Math.pI) / 180.0);
        lonLat.push(lon, lat);
      }
      
      return lonLat;
    };

    // 计算俯仰角， 90度时平行于水平面，0度时自上向下垂直俯视， 180度时自下向上仰视
    const calcTilt = (lon1, lat1, alt1, lon2, lat2, alt2) => {
      let distance = calcDistance(lon1, lat1, lon2, lat2);
      let angle = (Math.atan2(alt2 - alt1, distance) * 180.0) / Math.PI;
      let tilt = angle + 77;
      return tilt;
    };
    
    // 获得飞行速度
    const getSpeed = (speed) => {
      if (speed == 0) {
        return 0.6;
      } else if (speed == 1) {
        return 0.2;
      } else if (speed == 2) {
        return 1;
      } else if (speed == 3) {
        return 2;
      } else if (speed == 4) {
        return 4;
      } else if (speed == 5) {
        return 6;
      } else if (speed == 6) {
        return 8;
      } else if (speed == 6) {
        return 10;
      }
    };

    // 墨卡托转经纬度坐标
    const mercatorToLoca = (mercator) => {
      var lonlat = [];
      var x = (mercator[0] / 20037508.34) * 180;
      var y = (mercator[1] / 20037508.34) * 180;
      y =
        (180 / Math.PI) *
        (2 * Math.atan(Math.exp((y * Math.PI) / 180)) - Math.PI / 2);
      lonlat[0] = x;
      lonlat[1] = y;
      return lonlat;
    };

    // 清除按钮
    const clean = () => {
      graphicsLayer.value.removeAll();
      paths.value = [];
      schedule.value = "0";
    };

    // 回到初始视图
    const home = () => {
      homeCam.value = {
        position: [113.75665604199996, 25.04682589249998, 180],
        heading: 255,
        tilt: 80,
      };
      
      mapConfig.sceneView
        .goTo(homeCam.value, {
          speedFactor: 0.3,
          easing: "linear",
        });
    };

    onMounted(() => {
      _createMapView();
    });

    return {
      map,
      mapConfig,
      graphicsLayer,
      option,
      sketchViewModel,
      point,
      schedule,
      Max,
      paths,
      cam,
      speed,
      tickLabels,
      homeCam,
      ccWidget,
      creatSke,
      fly,
      clean,
      home
    };
  }
};
</script>

<style scoped>
#fly2 {
  height: 876px;
  width: 100%;
  position: relative;
}
</style>