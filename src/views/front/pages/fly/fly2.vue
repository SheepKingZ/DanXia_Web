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
import { loadModules } from "esri-loader";

export default {
  data() {
    return {
      map: "",
      mapConfig: {
        container: "fly2",
        sceneView: null,
      },
      graphicsLayer: null, //绘制图层
      option: false,
      sketchViewModel: null, //绘制折线的工具
      point: null, //绘制的点转为gemory
      schedule: "0", //浏览进度的值
      Max: "10", //浏览进度的最大值
      //存储用户画的点的经纬度及高程
      paths: [],
      cam: "",
      speed: "2", //飞行速度
      tickLabels: ["0.6", "0.8", "1", "2", "4", "6", "8", "10"],
      homeCam:"",//初始视图
      ccWidget:null,//坐标控件
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
            //业务代码在此处编写
            _self.graphicsLayer = new GraphicsLayer({
              elevationInfo: { mode: "on-the-ground" },
            });
            _self.map = new Map({
              //实例化地图
              basemap: "hybrid",
              ground: "world-elevation",
              layers: [_self.graphicsLayer],
            });

            _self.mapConfig.sceneView = new SceneView({
              //实例化地图视图
              map: _self.map,
              zoom: 14,
              camera: {
                position: [113.75665604199996, 25.04682589249998, 180],
                heading: 255,
                tilt: 80,
              },
              container: _self.mapConfig.container,
            });

            _self.cam = new Camera();
            _self.homeCam = new Camera();

            //画出的线的样式
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
            _self.ccWidget = new CoordinateConversion({
              view: _self.mapConfig.sceneView,
            });
            _self.mapConfig.sceneView.ui.add(_self.ccWidget, "bottom-left");
          }
        )
        .catch((err) => {
          _self.$message("地图创建失败，" + err);
        });
    },

    //激活sketchviewModel工具
    creatSke: function () {
      const _self = this;
      //调整摄像机为俯视
      (_self.schedule = 0),
        // _self.cam = _self.mapConfig.sceneView.camera.clone();
        (_self.mapConfig.sceneView.camera.tilt = 0);
      _self.mapConfig.sceneView.zoom = 17;
      // _self.mapConfig.sceneView.goTo(_self.cam);

      _self.sketchViewModel.create("polyline");
      //设置SketchViewModel的监听状态，当绘画完成后、取消后
      const skeCreate = _self.sketchViewModel.on("create", function (event) {
        if (event.state === "complete") {
          //展开进度条以及飞行速度调节内容
          _self.option = true;
          // console.log(_self.graphicsLayer.graphics.items);
          // console.log(_self.graphicsLayer.graphics.items[0].geometry.paths[0]);
          //获得绘制的折点，并转为经纬度坐标，最后是经纬度坐标的数组[[],[]]
          const geometryItems =
            _self.graphicsLayer.graphics.items[0].geometry.paths[0];

          for (var i = 0; i < geometryItems.length; i++) {
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
          skeCreate.remove(); //断开事件侦听器的连接
        }
        if (event.state === "cancel") {
          _self.option = false; //关闭内容
          skeCreate.remove(); //断开事件侦听器的连接
        }
      });

      // 图形备份以还原已取消的更新过程
      let updatebackupgraphic;

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

          for (var i = 0; i < geometryItems.length; i++) {
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
      });
    },

    // 递归函数， 实现连续飞行方法
    // 每次执行两次view.goTo()方法，第一次会将视角转向，第二次转向后会前进到指定位置
    fly: function (i) {
      let Speed;
      Speed = this.getSpeed(this.speed);
      // console.log(Speed);
      this.Max = this.paths.length - 2;
      if (i + 1 == this.paths.length) {
        return;
      }
      console.log(this.paths);
      let startPoint = this.paths[i];
      let endPoint = this.paths[i + 1];
      let heading = this.calcHeading(
        startPoint[0],
        startPoint[1],
        endPoint[0],
        endPoint[1]
      );
      let startPointH = startPoint[2] + 100;
      let endPointH = endPoint[2] + 100;
      let tilt = this.calcTilt(
        startPoint[0],
        startPoint[1],
        startPointH,
        endPoint[0],
        endPoint[1],
        endPointH
      );
      this.schedule = i;
      // console.log("拐弯", i);
      // console.log(startPoint, endPoint);
      // console.log(heading, tilt);
      this.cam = this.mapConfig.sceneView.camera.clone();
      this.cam.heading = heading;
      this.cam.tilt = tilt;
      this.cam.position = {
        longitude: startPoint[0],
        latitude: startPoint[1],
        z: startPoint[2] + 100,
        // spatialReference: { wkid: 4326 }
      };

      this.mapConfig.sceneView
        .goTo(this.cam, {
          speedFactor: Speed,
          easing: "linear",
        })
        .then(() => {
          // console.log("前进", i);
          this.cam.position = {
            longitude: endPoint[0],
            latitude: endPoint[1],
            z: endPoint[2] + 100,
            // spatialReference: { wkid: 4326 }
          };
          return this.mapConfig.sceneView.goTo(this.cam, {
            speedFactor: 0.2,
            easing: "linear",
          });
        })
        .then(() => {
          setTimeout(() => {
            i++;
            this.fly(i);
          }, 50);//原来是1500
        });
    },

    //计算距离
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
    },

    // 计算俯仰角， 90度时平行于水平面，0度时自上向下垂直俯视， 180度时自下向上仰视
    calcTilt: function (lon1, lat1, alt1, lon2, lat2, alt2) {
      let distance = this.calcDistance(lon1, lat1, lon2, lat2);
      let angle = (Math.atan2(alt2 - alt1, distance) * 180.0) / Math.PI;
      let tilt = angle + 77;
      return tilt;
    },
    //获得飞行速度
    getSpeed: function (speed) {
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
    },

    // 墨卡托转经纬度坐标
    mercatorToLoca: function (mercator) {
      var lonlat = [];
      var x = (mercator[0] / 20037508.34) * 180;
      var y = (mercator[1] / 20037508.34) * 180;
      y =
        (180 / Math.PI) *
        (2 * Math.atan(Math.exp((y * Math.PI) / 180)) - Math.PI / 2);
      lonlat[0] = x;
      lonlat[1] = y;
      return lonlat;
    },

    //清除按钮
    clean: function () {
      const _self = this;
      _self.graphicsLayer.removeAll();
      _self.paths = [];
      _self.schedule = "0";
    },

    //回到初始视图
    home:function(){
      this.homeCam = {
                position: [113.75665604199996, 25.04682589249998, 180],
                heading: 255,
                tilt: 80,
              };
      this.mapConfig.sceneView
        .goTo(this.homeCam, {
          speedFactor: 0.3,
          easing: "linear",
        })
    }
  },
  mounted: function () {
    this._createMapView();
  },
};
</script>

<style scoped>
#fly2 {
  height: 876px;
  width: 100%;
  position: relative;
}
</style>