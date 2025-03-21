<template>
  <div>
    <div id="sectionLine">
      <div class="esri-ui-top-right esri-ui-corner">
        <v-card min-width="400px" color="rgba(255, 255, 255, 0.7)">
          <v-card-title> 剖面线 </v-card-title>
          <div id="echartDiv" v-show="option"></div>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="primary" depressed tile @click="creatSke"
              >自定义绘制</v-btn
            >
            <v-btn color="primary" depressed tile @click="collectRoutes" v-show="isstudent"
              >使用采集路线</v-btn
            >
            <v-btn color="primary" depressed tile @click="Remove"
              >清空</v-btn
            >
            <v-btn color="primary" depressed tile @click="downloadRoutes" v-show="false"
              >下载采集路线</v-btn
            >
            <v-btn v-model="option" fab color="primary" @click="zoombtn" small>
              <v-icon v-if="option"> mdi-arrow-collapse </v-icon>
              <v-icon v-else> mdi-arrow-expand </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { loadModules } from "esri-loader";
import * as echarts from "echarts";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css';
export default {
  data() {
    return {
      c_flag:false,
      map: "",
      mapConfig: {
        container: "sectionLine",
        mapView: null,
      },
      graphicsLayer: null, //几何图层
      pointList: [], //记录剖面线的每一个结点
      polyline: null, //绘制的线
      sketchViewModel: null, //绘制折线的工具
      lengthArray: [],
      RoutesfeatureLayer: null, //采集的道路数据
      highlighSelect: "", //选中的目标
      routeSelect: "", //路线的监听事件
      option: false, //折线图的可见性
      chart: null, //echar折线图
      isstudent:true,//是否可以使用采集路线
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
          "esri/views/MapView",
          "esri/layers/GraphicsLayer",
          "esri/widgets/Sketch/SketchViewModel",
          "esri/geometry/Polyline",
          "esri/layers/FeatureLayer",
        ],
        option
      )
        .then(
          ([
            Map,
            MapView,
            GraphicsLayer,
            SketchViewModel,
            Polyline,
            FeatureLayer,
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

            _self.mapConfig.mapView = new MapView({
              //实例化地图视图
              map: _self.map,
              zoom: 14,
              center: [113.754555, 25.026711],

              container: _self.mapConfig.container,
            });
            _self.mapConfig.mapView.when().then(function() {
                // 完成加载
                NProgress.done();
            }).catch(function(error) {
                console.error("地图加载出错: ", error);
                NProgress.done();
            });
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
            _self.map.add(boder_featureLayer);
            //画出的线的样式
            const line = {
              type: "simple-line",
              color: 'cyan',
              width: 2,
            };

            //设置sketchViewModel
            _self.sketchViewModel = new SketchViewModel({
              layer: _self.graphicsLayer,
              view: _self.mapConfig.mapView,
              polylineSymbol: line,
              snappingOptions: "selfEnabled", //捕捉自己的状态
            });

            //绘制的线
            _self.polyline = new Polyline();

            //创建采集的道路注记样式
            const labelClass = {
              symbol: {
                type: "text",
                color: "white",
                font: {
                  family: "Playfair Display",
                  size: 12,
                  weight: "bold",
                },
              },
              labelPlacement: "center-along",
              labelPosition: "curved",
              repeatLabel: "true", //重复标签
              repeatDistanceLabel: 100,
              labelExpressionInfo: {
                expression: "$feature.name",
              },
            };

            const routesURL =
              "https://danxiagis.top:6443/arcgis/rest/services/DanXia/myRoutes/FeatureServer/" +
              _self.$store.getters.group_id;
            console.log(routesURL);
            _self.RoutesfeatureLayer = new FeatureLayer({
              url: routesURL,
              labelingInfo: [labelClass],
              renderer: {
                type: "simple",
                symbol: {
                  type: "simple-line",
                  width: "5px",
                  color: "#3073c0",
                },
              },
            });
          }
        )
        .catch((err) => {
          _self.$message("地图创建失败，" + err);
        });
    },
    //激活sketchviewModel工具
    creatSke: function () {
      this.c_flag=false;
      const _self = this;
      _self.graphicsLayer.removeAll();
      _self.sketchViewModel.create("polyline");
      //关闭道路的监听
      if (_self.routeSelect) {
        _self.routeSelect.remove();
      }
      //移除道路和高亮
      _self.map.remove(_self.RoutesfeatureLayer);
      if (_self.highlighSelect) {
        _self.highlighSelect.remove();
      }
      //设置SketchViewModel的监听状态，当绘画完成后、取消后
      const skeCreate = _self.sketchViewModel.on("create", function (event) {
        if (event.state === "complete") {
          // console.log(_self.graphicsLayer);
          // console.log(_self.graphicsLayer.graphics.items[0].geometry.paths[0]);
          _self.polyline = _self.graphicsLayer.graphics.items[0].geometry;
          _self.drawProfile(_self.polyline);
          skeCreate.remove(); //断开事件侦听器的连接
        }
        if (event.state === "cancel") {
          skeCreate.remove(); //断开事件侦听器的连接
        }
      });

      // 图形备份以还原已取消的更新过程
      let updatebackupgraphic;

      const skeUp = _self.sketchViewModel.on("update", function (event) {
        if (event.state === "start") {
          updatebackupgraphic = event.graphics[0].clone();
        }
        if (event.state === "complete") {
          if (event.aborted) {
            _self.graphicsLayer.removeAll();
            // 在开始更新过程之前还原到图形
            _self.graphicsLayer.remove(event.graphics[0]);
            _self.graphicsLayer.add(updatebackupgraphic);
          }
          skeUp.remove(); //断开事件侦听器的连接
        }
      });
    },

    //添加该组同学采集的路线数据，并监听地图上的点击事件
    collectRoutes: function () {
      this.c_flag=true;
      const _self = this;
      _self.graphicsLayer.removeAll();
      _self.sketchViewModel.complete();
      //添加道路数据
      _self.map.add(_self.RoutesfeatureLayer);
      //道路数据的范围很奇怪，用fullExtent方法反而看不出来在哪里，所以选择回到初始视角
      _self.RoutesfeatureLayer.when(function () {
        //   _self.mapConfig.mapView.extent = _self.RoutesfeatureLayer.fullExtent;
        _self.mapConfig.mapView.zoom = 14;
        _self.mapConfig.mapView.center = [113.754555, 25.026711];
      });
      //添加地图上的点击监听事件
      _self.routeSelect = _self.mapConfig.mapView.on(
        "pointer-down",
        _self.changeRoute
      );
    },
    downloadRoutes:function(){

    },
    changeRoute: function (event) {
      const _self = this;
      const opts = { include: _self.map.RoutesfeatureLayer };
      _self.graphicsLayer.removeAll();
      _self.mapConfig.mapView.hitTest(event, opts).then(function (response) {
        // console.log(response);
        const routeGraphic = response.results[0].graphic;
        if (_self.highlighSelect) {
          _self.highlighSelect.remove();
        }
        //高亮显示，视图移动到选中的点
        _self.highlighSelect =
          _self.mapConfig.mapView.allLayerViews.items[2].highlight(
            routeGraphic.attributes["objectid"]
          );
        _self.mapConfig.mapView.goTo({
          target: routeGraphic.geometry,
        });
        _self.drawProfile(routeGraphic.geometry);
      });
    },

    drawProfile: function (polyline) {
      // console.log("nihao333");
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
        ],
        option
      ).then(([geometryEngine, Point, Graphic, Polyline]) => {
        //1.对绘制的线进行结点加密
        var totalLength = geometryEngine.geodesicLength(polyline, "meters");
        var segLength = totalLength / 50;
        var desifiedPolyline = geometryEngine.densify(
          polyline,
          segLength,
          "meters"
        );
        //把加密后的每一个结点在地图中进行展示
        //只显示一头一尾两个点
        for(let i=0;i<2;i++){
          if(i!=0)
            i=desifiedPolyline.paths[0].length-1
          let point=desifiedPolyline.paths[0][i]
          var graphic = new Graphic({
              geometry: new Point({
                x: point[0],
                y: point[1],
                spatialReference: _self.mapConfig.mapView.spatialReference,
              }),
              symbol: {
                type: "simple-marker",
                size: 10,
                color: "coral",
                style: "circle",
              },
            });
            _self.graphicsLayer.add(graphic);
        }

        //初始化echar图
        _self.chart = echarts.init(document.getElementById("echartDiv"));
        //折线框出现
        _self.option = true
        //设置加载动画
        _self.chart.showLoading({
          text: "正在加载数据",
        });
        //2.提取加密后的线的每一个结点的高程值
        _self.map.ground
          .queryElevation(desifiedPolyline)
          .then(function (result) {
            var zArray = result.geometry.paths[0].map((point) => {
              return point[2].toFixed(2);
            });
            
            //desifiedPolyline.paths[0]是所有的点
            var segCount = desifiedPolyline.paths[0].length - 1;
            _self.lengthArray = [];
            _self.pointList = [];
            for (var i = 0; i <= segCount; i++) {
              var vertices = desifiedPolyline.paths[0].slice(0, i + 1);
              var segment = new Polyline({
                paths: vertices,
                spatialReference: _self.mapConfig.mapView.spatialReference,
              });
              var length = geometryEngine
                .geodesicLength(segment, "meters")
                .toFixed(0)
                .toString();
              _self.lengthArray.push(length);
              _self.pointList.push({
                name: length,
                geometry: new Point({
                  x: vertices[i][0],
                  y: vertices[i][1],
                  spatialReference: _self.mapConfig.mapView.spatialReference,
                }),
              });
            }
            var data = {
              x: _self.lengthArray,
              y: zArray,
            };
            _self.chart.hideLoading(); //关闭加载动画
            _self.createChart(data);
          });
      });
    },
    Remove(){
        this.graphicsLayer.removeAll()
        this.option = false
        
    },
    createChart: function (data) {
      var option1 = {
        tooltip: {
          trigger: "axis",
          formatter: "海拔：{c}米",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: data.x,
          name: "距离（单位：米）",
          nameLocation: "center",
          nameGap: 30,
        },
        yAxis: {
          type: "value",
          name: "海拔（单位：米）",
          nameLocation: "center",
          nameGap: 40,
          min: function (value) {
            return Math.floor(value.min / 100) * 100;
          },
        },
        series: [
          {
            data: data.y,
            type: "line",
          },
        ],
        // download as img
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              show: true,
              excludeComponents: ["toolbox"],
              pixelRatio: 2,
            },
          },
        },
      };
      this.chart.setOption(option1);
      
    },
    zoombtn:function(){
      this.option =! this.option;
    }
  },
  created(){  
    if(sessionStorage.isteacher=='true'||sessionStorage.isvisiter=='true'){
      this.isstudent=false
    }
  },
  mounted: function () {
    NProgress.start();
    this._createMapView();
    
    // console.log(sessionStorage)
  },
  
  beforeDestroy() {
    // 组件销毁前的逻辑
    NProgress.remove(); 
  }
};
</script>

<style scoped>
#sectionLine {
  height:  calc(100vh - 50px);
  width: 100%;
  position: relative;
}
#echartDiv {
  width: 600px;
  height: 360px;
  background-color: rgba(250, 250, 250, 0.5);
}
</style>