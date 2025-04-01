<template>
  <div>
    <div id="fly1">
      <div class="esri-ui-top-right esri-ui-corner">
        <v-card min-width="400px" color="rgba(255, 255, 255, 0.7)">
          <v-card-title> 飞行浏览设置 </v-card-title>
          <v-card-text>
            <div>浏览路线</div>
            <v-radio-group v-model="route" row mandatory>
              <v-radio label="路线1" value="1"></v-radio>
              <v-radio label="路线2" value="2"></v-radio>
            </v-radio-group>
            <div>浏览进度</div>
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
            <v-btn
              color="primary"
              depressed
              tile
              @click="fly(schedule), changeRoute(route)"
              >飞行</v-btn
            >
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { loadModules } from "esri-loader";
import { ref, reactive, shallowRef, onMounted } from 'vue';

export default {
  setup() {
    // 响应式状态
    const map = shallowRef(null);
    const mapConfig = reactive({
      container: "fly1",
      sceneView: null,
    });
    const schedule = ref("0"); //浏览进度的值
    const Max = ref("10"); //浏览进度的最大值
    //路线1的点
    const paths3 = ref([
      [113.749129, 25.0346],
      [113.748968, 25.034131],
      [113.748808, 25.033661],
      [113.74844, 25.03338],
      [113.747987, 25.033176],
      [113.747535, 25.032971],
      [113.747083, 25.032767],
      [113.74675, 25.032428],
      [113.746493, 25.032003],
      [113.746156, 25.031702],
      [113.745664, 25.031635],
      [113.745172, 25.031569],
      [113.745024, 25.031246],
      [113.745099, 25.030755],
      [113.745174, 25.030265],
      [113.745233, 25.029805],
      [113.744864, 25.030138],
      [113.744445, 25.030253],
      [113.744017, 25.030046],
      [113.743717, 25.02965],
      [113.743418, 25.029254],
      [113.743118, 25.028859],
      [113.742744, 25.028562],
      [113.742281, 25.028384],
      [113.741818, 25.028206],
      [113.741416, 25.027974],
      [113.741306, 25.02749],
      [113.740845, 25.027616],
      [113.740494, 25.027488],
      [113.740196, 25.027124],
      [113.739755, 25.026895],
      [113.739315, 25.026665],
      [113.738875, 25.026436],
      [113.738435, 25.026207],
      [113.738075, 25.025905],
      [113.738149, 25.02559],
      [113.738302, 25.025434],
      [113.737887, 25.025162],
      [113.737471, 25.02489],
      [113.737036, 25.0247],
      [113.736589, 25.024834],
      [113.736176, 25.024748],
      [113.735697, 25.024879],
      [113.735442, 25.024725],
      [113.735067, 25.024792],
      [113.734603, 25.02497],
      [113.738887, 25.029281],
      [113.738595, 25.02888],
      [113.738191, 25.028643],
      [113.737711, 25.028517],
      [113.737231, 25.028392],
      [113.736894, 25.028028],
      [113.736558, 25.027662],
      [113.736223, 25.027297],
      [113.736098, 25.026842],
      [113.735788, 25.026485],
      [113.735412, 25.026161],
      [113.735037, 25.025837],
      [113.734661, 25.025512],
      [113.734531, 25.025063],
    ]);
    //路线2的点
    const Paths4 = ref([
      [113.752649, 25.046907],
      [113.752213, 25.04667],
      [113.751777, 25.046432],
      [113.751341, 25.046195],
      [113.750905, 25.045958],
      [113.750469, 25.045721],
      [113.750033, 25.045484],
      [113.749597, 25.045247],
      [113.749161, 25.04501],
      [113.748725, 25.044773],
      [113.748289, 25.044536],
      [113.747853, 25.044298],
      [113.747417, 25.044061],
      [113.746981, 25.043824],
      [113.746538, 25.043602],
      [113.746069, 25.043438],
      [113.745601, 25.043275],
      [113.745132, 25.043112],
      [113.744663, 25.042949],
      [113.744194, 25.042786],
      [113.743715, 25.042693],
      [113.743219, 25.042714],
      [113.742734, 25.042683],
      [113.742287, 25.042467],
      [113.741929, 25.042676],
      [113.741605, 25.043052],
      [113.741273, 25.04342],
      [113.740884, 25.043727],
      [113.740494, 25.044034],
      [113.740104, 25.044342],
      [113.739714, 25.044649],
      [113.739324, 25.044956],
      [113.738934, 25.045263],
      [113.738545, 25.04557],
      [113.738114, 25.045761],
      [113.737617, 25.045766],
      [113.737121, 25.045772],
      [113.736625, 25.045777],
      [113.736184, 25.045697],
      [113.735984, 25.045242],
      [113.735513, 25.045199],
      [113.735017, 25.045193],
      [113.734611, 25.044955],
      [113.734241, 25.044624],
      [113.733784, 25.044455],
      [113.733388, 25.044223],
      [113.733272, 25.043741],
      [113.733081, 25.043307],
      [113.732669, 25.043055],
      [113.732173, 25.043036],
      [113.731679, 25.043019],
      [113.731351, 25.043354],
      [113.730885, 25.043184],
      [113.73042, 25.043045],
      [113.729967, 25.043248],
      [113.729505, 25.043429],
      [113.729015, 25.043439],
      [113.728519, 25.043415],
      [113.728023, 25.043389],
      [113.727531, 25.043331],
      [113.727038, 25.043272],
      [113.726545, 25.043213],
      [113.726052, 25.043154],
      [113.72558, 25.043282],
      [113.725103, 25.043311],
      [113.724616, 25.043214],
      [113.724175, 25.043331],
      [113.724315, 25.04366],
      [113.72467, 25.044006],
      [113.724942, 25.044398],
      [113.725154, 25.044776],
      [113.725634, 25.0449],
      [113.726115, 25.045024],
      [113.726596, 25.045147],
      [113.727077, 25.045271],
      [113.727297, 25.045096],
      [113.727546, 25.045526],
      [113.727795, 25.045955],
      [113.72782, 25.046434],
      [113.727742, 25.046752],
      [113.727246, 25.046772],
      [113.727446, 25.047147],
      [113.727721, 25.04756],
      [113.727995, 25.047974],
      [113.728328, 25.048275],
      [113.72869, 25.048164],
      [113.728543, 25.04769],
      [113.728604, 25.047198],
      [113.728785, 25.047172],
      [113.72905, 25.04759],
      [113.729264, 25.048038],
    ]);
    const cam = shallowRef(null);
    const route = ref(1); //实习路线选择框
    const speed = ref("2"); //飞行速度
    const tickLabels = ref(["0.6", "0.8", "1", "2", "4", "6", "8", "10"]);
    const gLayer = shallowRef(null); //绘制图层
    const pointGraphic = shallowRef(null); //绘制的图形
    const polylineGraphic = shallowRef(null); //绘制的图形
    const route1 = shallowRef(null);
    const route2 = shallowRef(null);

    //创建地图
    const createMapView = function () {
      const option = {
        //定义一个包含有JS API中js开发包和css样式文件的对象
        url: "https://js.arcgis.com/4.19/init.js",
        css: "https://js.arcgis.com/4.19/esri/themes/light/main.css",
      };
      //通过loadModules来做衔接
      loadModules(
        [
          "esri/Map",
          "esri/views/SceneView",
          "esri/layers/SceneLayer",
          "esri/Camera",
          "esri/Graphic",
          "esri/layers/GraphicsLayer",
          "esri/layers/FeatureLayer",
        ],
        option
      )
        .then(
          ([
            Map,
            SceneView,
            SceneLayer,
            Camera,
            Graphic,
            GraphicsLayer,
            FeatureLayer,
          ]) => {
            gLayer.value = new GraphicsLayer({
              //绘制图层
              elevationInfo: { mode: "on-the-ground" },
            });
            map.value = new Map({
              //地图
              basemap: "hybrid",
              ground: "world-elevation",
              layers: [gLayer.value],
            });

            mapConfig.sceneView = new SceneView({
              //三维视图
              map: map.value,
              container: mapConfig.container,
              center: [113.75665604199996, 25.04682589249998],
              zoom: 14,
              camera: {
                position: [113.734485, 25.047025, 500],
                heading: 0,
                tilt: 60,
              },
            });

            mapConfig.sceneView.ui.components = [];
            pointGraphic.value = new Graphic();
            polylineGraphic.value = new Graphic();
            cam.value = new Camera();

            //设置路线1
            const lineSymbol1 = {
              type: "simple-line",
              color: [226, 119, 40],
              width: 4,
            };

            const polylineAtt1 = {
              Name: "Keystone Pipeline",
              Owner: "TransCanada",
              Length: "3,456 km",
            };

            const polylineGeometry1 = {
              type: "polyline",
              paths: paths3.value,
            };

            route1.value = new Graphic({
              geometry: polylineGeometry1,
              symbol: lineSymbol1,
              attributes: polylineAtt1,
            });

            //设置路线2
            const lineSymbol2 = {
              type: "simple-line",
              color: [266, 19, 140],
              width: 4,
            };

            const polylineAtt2 = {
              Name: "Keystone Pipeline",
              Owner: "TransCanada",
              Length: "3,456 km",
            };

            const polylineGeometry2 = {
              type: "polyline",
              paths: Paths4.value,
            };

            route2.value = new Graphic({
              geometry: polylineGeometry2,
              symbol: lineSymbol2,
              attributes: polylineAtt2,
            });
          }
        )
        .catch((err) => {
          console.error("地图创建失败，" + err);
        });
    };

    //路线切换
    const changeRoute = (value) => {
      gLayer.value.removeAll(); //保证换路线时清除其他路线
      if (value == 1) {
        gLayer.value.add(route1.value);
      } else {
        gLayer.value.add(route2.value);
      }
    };

    // 转换速度
    const speed1 = (value) => {
      let num;
      switch (value) {
        case "0":
          num = 0.6;
          break;
        case "1":
          num = 0.8;
          break;
        case "2":
          num = 1.0;
          break;
        case "3":
          num = 2.0;
          break;
        case "4":
          num = 4.0;
          break;
        case "5":
          num = 6.0;
          break;
        case "6":
          num = 8.0;
          break;
        case "7":
          num = 10.0;
          break;
        default:
          num = 1.0;
      }
      return num;
    };

    //飞行实现
    const fly = (value, route_value) => {
      changeRoute(route_value);
      const i = Math.floor((parseInt(value) / 10) * 30);
      let paths;
      if (route_value == 1) {
        paths = paths3.value;
      } else {
        paths = Paths4.value;
      }

      if (i < paths.length - 1) {
        //航向，不知道这样算是否正确，就是向量指向后一个点
        //tilt采用固定值60
        //position位置就是第i个点，同时为了显示整体路线，增加z值
        cam.value = {
          position: [paths[i][0], paths[i][1], 200],
          heading: bearing(
            paths[i][0],
            paths[i][1],
            paths[i + 1][0],
            paths[i + 1][1]
          ),
          tilt: 60,
        };
      }

      mapConfig.sceneView.goTo(
        cam.value,
        {
          speedFactor: speed1(speed.value),
          easing: "linear",
        },
        { duration: 1000 }
      );
    };

    //计算航向角
    const bearing = (startLng, startLat, destLng, destLat) => {
      startLat = (startLat * Math.PI) / 180;
      startLng = (startLng * Math.PI) / 180;
      destLat = (destLat * Math.PI) / 180;
      destLng = (destLng * Math.PI) / 180;

      let bearing =
        (Math.atan2(
          Math.sin(destLng - startLng) * Math.cos(destLat),
          Math.cos(startLat) * Math.sin(destLat) -
            Math.sin(startLat) *
              Math.cos(destLat) *
              Math.cos(destLng - startLng)
        ) *
          180) /
        Math.PI;
      if (bearing < 0) {
        bearing = 360 + bearing;
      }
      return bearing;
    };

    // 生命周期钩子
    onMounted(() => {
      createMapView();
    });

    // 返回方法和响应式状态
    return {
      map,
      mapConfig,
      schedule,
      Max,
      paths3,
      Paths4,
      cam,
      route,
      speed,
      tickLabels,
      gLayer,
      pointGraphic,
      polylineGraphic,
      route1,
      route2,
      createMapView,
      changeRoute,
      fly,
    };
  },
};
</script>

<style scoped>
#fly1 {
  height: 876px;
  width: 100%;
  position: relative;
}
</style>