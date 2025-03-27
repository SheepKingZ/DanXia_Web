<template>
  <div id="fly1">
    <div>
      <div class="esri-ui-top-left esri-ui-corner">
        <v-card
          min-width="80px"
          min-height="110px"
          color="rgba(255, 255, 255, 0.7)"
          style="margin-left: 60px; margin-top: 20px"
        >
          <v-row>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  class="mt-5 mx-5"
                  @click="whichRoute=1;route=1;densifyLine(1)"
                >
                  <v-icon>mdi-airplane-search</v-icon>
                </v-btn>
              </template>
              <span>实习路线浏览</span>
            </v-tooltip>
          </v-row>
          <v-row>
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  class="mt-5 mx-5"
                  @click="
                    schedule=0;
                    f2_show = true;
                    f1_show = false;
                    pathPointGraphicList = [];
                    pointGraphicLayer.removeAll()
                  "
                >
                  <v-icon>mdi-airplane-edit</v-icon>
                </v-btn>
              </template>
              <span >自定义飞行路线</span>
            </v-tooltip>
          </v-row>
        </v-card>
      </div>

      <div class="esri-ui-top-right esri-ui-corner" v-show="f2_show">
        <v-card min-width="400px" color="rgba(255, 255, 255, 0.7)">
          <v-card-title> 自定义路线飞行 </v-card-title>
          <v-card-text v-if="option">
            <div>飞行进度</div>
            <v-slider v-model="schedule" :max="lengthMax" @change="getSchedule"></v-slider>
            <div>飞行速度</div>
            <v-slider
              v-model="speed"
              step="1"
              :max="5"
              :tick-labels="tickLabels"
            ></v-slider>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="primary" depressed tile @click="creatSke"
              >画一条线</v-btn
            >
            <!-- flyTwo方法是飞到那个几何形状上，不能按顺序飞 -->
            <v-btn
              color="primary"
              depressed
              tile
              @click="
                fly_test(schedule)
              "
              >飞行</v-btn
            >
            <v-btn color="primary" depressed tile @click="isFlying = false"
              >停止飞行</v-btn
            >
            <v-btn color="primary" depressed tile @click="refly=true"
              >重新飞行</v-btn
            >
            <v-btn
              color="primary"
              depressed
              tile
              @click="changeHeadingLeft = true"
            >
              左转
            </v-btn>
            <v-btn
              color="primary"
              depressed
              tile
              @click="changeHeadingRight = true"
              >右转
            </v-btn>
          </v-card-actions>
          <v-card-actions>
            <v-btn color="primary" depressed tile @click="changeTiltUp = true"
              >视角朝上</v-btn
            >

            <v-btn color="primary" depressed tile @click="changeTiltDown = true"
              >视角朝下</v-btn
            >
            <v-btn color="primary" depressed tile @click="changeZHigher = true"
              >飞高一点</v-btn
            ><!--  -->
            <v-btn color="primary" depressed tile @click="changeZLower = true"
              >飞低一点</v-btn
            >
            
            <v-btn color="primary" depressed tile @click="clean">清除</v-btn>
            <v-btn color="primary" depressed tile @click="home">
              <v-icon dark> mdi-home </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>

      <div class="esri-ui-top-right esri-ui-corner" v-show="f1_show">
        <v-card min-width="400px" color="rgba(255, 255, 255, 0.7)">
          <v-card-title>已有路线飞行 </v-card-title>
          <v-card-text>
            <div>浏览路线</div>
            <v-radio-group v-model="route" row mandatory @change="change_view($event,'init')" >
              <v-radio label="路线1" value="1"></v-radio>
              <v-radio label="路线2" value="2"></v-radio>
            </v-radio-group>
            <div>浏览进度</div>
            <v-slider v-model="schedule" :max="lengthMax" @change="getSchedule"></v-slider>
            <div>飞行速度</div>
            <v-slider
              v-model="speed"
              step="1"
              :max="5"
              :tick-labels="tickLabels"
            ></v-slider>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="primary" depressed tile @click="fly_test(schedule)"
              >飞行</v-btn
            >
            <v-btn color="primary" depressed tile @click="isFlying = false"
              >停止飞行</v-btn
            >
            <v-btn color="primary" depressed tile @click="refly=true"
              >重新飞行</v-btn
            >
            <v-btn
              color="primary"
              depressed
              tile
              @click="changeHeadingLeft = true"
            >
              左转
            </v-btn>
            <v-btn
              color="primary"
              depressed
              tile
              @click="changeHeadingRight = true"
              >右转
            </v-btn>
          </v-card-actions>
          <v-card-actions>  
            <v-btn color="primary" depressed tile @click="changeTiltUp = true"
              >视角朝上</v-btn
            >

            <v-btn color="primary" depressed tile @click="changeTiltDown = true"
              >视角朝下</v-btn
            >
            <v-btn color="primary" depressed tile @click="changeZHigher = true"
              >飞高一点</v-btn
            ><!--  -->
            <v-btn color="primary" depressed tile @click="changeZLower = true"
              >飞低一点</v-btn
            >
          </v-card-actions>
        </v-card>
      </div>
      <div class="esri-ui-bottom-left esri-ui-corner" style="margin-top: 20px">
        <v-card>
          <v-card-title>
            点击处坐标：<span>{{ long }},{{ lat }}（wkid：3857）</span>
          </v-card-title>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { loadModules } from "esri-loader"; //Vue 文件中引入 esri-loader
