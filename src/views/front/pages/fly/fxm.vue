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
export default {
  data() {
    return {
      map: "",
      mapConfig: {
        container: "fly1",
        sceneView: null,
      },
      schedule: "0", //浏览进度的值
      Max: "10", //浏览进度的最大值
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
      tickLabels: ["0.6", "0.8", "1", "2", "4", "6", "8", "10"],
      gLayer: null, //绘制图层
      pointGraphic: null, //绘制的图形
      polylineGraphic: null, //绘制的图形
      route1: null,
      route2: null,
    };
  },
  methods: {
    //创建地图
    _createMapView: function () {
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
            //业务代码在此处编写
            _self.map = new Map({
              //实例化地图
              basemap: "hybrid",
              ground: "world-elevation",
            });

            _self.mapConfig.sceneView = new SceneView({
              //实例化地图视图
              map: _self.map,
              zoom: 14,
              camera: {
                position: {
                  x: 113.773052,
                  y: 25.046557,
                  z: 800,
                },
                tilt: 80, //设置相机的tilt属性。tilt属性值在地球视图中，相机垂直地面的方向为0，当相机平行于表面时为90度。
                heading: 245, //设置相机的heading属性。heading值在地球视图中，以正北方向值为0，顺时针增加，如：正东方向为90，范围是0-360
              },
              container: _self.mapConfig.container,
            });
            const sceneLayer = new SceneLayer({
              url: "https://baobo.scaugis.top/arcgisserver/rest/services/Hosted/redDOOR_Project/SceneServer",
              popupEnabled: false,
            });
            _self.cam = new Camera();
            _self.map.add(sceneLayer);

            //实例化图形和绘制图层
            _self.pointGraphic = new Graphic();
            _self.polylineGraphic = new Graphic();
            _self.gLayer = new GraphicsLayer();
            _self.map.add(_self.gLayer);

            _self.route1 = new FeatureLayer({
              url: "https://baobo.scaugis.top/arcgisserver/rest/services/DanXia/practiceRoutes/FeatureServer/0",
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
              url: "https://baobo.scaugis.top/arcgisserver/rest/services/DanXia/practiceRoutes/FeatureServer/1",
              renderer: {
                type: "simple",
                symbol: {
                  type: "simple-line",
                  width: "5px",
                  color: "#c6c33e",
                },
              },
            });
          }
        )
        .catch((err) => {
          _self.$message("地图创建失败，" + err);
        });
    },
    // 递归函数， 实现连续飞行方法
    // 每次执行两次view.goTo()方法，第一次会将视角转向，第二次转向后会前进到指定位置
    fly: function (i) {
      let paths, Speed;
      Speed = this.getSpeed(this.speed);
      // console.log(Speed);
      paths = this.getPaths(this.route);
      this.Max = paths.length - 2;
      if (i + 1 == paths.length) {
        return;
      }
      // console.log(paths);
      let startPoint = paths[i];
      let endPoint = paths[i + 1];
      let heading = this.calcHeading(
        startPoint[0],
        startPoint[1],
        endPoint[0],
        endPoint[1]
      );
    
      this.schedule = i;
      // console.log("拐弯", i);
      // console.log(startPoint, endPoint);
      // console.log(heading, tilt);
      this.cam = this.mapConfig.sceneView.camera.clone();
      this.cam.heading = heading;
      this.cam.tilt = 0;
      this.cam.position = {
        longitude: startPoint[0],
        latitude: startPoint[1],
        z: 2000,
        // spatialReference: { wkid: 4326 }
      };
      this.createGeometry(startPoint[0], startPoint[1]);
      this.mapConfig.sceneView
        .goTo(this.cam, {
          speedFactor: Speed,
          easing: "linear",
        })
        // .goTo({target:[startPoint[0],startPoint[1]],heading:heading,tilt:75,speedFactor: Speed,easing: "linear",zoom:19})
        .then(() => {
          // console.log("前进", i);
          this.cam.position = {
            longitude: endPoint[0],
            latitude: endPoint[1],
            z: 2000,
            // spatialReference: { wkid: 4326 }
          };
          return this.mapConfig.sceneView.goTo(this.cam, {
            speedFactor: 0.3,
            easing: "linear",
          });
          // return this.mapConfig.sceneView.goTo({target:[endPoint[0],endPoint[1]],heading:heading,tilt:75,speedFactor: 0.5,easing: "in-cubic",zoom:19});
        })
        .then(() => {
          setTimeout(() => {
            i++;
            this.fly(i);
          }, 1000);
        });
    },
    calcDistance: function (lon1, lat1, lon2, lat2) {
      let radlat1 = (lat1 * Math.PI) / 180.0;
      let radlat2 = (lat2 * Math.PI) / 180.0;
      let a = radlat1 - radlat2;
      let b = (lon1 * Math.PI) / 180.0 - (lon2 * Math.PI) / 180.0;
      let distance =
        2 *
        6378137.0 *
        Math.asin(
          Math.sqrt(
            Math.pow(Math.sin(a / 2), 2) +
              Math.cos(radlat2) *
                Math.cos(radlat2) *
                Math.pow(Math.sin(b / 2), 2)
          )
        );
      return distance;
    },

    // 计算偏北角，0指向正北，90指向正东，顺时针旋转
    calcHeading: function (lon1, lat1, lon2, lat2) {
      let radlat1 = (lat1 * Math.PI) / 180.0;
      let radlat2 = (lat2 * Math.PI) / 180.0;
      let radlon1 = (lon1 * Math.PI) / 180.0;
      let radlon2 = (lon2 * Math.PI) / 180.0;
      let y = Math.sin(radlon2 - radlon1) * Math.cos(radlat2);
      let x =
        Math.cos(radlat1) * Math.sin(radlat2) -
        Math.sin(radlat1) * Math.cos(radlat2) * Math.cos(radlon2 - radlon1);
      let bearing = (Math.atan2(y, x) * 180.0) / Math.PI;
      return bearing < 0 ? bearing + 360.0 : bearing;
    },

    //沿着偏北角的方向向后退
    calcReturn: function (lon, lat, bearing) {
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
    },

    //经纬度转墨卡托投影坐标
    lonlatTomercator: function (lonlat) {
      var mercator = [];
      var x = (lonlat[0] * 20037508.34) / 180;
      var y =
        Math.log(Math.tan(((90 + lonlat[1]) * Math.PI) / 360)) /
        (Math.PI / 180);
      y = (y * 20037508.34) / 180;
      mercator.push(x, y);
      return mercator;
    },

    // 计算俯仰角， 90度时平行于水平面，0度时自上向下垂直俯视， 180度时自下向上仰视
    calcTilt: function (lon1, lat1, alt1, lon2, lat2, alt2) {
      let distance = this.calcDistance(lon1, lat1, lon2, lat2);
      let angle = (Math.atan2(alt2 - alt1, distance) * 180.0) / Math.PI;
      let tilt = angle - 44;
      return tilt;
    },

    //获得新的路径点
    //获得飞行速度
    getSpeed: function (speed) {
      if (speed == 0) {
        return 0.6;
      } else if (speed == 1) {
        return 0.8;
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
    },
    //获得飞行路线
    getPaths: function (value) {
      if (value == 1) {
        return this.paths3;
      } else if (value == 2) {
        return this.Paths4;
      }
    },

    // 创建图形
    createGeometry: function (x, y) {
      this.gLayer.removeAll();
      let point = {
        type: "point",
        x: x,
        y: y,
      };
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
      this.gLayer.add(this.pointGraphic);
    },

    //添加飞行路线图层
    changeRoute: function (value) {
      if(this.map.layers.items.length > 2){
        this.map.remove(this.map.layers.items[2]);
      }
      if (value == 1) {
        this.map.add(this.route1);
      } else if (value == 2) {
        this.map.add(this.route2);
      }
    },
  },
  mounted: function () {
    this._createMapView();
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