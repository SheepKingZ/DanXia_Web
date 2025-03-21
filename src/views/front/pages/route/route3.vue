<template>
  <v-card tile>
    <v-row justify="space-between" no-gutters>
      <!-- 点列表 -->
      <v-col md="auto">
        <v-navigation-drawer
          v-model="drawer"
          :mini-variant.sync="mini"
          permanent
        >
          <v-list-item class="px-2">
            <v-list-item-title>实习点</v-list-item-title>
            <v-btn icon @click.stop="mini = !mini">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
          </v-list-item>

          <v-divider></v-divider>

          <v-list flat>
            <v-list-item-group v-model="selectedItem" color="primary">
              <v-list-item
                v-for="(item, i) in items"
                :key="i"
                @click="onListClickHandler"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="item"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-navigation-drawer>
      </v-col>
      <!-- 地图容器 -->
      <v-col>
        <div id="route3">
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
      </v-col>
      <!-- 点详情按钮 -->
      <v-col md="auto">
        <v-btn
          @click.stop="anmini = !anmini"
          top
          left
          fab
          color="primary"
          small
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-col>
      <!-- 点详情 -->
      <v-col md="auto">
        <v-navigation-drawer
          v-model="andrawer"
          :mini-variant.sync="anmini"
          mini-variant-width="0px"
          permanent
          right
        >
          <v-card max-width="620px" tile>
            <v-card-title>
              {{ pointTitle }}
            </v-card-title>

            <v-divider></v-divider>

            <v-simple-table>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <td>简介</td>
                    <td>{{ pointIntroduce }}</td>
                  </tr>
                  <tr v-for="item in desserts" :key="item.name">
                    <td>{{ item.name }}</td>
                    <td>{{ item.calories }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-slide-group
              v-model="model"
              class="pa-4"
              center-active
              show-arrows
            >
              <v-slide-item
                v-for="(item, i) in pointItems"
                :key="i"
                v-slot="{ toggle }"
              >
                <v-img
                  :src="item.src"
                  class="ma-4"
                  height="100"
                  width="150"
                  @click="
                    toggle;
                    clickLocation(i);
                  "
                >
                </v-img>
              </v-slide-item>
            </v-slide-group>

            <div class="video">
              <div v-if="srcvideo === ''"></div>
              <video-player
                v-else
                ref="videoPlayer"
                class="video-player vjs-custom-skin"
                :playsinline="true"
                :options="playerOptions"
                @play="onPlayerPlay($event)"
                @pause="onPlayerPause($event)"
              />
            </div>
          </v-card>
        </v-navigation-drawer>
      </v-col>
    </v-row>
    <!-- 图片放大 -->
    <template>
      <div>
        <viewer
          ref="viewer"
          :images="pointItems"
          @inited="inited"
          style="display: none"
          v-if="viewer1"
          rebuild
        >
          <img v-for="(src, index) in pointItems" :key="index" :src="src.src" />
        </viewer>
      </div>
    </template>
  </v-card>
</template>

<script>
import { loadModules } from "esri-loader";
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      map: "",
      mapConfig: {
        container: "route3",
        mapView: null,
      },
      graphics: "",
      highlighSelect: "",
      pointTitle: "",
      desserts: [], //存储表格内容
      selectedItem: 0,
      items: [], //存储点列表
      drawer: true,
      mini: false, //控制点列表是否伸出
      andrawer: true,
      anmini: true, //控制点详情是否伸出
      model: null,
      pointItems: [], //存储相应点的图片
      viewer1: false, //图片大图查看
      picModel: 0, //控制放大的图片显示的是第几张
      i: 0, //监控这是第几次开始点击图片查看大图
      srcvideo: "", //视频地址
      //控制视频的相关详情
      playerOptions: {
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
      },
      //控制点闪烁的graphic
      pointGraphic: "",
      pointGraphicLayer: "", //闪烁点的graphicLayer图层
      horizontalLine: false, //控制水平虚线是否可见
      verticalLine: false, //控制垂直虚线是否可见
      pointIntroduce: null, //点简介
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
        // url: "http://localhost:9999/4.18/init.js",
        // css: "http://localhost:9999/4.18/esri/themes/light/main.css",
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
                "http://{subDomain}.tianditu.gov.cn/vec_c/esri/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=94a9c789edc5d02e50a129a2276d3ab7",
              subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
              tileInfo,
              spatialReference,
            });
            const basemap = new Basemap({
              baseLayers: [webTileLayer],
            });
            _self.map = new Map({
              //实例化地图
              basemap,
              ground: "world-elevation",
            });

            _self.mapConfig.mapView = new MapView({
              //实例化地图视图
              map: _self.map,
              zoom: 14,
              center: [113.754555, 25.026711],
              container: _self.mapConfig.container,
              constraints: {
                maxZoom: 17,
              },
            });

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
            _self.pointGraphic = new Graphic();
            _self.pointGraphicLayer = new GraphicsLayer();

            var featureLayer = new FeatureLayer({
              url: "https://danxiagis.top:6443/arcgis/rest/services/DanXia/practicePoints/FeatureServer",
              outFields: ["*"],
              definitionExpression: "routeID=3",
              labelingInfo: [labelClass],
              renderer: {
                type: "simple",
                symbol: {
                  type: "simple-marker",
                  size: 9,
                  color: "#a900b7",
                  outline: {
                    width: 1,
                    color: "white",
                  },
                },
              },
            });
            var RoutesfeatureLayer = new FeatureLayer({
              url: "https://danxiagis.top:6443/arcgis/rest/services/DanXia/practiceRoutes/FeatureServer/2",
              renderer: {
                type: "simple",
                symbol: {
                  type: "simple-line",
                  width: "5px",
                  color: "#3073c0",
                },
              },
            });
            _self.map.add(RoutesfeatureLayer);
            _self.map.add(featureLayer);
            RoutesfeatureLayer.when(function () {
              _self.mapConfig.mapView.extent = RoutesfeatureLayer.fullExtent;
              // console.log(RoutesfeatureLayer)
            });
            _self.mapConfig.mapView
              .whenLayerView(featureLayer)
              .then(function (layerView) {
                let pointWatch = layerView.watch("updating", function (value) {
                  _self.items = [];
                  if (!value) {
                    // wait for the layer view to finish updating
                    // query all the features available for drawing.
                    layerView
                      .queryFeatures({
                        geometry: _self.mapConfig.mapView.extent,
                        returnGeometry: true,
                        orderByFields: ["name"],
                      })
                      .then(function (results) {
                        _self.graphics = results.features;
                        _self.graphics.forEach(function (result) {
                          const attributes = result.attributes;
                          const name = attributes.name;
                          _self.items.push(name);
                          // console.log(attributes.routeID);
                        });
                        // console.log(_self.items);
                      })
                      .catch(function (error) {
                        console.error("query failed: ", error);
                      });
                  }
                  pointWatch.remove();
                });
                _self.mapConfig.mapView.on("pointer-down", _self.eventHandler);
              });
          }
        )
        .catch((err) => {
          _self.$message("地图创建失败，" + err);
        });
    },
    // 点击点列表的事件
    onListClickHandler: function (event) {
      const _self = this;
      const target = event.target;
      //清空图片列表
      _self.pointItems = [];
      //清空视频容器
      _self.srcvideo = "";
      _self.pointIntroduce = null;
      // console.log(target.innerHTML);
      // console.log(_self.map.layers.items[0])
      //展开点详情表
      _self.anmini = false;
      //获取点要素图层
      const featureLayer = _self.map.layers.items[1];
      //创建查询
      const query = featureLayer.createQuery();
      query.where = "name='" + target.innerHTML + "'";
      //获得查询结果及点要素图层的view
      _self.mapConfig.mapView
        .whenLayerView(featureLayer)
        .then(function (layerView) {
          featureLayer.queryFeatures(query).then(function (response) {
            // console.log(response);
            if (_self.highlighSelect) {
              _self.highlighSelect.remove();
              // _self.mapConfig.mapView.graphics.removeAll()
              _self.pointGraphicLayer.graphics.remove(_self.pointGraphic);
            }
            // if (_self.mapConfig.mapView.graphics.length > 1) {
            //   const Arrylength = _self.mapConfig.mapView.graphics.length-1;

            //   console.log(Arrylength);
            //   _self.mapConfig.mapView.graphics.items.splice(0, Arrylength);

            // }

            //高亮显示，视图移动到选中的点
            const feature = response.features[0];
            _self.highlighSelect = layerView.highlight(
              feature.attributes["objectid"]
            );
            _self.mapConfig.mapView.goTo({
              target: feature.geometry,
            });
            //将获得的结果填充到表格中
            _self.pointTitle =
              "阴元石-翔龙湖景区路线——" + feature.attributes.name;
            _self.desserts = [];
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
            _self.desserts.push(
              rock,
              tectonic,
              landscape,
              soil,
              vegetation,
              slope
            );
            //建立一个graphic，用于实现点闪烁
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
            _self.pointGraphic.geometry = feature.geometry;
            _self.pointGraphic.symbol = pointSymbol;
            // _self.mapConfig.mapView.graphics.add(_self.pointGraphic);
            _self.pointGraphicLayer.graphics.add(_self.pointGraphic);
            _self.map.add(_self.pointGraphicLayer);
            // console.log(111111111);
            // console.log(_self.pointGraphicLayer);
            _self.flicker(_self.pointGraphic);
            // console.log(_self.pointGraphic);
            // console.log(_self.mapConfig.mapView.graphics);
            _self.horizontalLine = "true";
            _self.verticalLine = "true";
            //控制十字线出现
            setTimeout(() => {
              _self.horizontalLine = false;
              _self.verticalLine = false;
              _self.map.remove(_self.pointGraphicLayer);
            }, 2400);

            //发送请求获取图片url和视频
            axios({
              method: "post",
              url: "https://danxiagis.top:3005/pointData/get",
              data: `pointId=${feature.attributes.objectid}`,
              // data: `pointId=1`,
            }).then((response) => {
              _self.pointIntroduce = response.data.introduce;
              // console.log(response);
              //将图片添加到图片列表中
              const imgUrls = response.data.Img;
              // console.log(imgUrls);
              for (var i = 0; i < imgUrls.length; i++) {
                const imgUrl = { src: imgUrls[i] };
                // console.log(imgUrl)
                _self.pointItems.push(imgUrl);
              }
              // console.log(_self.pointItems)
              //添加视频封面
              _self.playerOptions.poster =
                "https://danxiagis.top:3007/image/banner1.jpg";
              //添加视频
              if (response.data.Video.length != 0) {
                const video = response.data.Video;
                // _self.playerOptions.sources[0].src = video;
                // _self.$refs.videoPlayer.sources[0].src=video
                _self.$set(_self.playerOptions.sources, 0, {
                  type: "video/mp4",
                  src: video[0],
                });
                // _self.player.muted(false)
                _self.srcvideo = video;
                // console.log(_self.playerOptions);
              }
            });
          });
        });
    },
    //点闪烁
    flicker: function (graphic) {
      let temp = 0;
      let handler = setInterval(function () {
        if (temp === 6) {
          if (handler) {
            if (!graphic.visible)
              //graphic.show();
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
    },
    //图片放大
    clickLocation: function (Item) {
      this.i = this.i + 1;
      if (this.i > 1) {
        this.inited(this.$viewer);
      }
      this.viewer1 = true;
      this.picModel = Item;
      this.$viewer.view(this.picModel);
    },
    //初始化预览组件
    inited: function (viewer) {
      const _self = this;
      _self.$viewer = viewer;
      // console.log(viewer);
      // _self.$viewer.view(_self.picModel);
    },

    //点击地图上的点实现和点击列表相同的效果
    eventHandler: function (event) {
      const _self = this;
      //清空图片列表
      _self.pointItems = [];
      //清空视频容器
      _self.srcvideo = "";
      _self.pointIntroduce = null;
      const opts = {
        include: _self.map.featureLayer,
      };
      this.mapConfig.mapView.hitTest(event, opts).then(function (response) {
        // console.log(333333333333);
        // console.log(response);
        const pointGraphic = response.results[0].graphic;
        if (response.results[0].graphic.geometry.type === "point") {
          // console.log("true");
          //展开点详情弹窗
          _self.anmini = false;
          if (_self.highlighSelect) {
            _self.highlighSelect.remove();
            _self.pointGraphicLayer.graphics.remove(_self.pointGraphic);
          }

          //高亮显示，视图移动到选中的点
          console.log(_self.mapConfig.mapView);
          // const layerView = _self.map.featureLayer.createLayerView();
          _self.highlighSelect =
            _self.mapConfig.mapView.allLayerViews.items[2].highlight(
              pointGraphic.attributes["objectid"]
            );
          _self.mapConfig.mapView.goTo({
            target: pointGraphic.geometry,
          });
          //将获得的结果填充到表格中
          _self.pointTitle =
            "阴元石-翔龙湖景区路线——" + pointGraphic.attributes.name;
          _self.desserts = [];
          const rock = { name: "岩石", calories: pointGraphic.attributes.rock };
          const tectonic = {
            name: "地质构造",
            calories: pointGraphic.attributes.tectonic,
          };
          const landscape = {
            name: "地貌",
            calories: pointGraphic.attributes.landscape,
          };
          const soil = { name: "土壤", calories: pointGraphic.attributes.soil };
          const vegetation = {
            name: "植被",
            calories: pointGraphic.attributes.vegetation,
          };
          const slope = {
            name: "坡度",
            calories: pointGraphic.attributes.slope,
          };
          _self.desserts.push(
            rock,
            tectonic,
            landscape,
            soil,
            vegetation,
            slope
          );
          //建立一个graphic，用于实现点闪烁
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
          _self.pointGraphic.geometry = pointGraphic.geometry;
          _self.pointGraphic.symbol = pointSymbol;
          // _self.mapConfig.mapView.graphics.add(_self.pointGraphic);
          _self.pointGraphicLayer.graphics.add(_self.pointGraphic);
          _self.map.add(_self.pointGraphicLayer);
          // console.log(111111111);
          // console.log(_self.pointGraphicLayer);
          _self.flicker(_self.pointGraphic);
          // console.log(_self.pointGraphic);
          // console.log(_self.mapConfig.mapView.graphics);
          _self.horizontalLine = "true";
          _self.verticalLine = "true";
          //控制十字线出现
          setTimeout(() => {
            _self.horizontalLine = false;
            _self.verticalLine = false;
            _self.map.remove(_self.pointGraphicLayer);
          }, 2400);

          //发送请求获取图片url和视频
          axios({
            method: "post",
            url: "https://danxiagis.top:3005/pointData/get",
            data: `pointId=${pointGraphic.attributes["objectid"]}`,
            // data: `pointId=1`,
          }).then((response) => {
            _self.pointIntroduce = response.data.introduce;
            // console.log(response);
            //将图片添加到图片列表中
            const imgUrls = response.data.Img;
            // console.log(imgUrls);
            for (var i = 0; i < imgUrls.length; i++) {
              const imgUrl = { src: imgUrls[i] };
              // console.log(imgUrl)
              _self.pointItems.push(imgUrl);
            }
            // console.log(_self.pointItems)

            //添加视频
            if (response.data.Video.length != 0) {
              //添加视频封面
              _self.playerOptions.poster =
                "https://danxiagis.top:3007/image/banner1.jpg";
              const video = response.data.Video;
              // _self.playerOptions.sources[0].src = video;
              // _self.$refs.videoPlayer.sources[0].src=video
              _self.$set(_self.playerOptions.sources, 0, {
                type: "video/mp4",
                src: video[0],
              });
              // _self.player.muted(false)
              _self.srcvideo = video;
              // console.log(_self.playerOptions);
            }
          });
        }
      });
    },
  },
  mounted: function () {
    this._createMapView();
  },
  //   computed: {
  //   player() {
  //     return this.$refs.videoPlayer.player;
  //   },
  // },
};
</script>

<style scoped>
#route3 {
  height: 876px;
  width: 100%;
  position: relative;
}
.fab-container {
  position: fixed;
  bottom: 0;
  right: 0;
}
#horizontalLine {
  height: 2px;
  background: linear-gradient(
    to right,
    #90d5eb,
    #8bcbe0 7.5px,
    transparent 7.5px,
    transparent
  );
  background-size: 15px 100%;
  width: 100%;
  position: absolute;
  top: 50%;
}
#verticalLine {
  width: 2px;
  background: linear-gradient(
    to bottom,
    #90d5eb,
    #8bcbe0 7.5px,
    transparent 7.5px,
    transparent
  );
  background-size: 100% 15px;
  height: 100%;
  position: absolute;
  left: 50%;
}
#fabId {
  /* top: -180px;
  position: absolute;
  left: 2210px; */
  margin-top: -330px;
  margin-left: 1635px;
}
</style>