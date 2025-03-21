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



export default {
  data() {
    return {
  
      path3_graphic: null,
      path4_graphic: null,
      whichRoute: 1,
      
      f1_show: false,
      f2_show: false,
      map: "",
      mapConfig: {
        container: "fly1",
        sceneView: null,
      },
      schedule: "0", //浏览进度的值
      lengthMax: "10", //浏览进度的最大值
      //路线1的点
      paths3: [
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
      ],
      //路线2的点
      Paths4: [
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
      ],
      cam: "",
      route: 1, //实习路线选择框
      speed: "2", //飞行速度
      tickLabels: ["0","1", "2", "3", "4", "5"],
      pointGraphic: null, //绘制的图形
      polylineGraphic: null, //绘制的图形
      route1: null,
      route2: null,

      graphicsLayer: null, //绘制图层
      option: false,
      sketchViewModel: null, //绘制折线的工具
      
      point: null, //绘制的点转为gemory
      //存储用户画的点的经纬度及高程
      paths: [],
      homeCam: "", //初始视图
      ccWidget: null, //坐标控件
      isFlying: true,
      lat: "",
      long: "",
      pathsLayer: null,
      pathPointGraphicList: [],
      heading: null,
      oldHeading: null,

      initHeading: null,
      changeTiltUp: false,
      changeTiltDown: false,
      changeHeadingRight: false,
      changeHeadingLeft: false,
      changeZHigher:false,
      changeZLower:false,
      pointGraphicLayer: null,
      path3Camera: {
        /* position: [113.75188244098082, 25.03604345704657, 451], */
        position: {
          latitude: 25.03762606081014,
          longitude: 113.7551462604906,
          z: 700,
        },
        tilt: 70,
        heading: 240,
      },
      path4Camera: {
        /* position: [113.75426058335641, 25.04787171916136, 190], */
        position: {
          latitude: 25.04903298145219,
          longitude: 113.75673760288505,
          z: 400,
        },
        tilt: 70,
        heading: 240,
      },
      elevationSampler: null,
      turn: false,
      flyingGraphicsLayer:null,
      initPartPolylinePaths:[],
      refly:false,
      partgeometryExtent:null,
      cameraTilt:70,
      changeSchedule:false
    };
  },
  watch: {
    // 监听 heading 的变化
    heading(newVal, oldVal) {
      // 在 heading 改变时，保存前一次和当前的值
      this.oldHeading = oldVal; // 保存上一次的值
      // newVal 已经是当前的heading值
    },
  },
  methods: {
    //创建地图
    _createMapView() {
      const _self = this; //定义一个_self防止后续操作中this丢失
      const option = {
        //定义一个包含有JS API中js开发包和css样式文件的对象
        url: "https://js.arcgis.com/4.19/init.js",
        css: "https://js.arcgis.com/4.19/esri/themes/light/main.css",
      };
      //通过loadModules来做衔接
      loadModules(
        [
          "esri/Map",
          "esri/views/SceneView", //3D场景视图
          "esri/layers/SceneLayer",
          "esri/Camera",
          "esri/Graphic",
          "esri/layers/GraphicsLayer",
          "esri/layers/FeatureLayer",
          "esri/widgets/Sketch/SketchViewModel",
          "esri/geometry/Point",
          "esri/widgets/CoordinateConversion",
          "esri/geometry/Polyline",
          "esri/geometry/geometryEngine",
          "esri/layers/support/ElevationSampler",
          "esri/geometry/support/webMercatorUtils",
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
            SketchViewModel,
            Point,
            ElevationSampler,
            Polyline,
            geometryEngine,
            webMercatorUtils,
            /* CoordinateConversion, */
          ]) => {
            //业务代码在此处编写
            _self.graphicsLayer = new GraphicsLayer({
              elevationInfo: { mode: "on-the-ground" },
            });
            _self.flyingGraphicsLayer=new GraphicsLayer({
              elevationInfo: { mode: "on-the-ground" },
            });
            _self.map = new Map({
              //实例化地图
              basemap: "hybrid",
              ground: "world-elevation",
            });

            _self.mapConfig.sceneView = new SceneView({
              //准备地图视图
              map: _self.map,
              zoom: 14,
              camera: {
                /* 113.749129, 25.0346 */
                position: {
                  x: 113.773052,
                  y: 25.046557,
                  z: 800,
                },

                tilt: 70, //tilt属性值在地球视图中，相机垂直地面的方向为0，当相机平行于表面时为90度。  俗称倾斜角度
                heading: 240, //偏北角。heading值在地球视图中，以正北方向值为0，顺时针增加，如：正东方向为90，范围是0-360
              },
              /* spatialReference:{wkid:102100}, */
              container: _self.mapConfig.container,
            });
            console.log("map", _self.mapConfig.sceneView);
            _self.mapConfig.sceneView.on("immediate-click", (event) => {
              _self.mapConfig.sceneView
                .hitTest(event)
                .then((hitTestResult) => {
                  let res = hitTestResult.ground.mapPoint;
                  this.lat = res.latitude.toFixed(6);
                  this.long = res.longitude.toFixed(6);
                  console.log("camera", _self.mapConfig.sceneView.camera);
                })
                .catch((error) => {
                  console.error(error);
                });
            });

            /*  _self.mapConfig.sceneView.ui.components  = []; */ // 删除默认控件
            const sceneLayer = new SceneLayer({
              url: "https://danxiagis.top/arcgisserver/rest/services/Hosted/redDOOR_Project/SceneServer",
              popupEnabled: false, //单击图层中的要素时是否显示弹出窗口
            });
            let boder_featureLayer = new FeatureLayer({
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
            _self.map.add(boder_featureLayer);
            //将paths转为要素并加入图层
            let fields = [
              {
                name: "ObjectID",
                type: "oid",
              },
              {
                name: "name",
                type: "string",
              },
            ];
            let symbol = {
              type: "simple-line",
              color: "red",
              width: 4,
            };
            _self.pathsLayer = new FeatureLayer({
              fields,
              objectIdField: "ObjectID",
              geometryType: "polyline",
              source: [],
              spatialReference: { wkid: 102100 },
              renderer: {
                type: "simple",
                symbol,
              },
            });
            /*  //将两条path加入图层 */
            this.path3_graphic = new Graphic({
              geometry: {
                type: "polyline",
                paths: _self.paths3,
              },
              attributes: {
                ObjectID: 1,
                name: "第一天",
              },
            });

            this.path4_graphic = new Graphic({
              geometry: {
                type: "polyline",
                paths: _self.Paths4,
              },
              attributes: {
                ObjectID: 2,
                name: "第二天",
              },
            });
            this.pointGraphicLayer = new GraphicsLayer({
              spatialReference: { wkid: 102100 },
            });
            _self.map.add(this.pointGraphicLayer);
            _self.map.add(this.flyingGraphicsLayer);
            _self.pathsLayer.source.push(this.path3_graphic);
            _self.pathsLayer.source.push(this.path4_graphic);
            _self.map.add(_self.pathsLayer);
            //画出的线的样式
            _self.cam = new Camera();
            _self.homeCam = new Camera();
            _self.map.add(sceneLayer);
            //自定义中画出的线的样式
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
            //设置sketchViewModel
            _self.sketchViewModel = new SketchViewModel({
              layer: _self.graphicsLayer,
              view: _self.mapConfig.sceneView,
              polylineSymbol: line,
              snappingOptions: "selfEnabled", //捕捉自己的状态
            });
            _self.point = new Point();

            //显示此时坐标
            /* _self.ccWidget = new CoordinateConversion({
              view: _self.mapConfig.sceneView,
            });
            _self.mapConfig.sceneView.ui.add(_self.ccWidget, "bottom-left"); */
            //实例化图形和绘制图层
            _self.pointGraphic = new Graphic();
            _self.polylineGraphic = new Graphic();
            _self.nowPointGraphic=new Graphic()
            //  添加图层
            _self.map.add(_self.graphicsLayer);

            _self.route1 = new FeatureLayer({
              url: "https://danxiagis.top:6443/arcgisserver/rest/services/DanXia/practiceRoutes/FeatureServer/0",
              renderer: {
                type: "simple",
                symbol: {
                  type: "simple-line",
                  width: "5px",
                  color: "#c6c33e",
                },
              },
            });
            _self.route2 = new FeatureLayer({
              url: "https://danxiagis.top:6443/arcgisserver/rest/services/DanXia/practiceRoutes/FeatureServer/1",
              renderer: {
                type: "simple",
                symbol: {
                  type: "simple-line",
                  width: "5px",
                  color: "#c6c33e",
                },
              },
            });

            _self.mapConfig.sceneView
              .when()
              .then(function () {
                // 完成加载
                _self.elevationSampler =
                  _self.mapConfig.sceneView.groundView.elevationSampler;
                NProgress.done();
              })
              .catch(function (error) {
                console.error("地图加载出错: ", error);
                NProgress.done();
              });
          }
        )
        .catch((err) => {
          alert("地图创建失败，" + err); //catch异常
        });
    },
    getSchedule(){
      let self=this
      this.changeSchedule=true;
    
      let camera=this.mapConfig.sceneView.camera.clone()
      /* this.pathPointGraphicList[this.schedule].geometry.z=600 */
      let tar=this.pathPointGraphicList[this.schedule].geometry
      camera.position.longitude=tar.longitude
      camera.position.latitude=tar.latitude
      camera.tilt=this.cameraTilt
      
      this.mapConfig.sceneView.goTo(camera).then(()=>{
        self.fly_test(this.schedule)
      })
      
      
      
      
    },
    ZoneTo() {
      this.f1_show = true;
      this.f2_show = false;
      this.mapConfig.sceneView.goTo(this.path3Camera);
    },
    customRoute() {
      this.whichRoute = 3;
    },
    densifyLine(IF) {
      
      /* 如果点击了那个按钮 */
      if (IF) {
        this.sketchViewModel.cancel();
        this.ZoneTo();
        
      }
      
      const _self = this; //定义一个_self防止后续操作中this丢失
      const option = {
        //定义一个包含有JS API中js开发包和css样式文件的对象
        url: "https://js.arcgis.com/4.19/init.js",
        css: "https://js.arcgis.com/4.19/esri/themes/light/main.css",
      };
      //通过loadModules来做衔接
      loadModules(
        [
          "esri/geometry/geometryEngine",
          "esri/geometry/Point",
          "esri/Graphic",
          "esri/geometry/Polyline",
          "esri/layers/GraphicsLayer",
          "esri/geometry/support/webMercatorUtils",
          "esri/layers/support/ElevationSampler",
         
        ],
        option
      )
        .then(
          ([
            geometryEngine,
            Point,
            Graphic,
            Polyline,
            GraphicsLayer,
            webMercatorUtils,
            ElevationSampler,
            
          ]) => {
            this.pointGraphicLayer.removeAll();
            this.pathPointGraphicList = [];
            let paths = null;
            
            if (this.whichRoute == 3) paths = this.paths;
            else paths = this.whichRoute == 1 ? this.paths3 : this.Paths4;
            // 创建Polyline对象
            let geometry = new Polyline({
              hasZ: true,
              hasM: false,
              paths: [paths], 
              spatialReference: { wkid: 102100 }, 
            });

            let totalLength = geometryEngine.geodesicLength(geometry, "meters");

            let segLength = totalLength / 100;
            /* 返回被加密处理的点的点坐标集paths:[{lng,lat,z},{lng,lat,z}]，而不是geometry集 */
            let desifiedPolylineList = geometryEngine.densify(
              geometry,
              segLength,
              "meters"
            );
            console.log('desifiedPolylineList',desifiedPolylineList.paths);
            
            for (let i = 0; i < desifiedPolylineList.paths[0].length; i++) {
              let point = desifiedPolylineList.paths[0][i];
              let graphic = new Graphic({
                geometry: new Point({
                  x: point[0],
                  y: point[1],
                }),
                symbol: {
                  type: "simple-marker",
                  size: 2,
                  color: "green",
                  style: "circle",
                },
              });
              
             
              /* 投影，此时的graphic刚创建其geometry是4326的地理坐标系，其x、y与地理坐标系相等 */
              graphic.geometry = webMercatorUtils.geographicToWebMercator(
                graphic.geometry
              );
              this.pathPointGraphicList.push(graphic);
              /* this.path3_graphic.geometry =webMercatorUtils.geographicToWebMercator(this.path3_graphic.geometry);
            this.path4_graphic.geometry =webMercatorUtils.geographicToWebMercator(this.path4_graphic.geometry); */

              this.pointGraphicLayer.add(graphic);
            }

            _self.pathPointGraphicList.forEach((graphic) => {
              
              if (_self.elevationSampler) {
                let updatedGeometry = _self.elevationSampler.queryElevation(
                  graphic.geometry
                );
                if (updatedGeometry && updatedGeometry.z !== undefined) {
                  graphic.geometry.z = updatedGeometry.z;
                }
              } else {
                console.log("ElevationSampler未就绪");
              }
            });
            /* 给自定义线设置初始视角--为第一次和第二次下点的那条线的方向
              默认路线path3和Path4都设置了各自的camera，视角已写死
            */
           
            if(this.whichRoute==3)
            {
              let partgeometry = new Polyline({
                hasZ: true,
                hasM: false,
                paths: [this.initPartPolylinePaths], 
                spatialReference: { wkid: 102100 }, 
              })
              /* extent里面的坐标用的还是longlat，要调过来 */
                this.partgeometryExtent=webMercatorUtils.geographicToWebMercator(
                partgeometry.extent
                );
                this.moveToCustom(this.partgeometryExtent)
               
               
                 /* 弄完之后就清零，否则下一次还会有 */
                this.initPartPolylinePaths=[]
            }
            
            
            /*  */
            /* 如果使用计时器等待sceneView加载完成会导致，若切换视角后重新加载sceneView，
              不够定时器内的时间，高程会提取不出来，camera的z值变化就会出问题

              elevationSampler必须等scene加载完才不是undefined
              
              还需要外部点击，触发，
              */
           
            this.lengthMax=this.pathPointGraphicList.length
           
          }
        )
        .catch((err) => {
          console.error(err);
        });
    },
    changeCam() {
      if (this.whichRoute === "1") {
        return this.mapConfig.sceneView.goTo(this.path3Camera);
      } else if (this.whichRoute === "2") {
        return this.mapConfig.sceneView.goTo(this.path4Camera);
      }
      // 如果没有匹配的路线，返回一个解析的 Promise
      return Promise.resolve();
    },


      

    /* 点击飞行的时候，就必须调整头的朝向向前 */
     fly_test(i) {
      /* if(this.changeSchedule)
      {
        console.log('return');
        return
      } */
      this.schedule=i
      // 结束条件：当索引值 i 达到 pathPointGraphicList 的长度减一时
      if (i >= this.pathPointGraphicList.length - 1) {
        setTimeout(()=>{
          this.flyingGraphicsLayer.removeAll()
        },2000)
        return;
      }
      let currentPoint = this.pathPointGraphicList[i].geometry;
      let nextPoint = this.pathPointGraphicList[i + 1].geometry;
      
      let dy = nextPoint.latitude - currentPoint.latitude;
      let dx = nextPoint.longitude - currentPoint.longitude;
      let dz = nextPoint.z - currentPoint.z;
      /* const distance = Math.sqrt(dx * dx + dy * dy);
    
      // 计算俯仰角
      const tiltRadians = Math.atan2(dz, distance);
      const tiltDegrees = tiltRadians * (180 / Math.PI); */
      let markerSymbol = {
        type:'simple-marker',
        color: [226, 119, 40],  // RGB 颜色数组
        size: "20px", 
        style:'circle'
      };
      this.nowPointGraphic= {
      geometry: currentPoint,
      symbol: markerSymbol
    };
    /* 飞完之后或者再次点击飞行，而不是重新飞行，黄色进度条要清除， */
    this.flyingGraphicsLayer.add(this.nowPointGraphic)
      this.heading = this.calcHeading(currentPoint, nextPoint);
      /* console.log('heading',this.heading); */
      
      /* if(Math.abs(this.oldHeading-this.newHeading)>90&&i!=1)
        speed=10 */
      // 得出之差，传入 shiftCamera()
      this.mapConfig.sceneView
        .goTo(
          this.shiftCamera(
            dy,
            dx,
            dz,
            this.heading /* ,tiltDegrees */,
            currentPoint,
            nextPoint,
            
          ),
          {
            speedFactor: this.speed,
            easing: "linear",
          }
        )
        .then(async () => {
          if(this.refly){
            /* 进度清零 */
            if(this.whichRoute==3)
              await this.moveToCustom(this.partgeometryExtent)
            else
              await this.change_view()  
            
            this.refly=false
            this.fly_test(0);
          }
          // 递归调用，处理下一个路径点
          else if(this.isFlying)
            this.fly_test(i + 1);
          else 
           {
            this.isFlying=true
            return
           }
        }).catch(err=>{
         if(err.message=='Aborted')
          setTimeout(()=>{
            this.flyingGraphicsLayer.removeAll()
          },2000)
        });
    },
    /* 如果可以的话，加个鹰眼吧，显示当前路径到哪了，可能有点难哦 
    路线二第一个弯道真是见了鬼了。。。尝试过两个角的绝对值相减>90的时候满足type1，两个点的角之差的绝对值大于90意外的符合路线1呢
    先把sketch搞定吧，用sketch测试各种可能
*/
    shiftCamera(
      y_deg,
      x_deg,
      z_deg,
      heading,
      currentPoint,
      nextPoint, /* ,tiltDegrees */
   
    ) {
      const camera = this.mapConfig.sceneView.camera.clone();
      
      const smoothedHeading = this.lerpAngle(this.heading, heading, 0.8);
      camera.target=[currentPoint.x,currentPoint.y]
      //转弯的临界在哪里啊啊啊啊啊啊啊啊啊
      /* if(this.oldHeading!=null&&Math.abs(this.oldHeading - this.heading)>45)
      {
        camera.heading = smoothedHeading;
        
        console.log(
            `Heading changed from ${this.oldHeading} to ${this.heading}`
        );
        
      } */

      
      camera.position.longitude += x_deg*1.2  ;
      camera.position.latitude += y_deg *1.1;
      /* camera.position.z += z_deg*1.3; */
      /* camera.tilt=tiltDegrees */
      let titlAdd = 15;
      /* let initHeading=camera.heading */
      if (this.changeHeadingLeft == true) {
        camera.heading -= 15;
        this.changeHeadingLeft = false;
        /* console.log("现在现在", camera.heading); */
      } else if (this.changeHeadingRight == true) {
        camera.heading += 15;
        this.changeHeadingRight = false;
      }

      if (this.changeTiltUp == true) {
        if (camera.tilt + titlAdd >= 90) titlAdd = 0;
        camera.tilt += titlAdd;
        this.changeTiltUp = false;
      } else if (this.changeTiltDown == true) {
        if (camera.tilt - titlAdd <= 0) titlAdd = 0;
        camera.tilt -= titlAdd;
        this.changeTiltDown = false;
      }

      if(this.changeZHigher==true)
      {
        camera.position.z+=50
        this.changeZHigher=false
      }else if(this.changeZLower==true)
      {
        camera.position.z-=50
        this.changeZLower=false
      }
      /* console.log('camera.heading',camera.heading); */
      return camera;
    },

    change_view(e,isInit) {
      this.whichRoute = e;
      
      if (e == "1") {
        this.cam = this.path3Camera;
      } else if (e == "2") {
        this.cam = this.path4Camera;
      }
      
      return this.mapConfig.sceneView
        .goTo(this.cam)
        .then(() => {
          console.log("已经移动到");
          this.schedule=0
          if(isInit)
            this.densifyLine();
          return 'ok'
        })
        .catch((err) => {
          console.log("移动到 path4Camera 失败:", err,this.cam);
          return Promise.reject(new Error('fail'))
        });
    },
    //激活sketchviewModel工具
    creatSke() {
      const option = {
        //定义一个包含有JS API中js开发包和css样式文件的对象
        url: "https://js.arcgis.com/4.19/init.js",
        css: "https://js.arcgis.com/4.19/esri/themes/light/main.css",
      };
      loadModules(["esri/geometry/support/webMercatorUtils"], option).then(
        ([webMercatorUtils]) => {
          const _self = this;

          _self.sketchViewModel.create("polyline");
          //设置SketchViewModel的监听状态，当绘画完成后、取消后
          /* 先清除，不然每次画的点都被重复push进paths */
          _self.clean()
          _self.paths=[]
          const skeCreate = _self.sketchViewModel.on(
            "create",
            function (event) {
              /* 绑定create后就开始绘制了 */
              console.log('666');
              
              if (event.state === "complete") {
                /* 双击完成了 */
                //展开进度条以及飞行速度调节内容
                _self.option = true;
                
                const geometryItems =
                  _self.graphicsLayer.graphics.items[0].geometry.paths[0];

                console.log(
                  "geometrItem",
                  _self.graphicsLayer.graphics.items[0].geometry
                );
                for (let i = 0; i < geometryItems.length; i++) {
                  
                  const endItem = geometryItems[i]
                 
                  _self.point.x = endItem[0];
                  _self.point.y = endItem[1];
                  // console.log(_self.point);
                  //获得高程数据并加入到数组种
                  /* _self.map.ground
                      .queryElevation(_self.point, { returnSampleInfo: true })
                      .then(function (result) {
                        const z = result.geometry.z;
                        endItem[2] = z;
                        
                      }); */
                    /* 将xy坐标转为地理坐标，这样才能得到paths去加密 */
                  let tpoi=webMercatorUtils.xyToLngLat(endItem[0],endItem[1]) 
                  if(i==0||i==1)
                  {
                    _self.initPartPolylinePaths.push(tpoi)
                    
                  }
                  
                  _self.paths.push(tpoi);
                }
                
                skeCreate.remove(); //断开事件侦听器的连接
                _self.customRoute();
                _self.densifyLine();
              }
              if (event.state === "cancel") {
                _self.option = false; //关闭内容
                skeCreate.remove(); //断开事件侦听器的连接
              }
            }
          );

          // 图形备份以还原已取消的更新过程
          /* let updatebackupgraphic;

const skeUp = _self.sketchViewModel.on("update", function (event) {
  if (event.state === "start") {
    updatebackupgraphic = event.graphics[0].clone();
    _self.paths = [];
  }
  if (event.state === "complete") {
    if (event.aborted) {
      _self.graphicsLayer.removeAll();
      // 在开始更新过程之前还原到图形
      _self.graphicsLayer.remove(event.graphics[0]);
      _self.graphicsLayer.add(updatebackupgraphic);
    }
    //展开内容
    _self.option = true;
    // console.log(_self.graphicsLayer.graphics.items);
    // console.log(_self.graphicsLayer.graphics.items[0].geometry.paths[0]);
    //获得绘制的折点，并转为经纬度坐标，最后是经纬度坐标的数组[[],[]]
    const geometryItems =
      _self.graphicsLayer.graphics.items[0].geometry.paths[0];

    for (let i = 0; i < geometryItems.length; i++) {
      const mercator = geometryItems[i];
      const endItem = _self.mercatorToLoca(mercator);
      _self.point.x = endItem[0];
      _self.point.y = endItem[1];
      // console.log(_self.point);
      //获得高程数据并加入到数组种
      _self.map.ground
        .queryElevation(_self.point, { returnSampleInfo: true })
        .then(function (result) {
          const z = result.geometry.z;
          endItem[2] = z;
        });
      _self.paths.push(endItem);
    }
    // console.log(_self.paths);
    skeUp.remove(); //断开事件侦听器的连接
  }
}); */
        }
      );
    },
    /* 线密化完后，移动到此处 */
    // moveToCustom 方法优化，确保 goTo 完成后再执行后续逻辑
  moveToCustom(polylineExtent){
    if (this.whichRoute === 3) {
      console.log('marme1',this.mapConfig.sceneView.camera);
      const first = this.pathPointGraphicList[0].geometry;
      const second = this.pathPointGraphicList[1].geometry;
      const heading = this.calcHeading(first, second);
      /* 直接return goTo才行，不然无法打断正在执行的goTo
        这样就是直接返回goTo，等goTo执行完才做后面的
      */
      return this.mapConfig.sceneView.goTo({
        target: polylineExtent,
        tilt: this.cameraTilt,
        heading
      }).then(() => {
        return 'ok'; // 确保返回 Promise
      }).catch((error) => {
        console.error('Error in goTo:', error);
        return Promise.reject(error);
      });
    }
  }
,
    lerpAngle(currentAngle, targetAngle, fraction) {
      let diff = targetAngle - currentAngle;
      if (diff < -180) diff += 360;
      if (diff > 180) diff -= 360;
      return currentAngle + diff * fraction;
    },
    // 计算两点间的方向角，
    calcHeading(pointA, pointB) {
      let x1=pointA.longitude
      let x2=pointB.longitude
      let y1=pointA.latitude
      let y2=pointB.latitude
      let y = Math.sin(x2 - x1) * Math.cos(y2);
      let x = Math.cos(y1) * Math.sin(y2) -
              Math.sin(y1) * Math.cos(y2) * Math.cos(x2 - x1);
      let bearing = Math.atan2(y, x) * (180 / Math.PI);
      bearing = (bearing + 360) % 360;  // 规范化到0-360度
      return bearing;
/*    
      atan2不行，因为atan2是以原点（0，0）为原点
      而偏北角以北方为原点，camera的heading也是如此
      所以要计算偏北角
    // detaily,detailx(y是lat，x是long)
      const angleRadians = Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x);
      const angleDegrees = angleRadians * (180 / Math.PI);
      // 不进行标准化，直接返回原始角度，正左转，负右转
      // console.log('angleDer两点的方向',angleDegrees); 
      return angleDegrees; */
    },

    /* //沿着偏北角的方向向后退
    calcReturn(lon, lat, bearing) {
      if (bearing < 90 || bearing >= 0) {
        lon = lon - 0.00214583333 * Math.cos((bearing * Math.pI) / 180.0);
        lat = lat - 0.00163888889 * Math.sin((bearing * Math.pI) / 180.0);
      } else if (bearing >= 90 || bearing < 180) {
        lon =
          lon + 0.00214583333 * Math.cos(((180.0 - bearing) * Math.pI) / 180.0);
        lat =
          lat - 0.00163888889 * Math.sin(((180.0 - bearing) * Math.pI) / 180.0);
      } else if (bearing >= 180 || bearing < 270) {
        lon =
          lon + 0.00214583333 * Math.cos(((270.0 - bearing) * Math.pI) / 180.0);
        lat =
          lat + 0.00163888889 * Math.sin(((270.0 - bearing) * Math.pI) / 180.0);
      } else if (bearing >= 270) {
        lon =
          lon - 0.00214583333 * Math.cos(((360.0 - bearing) * Math.pI) / 180.0);
        lat =
          lat + 0.00163888889 * Math.sin(((360.0 - bearing) * Math.pI) / 180.0);
      }
      return lon, lat;
    }, */

    /*  // fly2计算俯仰角， 90度时平行于水平面，0度时自上向下垂直俯视， 180度时自下向上仰视
    calcTilt2(lon1, lat1, alt1, lon2, lat2, alt2) {
      let distance = this.calcDistance(lon1, lat1, lon2, lat2);
      let angle = (Math.atan2(alt2 - alt1, distance) * 180.0) / Math.PI;
      let tilt = angle + 60; // 初版77
      return tilt;
    },
    // 计算俯仰角， 90度时平行于水平面，0度时自上向下垂直俯视， 180度时自下向上仰视
    calcTilt(lon1, lat1, alt1, lon2, lat2, alt2) {
      let distance = this.calcDistance(lon1, lat1, lon2, lat2);
      let angle = (Math.atan2(alt2 - alt1, distance) * 180.0) / Math.PI;
      let tilt = angle - 44;
      return tilt;
    }, */

    //获得新的路径点
    //获得飞行速度
    getSpeed(speed) {
      if (speed == 1) {
        return 1;
      } else if (speed == 2) {
        return 2;
      } else if (speed == 3) {
        return 3;
      } else if (speed == 4) {
        return 4;
      } else if (speed == 5) {
        return 5;
      }
    },
    //获得飞行路线
    getPaths(value) {
      if (value == 1) {
        return this.paths3;
      } else if (value == 2) {
        return this.Paths4;
      }
    },

    // 创建图形
    createGeometry(x, y) {
      this.graphicsLayer.removeAll();
      let point = {
        type: "point",
        x: x,
        y: y,
      };
      //飞行点
      this.pointGraphic = {
        geometry: point,
        symbol: {
          type: "simple-marker",
          color: "blue",
          size: 12,
          outline: {
            width: 1,
            color: "white",
          },
        },
      };
      this.graphicsLayer.add(this.pointGraphic);
    },

    //添加飞行路线图层
    changeRoute(value) {
      if (this.map.layers.items.length > 2) {
        this.map.remove(this.map.layers.items[2]);
      }
      if (value == 1) {
        this.map.add(this.route1);
      } else if (value == 2) {
        this.map.add(this.route2);
      }
    },

    //清除按钮
    clean(){
      this.schedule = 0;
      this.graphicsLayer.removeAll();
      this.pointGraphicLayer.removeAll()
      this.pathPointGraphicList = [];
      this.flyingGraphicsLayer.removeAll()
      
    },

    //回到初始视图
    home() {
      if(this.partgeometryExtent)
        this.moveToCustom(this.partgeometryExtent)
      else
      {
        this.homeCam = {
        position: [113.75665604199996, 25.04682589249998, 180],
        heading: 255,
        tilt: 80,
      };
      this.mapConfig.sceneView.goTo(this.homeCam, {
        speedFactor: 0.3,
        easing: "linear",
      });
      }
    },
  },
  //  mounted 是实例创建期间的最后一个生命周期, 当执行完mounted 就表示,实例已经被完全创建好了
  mounted() {
    NProgress.start();
    this._createMapView();
  },
  beforeDestroy() {
    // 组件销毁前的逻辑
    NProgress.remove();
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