import { ref, reactive, shallowRef, computed, onMounted, onBeforeUnmount } from 'vue';

export default {
  setup() {
    // 响应式状态
    const path3_graphic = shallowRef(null);
    const path4_graphic = shallowRef(null);
    const whichRoute = ref(1);
    
    const f1_show = ref(false);
    const f2_show = ref(false);
    const map = shallowRef(null);
    const mapConfig = reactive({
      container: "fly1",
      sceneView: null,
    });
    const schedule = ref("0"); //浏览进度的值
    const lengthMax = ref("10"); //浏览进度的最大值
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
    const paths4 = ref([
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
    const route1DensifiedPolyline = shallowRef(null); //加密的路径
    const route2DensifiedPolyline = shallowRef(null); //加密的路径
    const cam = shallowRef(null); //摄像机
    const route = ref(1); //实习路线选择框
    const speed = ref("2"); //飞行速度
    const tickLabels = ref(["0.5", "0.6", "0.8", "1", "2", "3"]);
    const pointGraphicLayer = shallowRef(null); //点图形
    const pointGraphic = shallowRef(null); //点图形
    const polylineGraphic = shallowRef(null); //线图形
    const sketchViewModel = shallowRef(null); //画线工具
    const option = ref(false);
    const paths = ref([]); //自定义飞行的路径点
    const pathPointGraphicList = ref([]); //保存自定义飞行路径上加密生成的顶点图形
    const isFlying = ref(false);
    const changeHeadingLeft = ref(false);
    const changeHeadingRight = ref(false);
    const changeTiltUp = ref(false);
    const changeTiltDown = ref(false);
    const changeZHigher = ref(false);
    const changeZLower = ref(false);
    const refly = ref(false);
    const skeTool = shallowRef(null);
    const point = shallowRef(null);
    const long = ref("");
    const lat = ref("");
    const skeCreate = shallowRef(null);
    const rqfId = shallowRef(null);
    const nowTime = ref(0);
    const nowTilt = ref(60);
    const nowHeading = ref(0);
    const nowZ = ref(100);

    // 方法部分
    //创建地图
    const createMapView = () => {
      NProgress.start();
      
      const option = {
        url: "https://js.arcgis.com/4.19/init.js",
        css: "https://js.arcgis.com/4.19/esri/themes/light/main.css",
      };
      
      loadModules(
        [
          "esri/Map",
          "esri/views/SceneView",
          "esri/layers/SceneLayer",
          "esri/Camera",
          "esri/geometry/Point",
          "esri/geometry/Polyline",
          "esri/Graphic",
          "esri/layers/GraphicsLayer",
          "esri/widgets/Sketch/SketchViewModel",
          "esri/geometry/Point",
          "esri/geometry/geometryEngine",
        ],
        option
      )
        .then(
          ([
            Map,
            SceneView,
            SceneLayer,
            Camera,
            Point,
            Polyline,
            Graphic,
            GraphicsLayer,
            SketchViewModel,
            Point_1,
            geometryEngine,
          ]) => {
            //初始化图层 GraphicsLayer：图形层
            pointGraphicLayer.value = new GraphicsLayer({
              //点图层，自定义飞行的点
              elevationInfo: { mode: "on-the-ground" },
            });
            
            map.value = new Map({
              basemap: "hybrid",
              ground: "world-elevation",
              layers: [pointGraphicLayer.value],
            });

            //初始化视图
            const center = [113.75665604199996, 25.04682589249998];
            
            mapConfig.sceneView = new SceneView({
              map: map.value,
              center: center,
              zoom: 14,
              camera: {
                position: {
                  x: 113.773052,
                  y: 25.046557,
                  z: 800,
                },
                tilt: 0,
                heading: 0,
              },
              container: mapConfig.container,
            });
            
            //地图点击事件,显示坐标
            mapConfig.sceneView.on("click", function (event) {
              const mapPoint = mapConfig.sceneView.toMap({
                x: event.x,
                y: event.y,
              });
              long.value = mapPoint.longitude.toFixed(8);
              lat.value = mapPoint.latitude.toFixed(8);

              console.log("点击位置:" + long.value + "," + lat.value);
            });

            //图形显示组件
            pointGraphic.value = new Graphic();
            polylineGraphic.value = new Graphic();

            //camera相机对象，用于查看沿路径前进
            cam.value = new Camera();

            point.value = new Point_1();

            //创建自定义的飞行路径的直线1
            const polyline3 = {
              //这里是在设计直线的颜色和粗细，symbol是符号的意思
              type: "polyline", // autocasts as new PolylineSymbol()
              // 路径的颜色
              color: [226, 119, 40],
              //路径的宽度，就是粗细
              width: 4,
            };

            //创建直线，使用的是原始的点，routes1和routes2
            const polyline3Geometry = {
              //几何形状的类型
              type: "polyline",
              //里面存储的是点的坐标
              paths: paths3.value,
            };

            //定义直线2，与直线一样
            const polyline4 = {
              type: "polyline",
              color: [255, 0, 0],
              width: 5,
            };

            //定义直线2的图形
            const polyline4Geometry = {
              type: "polyline",
              paths: paths4.value,
            };

            //生成路径图形1
            path3_graphic.value = new Graphic({
              geometry: polyline3Geometry,
              symbol: polyline3,
            });

            //生成路径图形2
            path4_graphic.value = new Graphic({
              geometry: polyline4Geometry,
              symbol: polyline4,
            });

            //创建折线1的对象
            const simpleLineSymbol = {
              type: "simple-line",
              color: [226, 119, 40],
              width: 2,
            };

            //折线1的形状属性,这里Polyline是加载的类
            const polyline1 = new Polyline({
              paths: paths3.value,
            });

            //加密
            route1DensifiedPolyline.value = geometryEngine.densify(polyline1, 50, "meters");

            //折线1的图形
            const polylineGraphic1 = new Graphic({
              geometry: route1DensifiedPolyline.value,
              symbol: simpleLineSymbol,
            });

            //创建折线2的对象
            const simpleLineSymbol2 = {
              type: "simple-line",
              color: [226, 119, 40],
              width: 2,
            };

            //折线2的形状属性,这里Polyline是加载的类
            const polyline2 = new Polyline({
              paths: paths4.value,
            });

            //加密
            route2DensifiedPolyline.value = geometryEngine.densify(polyline2, 50, "meters");

            //折线2的图形
            const polylineGraphic2 = new Graphic({
              geometry: route2DensifiedPolyline.value,
              symbol: simpleLineSymbol2,
            });

            // 设置鼠标和自定义绘制工具的设置
            // 1. 设置草图工具的颜色样式
            const line = {
              type: "simple-line",
              color: [255, 0, 122],
              width: 5,
            };

            // 2. 设置绘制工具
            sketchViewModel.value = new SketchViewModel({
              layer: pointGraphicLayer.value,
              view: mapConfig.sceneView,
              polylineSymbol: line,
              snappingOptions: "selfEnabled", // 捕捉自己的状态
            });

            // 3. 用于捕捉点的位置
            point.value = new Point();
            
            NProgress.done();
          }
        )
        .catch((err) => {
          alert("地图创建失败，" + err);
          NProgress.done();
        });
    };

    // 加密路线
    const densifyLine = (route) => {
      f1_show.value = true;
      f2_show.value = false;
      pointGraphicLayer.value.removeAll(); // 删除所有点
      pathPointGraphicList.value = []; // 清空存储的图形
      refly.value = false;
      
      let routeGraphic;
      if (route === 1) {
        pointGraphicLayer.value.add(path3_graphic.value);
        routeGraphic = route1DensifiedPolyline.value;
      } else {
        pointGraphicLayer.value.add(path4_graphic.value);
        routeGraphic = route2DensifiedPolyline.value;
      }
      
      // 计算最大值
      lengthMax.value = routeGraphic.paths[0].length - 1;
    };

    // 获取进度表
    const getSchedule = (value) => {
      refly.value = false;
      let routeGraphic;
      
      // 通过 route 判断使用哪个路线图形
      if (route.value === 1) {
        routeGraphic = route1DensifiedPolyline.value;
      } else {
        routeGraphic = route2DensifiedPolyline.value;
      }
      
      // 计算进度
      const index = value;
      
      if (index >= routeGraphic.paths[0].length) {
        return;
      }
      
      // 获取当前点和下一个点
      const currentPoint = routeGraphic.paths[0][index];
      
      // 计算真实方向
      if (index + 1 < routeGraphic.paths[0].length) {
        const nextPoint = routeGraphic.paths[0][index + 1];
        
        // 计算航向角
        nowHeading.value = bearing(
          currentPoint[0],
          currentPoint[1],
          nextPoint[0],
          nextPoint[1]
        );
      }
      
      // 设置相机
      cam.value = {
        position: [currentPoint[0], currentPoint[1], currentPoint[2] + nowZ.value],
        heading: nowHeading.value,
        tilt: nowTilt.value,
      };
      
      // 相机移动
      mapConfig.sceneView.goTo(cam.value, {
        speedFactor: 0,
        easing: "linear",
      });
    };

    // 重新飞行
    const fly_test = (value) => {
      let routeGraphic;
      
      if (f1_show.value === true) {
        // 通过 route 判断使用哪个路线图形
        if (route.value === 1) {
          routeGraphic = route1DensifiedPolyline.value;
        } else {
          routeGraphic = route2DensifiedPolyline.value;
        }
      } else {
        // 自定义飞行部分
        if (pathPointGraphicList.value.length === 0) {
          // 生成线上的点
          generatePointsAlongLine();
        }
        routeGraphic = {
          paths: [paths.value],
        };
      }
      
      // 判断是否是重新飞行或者新飞行
      if (refly.value === true || nowTime.value === 0) {
        nowTime.value = 0;
        schedule.value = 0;
      }
      
      // 设置正在飞行标志
      isFlying.value = true;
      refly.value = false;
      
      // 启动递归飞行
      window.cancelAnimationFrame(rqfId.value);
      rqfId.value = window.requestAnimationFrame(flyFrame);
    };

    // 飞行帧函数
    const flyFrame = () => {
      // 如果不再飞行，则取消动画
      if (!isFlying.value) {
        window.cancelAnimationFrame(rqfId.value);
        return;
      }
      
      let routeGraphic;
      if (f1_show.value === true) {
        // 通过 route 判断使用哪个路线图形
        if (route.value === 1) {
          routeGraphic = route1DensifiedPolyline.value;
        } else {
          routeGraphic = route2DensifiedPolyline.value;
        }
      } else {
        routeGraphic = {
          paths: [paths.value],
        };
      }
      
      // 获取路径长度
      const len = routeGraphic.paths[0].length;
      
      // 更新当前时间
      nowTime.value += 1;
      
      // 计算当前索引
      const index = Math.floor(nowTime.value / 60 * getSpeed(speed.value));
      
      // 更新进度条
      schedule.value = index;
      
      // 检查是否飞行结束
      if (index >= len) {
        isFlying.value = false;
        window.cancelAnimationFrame(rqfId.value);
        return;
      }
      
      // 获取当前点和航向
      const currentPoint = routeGraphic.paths[0][index];
      
      if (index + 1 < len) {
        const nextPoint = routeGraphic.paths[0][index + 1];
        nowHeading.value = bearing(
          currentPoint[0],
          currentPoint[1],
          nextPoint[0],
          nextPoint[1]
        );
      }
      
      // 处理视角旋转
      if (changeHeadingLeft.value) {
        nowHeading.value -= 15;
        changeHeadingLeft.value = false;
      }
      
      if (changeHeadingRight.value) {
        nowHeading.value += 15;
        changeHeadingRight.value = false;
      }
      
      // 处理俯仰角变化
      if (changeTiltUp.value) {
        nowTilt.value -= 15;
        if (nowTilt.value < 0) nowTilt.value = 0;
        changeTiltUp.value = false;
      }
      
      if (changeTiltDown.value) {
        nowTilt.value += 15;
        if (nowTilt.value > 90) nowTilt.value = 90;
        changeTiltDown.value = false;
      }
      
      // 处理高度变化
      if (changeZHigher.value) {
        nowZ.value += 50;
        changeZHigher.value = false;
      }
      
      if (changeZLower.value) {
        nowZ.value -= 50;
        if (nowZ.value < 10) nowZ.value = 10;
        changeZLower.value = false;
      }
      
      // 设置相机位置和角度
      cam.value = {
        position: [currentPoint[0], currentPoint[1], currentPoint[2] + nowZ.value],
        heading: nowHeading.value,
        tilt: nowTilt.value,
      };
      
      // 移动相机
      mapConfig.sceneView.goTo(cam.value, {
        speedFactor: 0,
        easing: "linear",
      });
      
      // 继续下一帧
      rqfId.value = window.requestAnimationFrame(flyFrame);
    };

    // 获取速度
    const getSpeed = (speed) => {
      let num;
      switch (speed) {
        case "0":
          num = 0.5;
          break;
        case "1":
          num = 0.6;
          break;
        case "2":
          num = 0.8;
          break;
        case "3":
          num = 1;
          break;
        case "4":
          num = 2;
          break;
        case "5":
          num = 3;
          break;
        default:
          num = 1;
      }
      return num;
    };

    // 计算航向角
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

    // 生成线上的点
    const generatePointsAlongLine = () => {
      // 如果自定义路径上已经有点，则清除
      if (pathPointGraphicList.value.length > 0) {
        return;
      }
      
      // 处理每个点
      for (const point of paths.value) {
        // 创建点样式
        const pointSymbol = {
          type: "simple-marker",
          color: [226, 119, 40],
          outline: {
            color: [255, 255, 255],
            width: 1
          },
          size: 5
        };
        
        // 创建点几何
        const pointGeometry = {
          type: "point",
          longitude: point[0],
          latitude: point[1],
          z: point[2]
        };
        
        // 创建点图形
        const pointGraphic = {
          geometry: pointGeometry,
          symbol: pointSymbol
        };
        
        // 添加到图层和存储
        pointGraphicLayer.value.add(pointGraphic);
        pathPointGraphicList.value.push(pointGraphic);
      }
      
      // 设置最大值
      lengthMax.value = paths.value.length - 1;
    };

    // 路线切换
    const change_view = (val, msg) => {
      schedule.value = 0;
      let routeGraphic;
      
      if (val === "1") {
        if (msg === 'init') {
          pointGraphicLayer.value.removeAll();
          pointGraphicLayer.value.add(path3_graphic.value);
        }
        routeGraphic = route1DensifiedPolyline.value;
      } else {
        if (msg === 'init') {
          pointGraphicLayer.value.removeAll();
          pointGraphicLayer.value.add(path4_graphic.value);
        }
        routeGraphic = route2DensifiedPolyline.value;
      }
      
      // 设置最大值
      lengthMax.value = routeGraphic.paths[0].length - 1;
    };

    // 墨卡托投影坐标转经纬度
    const mercatorToLoca = (mercator) => {
      const x = mercator[0];
      const y = mercator[1];
      const lon = (x / 20037508.34) * 180;
      const lat = (y / 20037508.34) * 180;
      const lat2 = (180 / Math.PI) * (2 * Math.atan(Math.exp((lat * Math.PI) / 180)) - Math.PI / 2);
      
      return [lon, lat2, 0];
    };

    // 创建草图工具
    const creatSke = () => {
      // 调整初始视角
      mapConfig.sceneView.camera.tilt = 0;
      mapConfig.sceneView.zoom = 17;
      
      // 激活绘制工具
      sketchViewModel.value.create("polyline");
      
      // 设置监听器，处理绘制完成和取消事件
      skeCreate.value = sketchViewModel.value.on("create", (event) => {
        if (event.state === "complete") {
          // 显示进度条和速度设置
          option.value = true;
          
          // 获取绘制的点坐标
          const geometryItems = pointGraphicLayer.value.graphics.items[0].geometry.paths[0];
          
          // 清空路径数组
          paths.value = [];
          
          // 转换每个点
          for (let i = 0; i < geometryItems.length; i++) {
            const mercator = geometryItems[i];
            const endItem = mercatorToLoca(mercator);
            point.value.x = endItem[0];
            point.value.y = endItem[1];
            
            // 获取高程并添加到点中
            map.value.ground
              .queryElevation(point.value, { returnSampleInfo: true })
              .then((result) => {
                const z = result.geometry.z;
                endItem[2] = z;
              });
            
            // 添加到路径数组
            paths.value.push(endItem);
          }
          
          // 移除监听器
          skeCreate.value.remove();
        }
        
        if (event.state === "cancel") {
          // 关闭进度条和速度设置
          option.value = false;
          
          // 移除监听器
          skeCreate.value.remove();
        }
      });
    };

    // 清除图形和路径
    const clean = () => {
      option.value = false;
      pointGraphicLayer.value.removeAll();
      paths.value = [];
      pathPointGraphicList.value = [];
    };

    // 返回初始视图
    const home = () => {
      mapConfig.sceneView.goTo({
        position: {
          x: 113.773052,
          y: 25.046557,
          z: 800,
        },
        tilt: 0,
        heading: 0,
      });
    };

    // 生命周期钩子
    onMounted(() => {
      createMapView();
    });

    // 组件卸载时停止动画
    onBeforeUnmount(() => {
      isFlying.value = false;
      if (rqfId.value) {
        window.cancelAnimationFrame(rqfId.value);
      }
    });

    // 返回方法和响应式状态
    return {
      path3_graphic,
      path4_graphic,
      whichRoute,
      f1_show,
      f2_show,
      map,
      mapConfig,
      schedule,
      lengthMax,
      paths3,
      paths4,
      route1DensifiedPolyline,
      route2DensifiedPolyline,
      cam,
      route,
      speed,
      tickLabels,
      pointGraphicLayer,
      pointGraphic,
      polylineGraphic,
      sketchViewModel,
      option,
      paths,
      pathPointGraphicList,
      isFlying,
      changeHeadingLeft,
      changeHeadingRight,
      changeTiltUp,
      changeTiltDown,
      changeZHigher,
      changeZLower,
      refly,
      skeTool,
      point,
      long,
      lat,
      skeCreate,
      rqfId,
      nowTime,
      nowTilt,
      nowHeading,
      nowZ,
      createMapView,
      densifyLine,
      getSchedule,
      fly_test,
      flyFrame,
      getSpeed,
      bearing,
      generatePointsAlongLine,
      change_view,
      mercatorToLoca,
      creatSke,
      clean,
      home
    };
  },
};
</script>

<style scoped>
#fly1 {
  height: calc(100vh - 50px);
  width: 100%;
  position: relative;
}
</style>