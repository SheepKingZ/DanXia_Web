<template>
  <div>
    <div id="fly3" :class="cursorStyle">
      <div class="esri-ui-top-right esri-ui-corner">
        <v-card min-width="400px" color="rgba(255, 255, 255, 0.7)">
          <v-card-title> 可见性分析 </v-card-title>
          <v-card-text>
            <div>类型</div>
            <v-radio-group v-model="typeValue" row mandatory>
              <v-radio
                label="视点分析"
                value="1"
                @click="isPoint = true"
                @change="/* allClean(); */cursorStyle = 'default'"
              ></v-radio>
              <v-radio
                label="通视分析"
                value="2"
                @click="isPoint = false"
                @change="/* allClean(); */cursorStyle = 'default'"
              ></v-radio>
            </v-radio-group>
          </v-card-text>
          <v-divider></v-divider>
          <div v-show="isPoint">
            <v-subheader class="ml-1">视点分析距离</v-subheader>
            <v-col cols="4" class="mt-n2 d-flex align-items-center">
              <!-- 设置flex-grow为1（或任何大于0的数值）允许元素占据可用的额外空间。 -->
              <div class="flex-grow-1">
                <v-text-field
                  v-model="distance"
                  label="请输入"
                  single-line
                  outlined
                  dense
                ></v-text-field>
              </div>
              <span class="ml-2 mt-2">KM</span>
            </v-col>
          </div>
          <v-card-actions>
            <v-btn color="primary" depressed tile @click="analysis">绘制</v-btn>
            <v-btn color="primary" depressed tile @click="execute" v-show="isPoint">分析</v-btn>
            <v-btn color="primary" depressed tile @click="allClean">清除</v-btn>
          </v-card-actions>
        </v-card>
      </div>
      <div id="measurements" class="esri-widget" ref="measure"></div>
    </div>
    <v-dialog
      class="dialog"
      v-model="loading"
      persistent
      max-width="200"
      :key="dialogKey"
    >
      <v-card color="ivory">
        <v-card-title>
          <marquee scrollamount="10">正在分析中...</marquee>
        </v-card-title>
        <v-btn color="green darken-1" text @click="cancelAnalysis">取消 </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { loadModules } from "esri-loader";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: "visible",
  setup() {
    // 响应式状态
    const dialogKey = ref(0)
    const isAnalysisCancelled = ref(false)
    const isPoint = ref(true)  //是否是点可视化
    const distance = ref(1500) //可视范围
    const loading = ref(false) //加载状态
    const map = ref(null) //地图对象
    const mapConfig = reactive({
      container: "fly3",  //容器id
      sceneView: null,
    })
    const graphicsLayer = ref(null) //缓冲区图层
    const typeValue = ref(null) //分析类型的选择框
    const pointGp = ref(null) //单点视域分析的gp服务
    const point = ref(null) //点击屏幕上的点
    const inputGraphic = ref(null) //几何转为图形，做为gp传入参数
    const inputDistance = ref(null) //单点视域范围
    //绘制的点的样式
    const makerSymbol = {
      type: "simple-marker",
      color: [255, 0, 0],
      outline: {
        color: [255, 255, 255],
        width: 2,
      },
    }
    //分析结果的面的样式
    const fillSymbol = {
      type: "simple-fill",
      color: [226, 119, 40, 0.75],
      outline: {
        color: [255, 255, 255],
        width: 1,
      },
    }
    const featureSet = ref(null) //图形转为要素
    const pointview = ref(null) //设置的单点视域的监听
    const lineOfSightViewModel = ref(null) //通视分析
    const intersectionSymbol = {
      //视点的样式
      type: "point-3d",
      symbolLayers: [
        {
          type: "object",
          resource: { primitive: "inverted-cone" }, //点的原始形状
          material: { color: [255, 100, 100] },
          height: 10,
          depth: 10,
          width: 10,
          anchor: "relative", //符号的相对定位
          anchorPosition: { x: 0, y: 0, z: -0.7 },
        },
      ],
    }
    const intersectionGraphic = ref(null) //观察点
    const measurements = ref(null)
    const cursorStyle = reactive({
      LAYER: "url(https://danxiagis.top/image/pen1.cur), auto",
      CROSSHAIR: "crosshair",
    }) //鼠标样式
    const cursorType = ref(null) //当前样式
    
    //创建地图
    const createMapView = function() {
      const _self = { map, mapConfig, graphicsLayer, pointGp, inputGraphic, inputDistance, point, lineOfSightViewModel, intersectionGraphic, measurements, cursorStyle, cursorType }
      const option = {
        //定义一个包含有JS API中js开发包和css样式文件的对象
        url: "https://js.arcgis.com/4.19/init.js",
        css: "https://js.arcgis.com/4.19/esri/themes/light/main.css",
      }
      NProgress.start()
      //通过loadModules来做衔接
      loadModules(
        [
          "esri/Map",
          "esri/views/SceneView",
          "esri/layers/SceneLayer",
          "esri/layers/GraphicsLayer",
          "esri/Graphic",
          "esri/geometry/Point",
          "esri/tasks/Geoprocessor",
          "esri/tasks/support/LinearUnit",
          "esri/tasks/support/FeatureSet",
          "esri/widgets/LineOfSight/LineOfSightViewModel",
          "esri/widgets/Sketch",
          "esri/widgets/DirectLineMeasurement3D",
          "esri/widgets/AreaMeasurement3D",
        ],
        option
      )
      .then(([
        Map,
        SceneView,
        SceneLayer,
        GraphicsLayer,
        Graphic,
        Point,
        Geoprocessor,
        LinearUnit,
        FeatureSet,
        LineOfSightViewModel,
        Sketch,
      ]) => {
        //业务代码在此处编写
        //调用的GP服务的网址
        const gpUrl = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Elevation/ESRI_Elevation_World/GPServer/Viewshed"

        //绘制图层
        _self.graphicsLayer.value = new GraphicsLayer({
          elevationInfo: { mode: "on-the-ground" },
        })
        _self.map.value = new Map({
          //实例化地图
          basemap: "hybrid",
          ground: "world-elevation",
          layers: [_self.graphicsLayer.value],
        })

        _self.mapConfig.sceneView = new SceneView({
          //实例化地图视图
          map: _self.map.value,
          zoom: 14,
          camera: {
            position: [113.75665604199996, 25.04682589249998, 180],
            heading: 255,
            tilt: 80,
          },
          container: _self.mapConfig.container,
        })
        _self.mapConfig.sceneView.when().then(function () {
          // 完成加载
          NProgress.done()
        }).catch(function (error) {
          console.error("地图加载出错: ", error)
          NProgress.done()
        })
        const sceneLayer = new SceneLayer({
          url: "https://danxiagis.top/arcgisserver/rest/services/Hosted/redDOOR_Project/SceneServer",
          popupEnabled: false,
        })
        _self.map.value.add(sceneLayer)
        // console.log(sceneLayer)
        const gLayer = new GraphicsLayer({
          elevationInfo: {
            mode: "relative-to-ground", // default value
          },
        })
        _self.map.value.add(gLayer)
        // define the SketchViewModel
        const sketchVM = new Sketch({
          layer: gLayer,
          view: _self.mapConfig.sceneView,
          availableCreateTools: ["polyline", "polygon", "rectangle"],
          creationMode: "update",
          updateOnGraphicClick: true,
          enableScaling: false,
          defaultCreateOptions: {
            hasZ: false, // default value
          },
          defaultUpdateOptions: {
            enableZ: false, // default value
          },
        })
        _self.mapConfig.sceneView.ui.add(sketchVM, "bottom-left")
        this.measurements.value = document.getElementById("measurements")
        console.log(this.$refs.measure)
        _self.mapConfig.sceneView.ui.add(this.measurements.value, "manual")
        sketchVM.visibleElements = {
          createTools: {
            point: false,
            circle: false,
          },
          selectionTools: {
            "lasso-selection": false,
          },
          settingsMenu: false,
        }
        sketchVM.on("update", (e) => {
          const geometry = e.graphics[0].geometry
          if (e.state === "start") {
            this.switchType(geometry)
          }

          if (e.state === "complete") {
            gLayer.value.remove(gLayer.value.graphics.getItemAt(0))
            this.measurements.value.innerHTML = null
          }

          if (
            e.toolEventInfo &&
            (e.toolEventInfo.type === "scale-stop" ||
              e.toolEventInfo.type === "reshape-stop" ||
              e.toolEventInfo.type === "move-stop")
          ) {
            this.switchType(geometry)
          }
        })

        //实例化单点视域分析的的gp
        _self.pointGp.value = new Geoprocessor(gpUrl)
        _self.pointGp.value.outSpatialReference = {
          wkid: 102100,
        }

        //实例化输入参数（图形、距离）
        _self.inputGraphic.value = new Graphic()
        _self.inputDistance.value = new LinearUnit()

        //实例化要素
        _self.featureSet.value = new FeatureSet()

        _self.point.value = new Point()

        //实例化通视分析小部件
        _self.lineOfSightViewModel.value = new LineOfSightViewModel({
          view: _self.mapConfig.sceneView,
        })
        //实例化观察点的图形
        _self.intersectionGraphic.value = new Graphic()
      })
      .catch((err) => {
        _self.$message("地图创建失败，" + err)
      })
    }
    const getLength = function(line) {
      const option = {
        //定义一个包含有JS API中js开发包和css样式文件的对象
        url: "https://js.arcgis.com/4.19/init.js",
        css: "https://js.arcgis.com/4.19/esri/themes/light/main.css",
      }
      //通过loadModules来做衔接
      loadModules(["esri/geometry/geometryEngine"], option).then(([geometryEngine]) => {
        /*  const geodesicLength = geometryEngine.geodesicLength(line, "kilometers"); */
        const planarLength = geometryEngine.planarLength(line, "kilometers")

        this.measurements.value.innerHTML =
          "<b>线段长度</b>: " + planarLength.toFixed(2) + "  km"
      })
    }
    const getArea = function(polygon) {
      const option = {
        //定义一个包含有JS API中js开发包和css样式文件的对象
        url: "https://js.arcgis.com/4.19/init.js",
        css: "https://js.arcgis.com/4.19/esri/themes/light/main.css",
      }
      //通过loadModules来做衔接
      loadModules(["esri/geometry/geometryEngine"], option).then(([geometryEngine]) => {
        /*  const geodesicArea = geometryEngine.geodesicArea(
          polygon,
          "square-kilometers"
        ); */
        const planarArea = geometryEngine.planarArea(
          polygon,
          "square-kilometers"
        )

        this.measurements.value.innerHTML =
          "<b>面积大小</b>: " + planarArea.toFixed(2) + "  km\xB2"
      })
    }
    const switchType = function(geom) {
      if (geom.type === "polygon") {
        this.getArea(geom)
      } else if (geom.type === "polyline") {
        this.getLength(geom)
      } else {
        console.log("No value found")
      }
    }
    //开始按钮点击函数
    const analysis = function() {
      /* 将div的class变为crosshair，然后下面有设置这个class的css，就是设置了cursor */
      this.cursorStyle = "crosshair"
      var value = this.typeValue
      /* 清除事件监听器
        如果不清除，那么每次调用都会向sceneView添加一个新的监听器。
        这就意味着，当您点击sceneView时，之前注册的每一个监听器都会响应这个点击事件，
        从而导致this.drawPoint被执行多次。
      */
      if (this.pointview) this.pointview.value.remove()
      //一个点计算视域范围，两个点求两点间关系
      if (value == 1) {
        this.pointview.value = this.mapConfig.sceneView.on("click", this.drawPoint) //on注册事件处理程序
      } else if (value == 2) {
        this.lineOfSight()
      }
    }

    //清除所有的痕迹
    const allClean = function() {
      this.graphicsLayer.value.removeAll()
      //console.log(this.graphicsLayer.graphics)
      this.lineOfSightViewModel.value.clear()
    }

    //调用单点视域的GP服务
    const drawPoint = function(event) {
      if (this.graphicsLayer.value.graphics.items.length != 0) {
        alert("已有点，请先清除再点")
        this.cursorStyle = "default"
        return
      }
      console.log('ppp', event.mapPoint)
      /* queryElevation() */
      
      /* this.graphicsLayer.removeAll() */
      this.point.value.longitude = event.mapPoint.longitude
      this.point.value.latitude = event.mapPoint.latitude
      /* this.point.z = event.mapPoint.z; */
      this.inputGraphic.value.geometry = this.point.value
      this.inputGraphic.value.symbol = this.makerSymbol
      /* this.inputGraphic.geometry.hasZ=true */
      /* console.log('this.inputGraphic',this.inputGraphic); */
      this.graphicsLayer.value.add(this.inputGraphic.value)
      /*
        如果您希望在某些情况下使用浏览器的默认鼠标样式，
        只需将cursorStyle设置为'default'或者任何不存在对应CSS类的值。
        Vue会尝试应用这个类，但由于它不存在，元素会保持其默认样式，
        包括默认的鼠标指针样式。 
       */
      this.cursorStyle = "default"
      /* 不删除的话，那个监听器一直在，无论如何点击都会画到点 */
      this.pointview.value.remove()
    }
    const execute = function() {
      this.dialogKey.value++
      if (this.graphicsLayer.value.graphics.items.length == 0) {
        alert("未进行绘制")
        return
      }
      if (this.distance == "") {
        alert("还没输入距离")
        return
      }
      //console.log(this.graphicsLayer.graphics.items)
      this.isAnalysisCancelled = false
      this.loading = true
      this.computeViewshed()
    }
    const computeViewshed = function() {
      if (
        this.graphicsLayer.value.graphics.items.length != 0 &&
        !this.isAnalysisCancelled
      ) {
        const inputGraphicContainer = []
        inputGraphicContainer.push(this.inputGraphic.value)
        this.featureSet.value.features = inputGraphicContainer
        

        this.inputDistance.value.distance = this.distance
        this.inputDistance.value.units = "kilometers"

        const params = {
          Input_Observation_Point: this.featureSet.value,
          Viewshed_Distance: this.inputDistance.value,
        }

        this.pointGp.value
          .execute(params)
          .then((result) => {
            if (!this.isAnalysisCancelled) {
              // 再次检查是否取消
              this.drawResultData(result)
            }
          })
          .catch((error) => {
            console.error("分析过程中发生错误:", error)
          })
          .finally(() => {
            /* 无论该函数执行成功或者失败都会执行 */
            if (!this.isAnalysisCancelled) {
              this.loading = false // 确保只有在分析未被取消时才更新加载状态
            }
          })
      }
    }
    const cancelAnalysis = function(error) {
      this.isAnalysisCancelled = true
      this.loading = false
      setTimeout(() => {
        alert("操作已被终止")
      }, 200)
      this.dialogKey.value++
    }
    const drawResultData = function(result) {
      const resultFeatures = result.results[0].value.features //

      const viewshedGraphics = resultFeatures.map((feature) => {
        feature.symbol = this.fillSymbol
        return feature
      })

      this.graphicsLayer.value.addMany(viewshedGraphics)

      this.mapConfig.sceneView
        .goTo({
          target: viewshedGraphics,
          tilt: 0,
        })
        .catch((error) => {
          if (error.name != "AbprtError") {
            console.error(error)
          }
        })
      this.loading = false
    }

    //通视分析
    const lineOfSight = function() {
      const _self = this
      _self.lineOfSightViewModel.value.start()
      
      /* 双击后，start状态就被打断为stop状态了 */
      this.cursorStyle = 'default'
      /* _self.lineOfSightViewModel.targets.on("change", (event) => {
        event.added.forEach((target) => {
          _self.setIntersectionMarkers();
          target.watch("intersectedLocation", _self.setIntersectionMarkers);
        });
      }); */
    }

    /* //设置交叉点标记，不好用，跟不上变化
    setIntersectionMarkers() {
      this.mapConfig.sceneView.graphics.removeAll();
      this.lineOfSightViewModel.targets.forEach((target) => {
        if (target.intersectedLocation) {
          this.intersectionGraphic.symbol = this.intersectionSymbol;
          this.intersectionGraphic.geometry = target.intersectedLocation;
          this.graphicsLayer.add(this.intersectionGraphic);
          console.log('this.cursorStyle = "default";',this.intersectionGraphic);
        }
      });
    }, */

    // 生命周期钩子
    onMounted(() => {
      createMapView();
    })

    onBeforeUnmount(() => {
      // 组件销毁前的逻辑
      NProgress.remove()
    })

    // 暴露给模板的内容
    return {
      dialogKey,
      isAnalysisCancelled,
      isPoint,
      distance,
      loading,
      map,
      mapConfig,
      graphicsLayer,
      typeValue,
      pointGp,
      point,
      inputGraphic,
      inputDistance,
      makerSymbol,
      fillSymbol,
      featureSet,
      pointview,
      lineOfSightViewModel,
      intersectionGraphic,
      measurements,
      cursorStyle,
      cursorType,
      createMapView,
      getLength,
      getArea,
      switchType,
      analysis,
      allClean,
      drawPoint,
      execute,
      computeViewshed,
      cancelAnalysis,
      drawResultData,
      lineOfSight
    }
  }
}
</script>

<style scoped>
#fly3 {
  height:  calc(100vh - 50px);
  width: 100%;
  position: relative;
}
.crosshair {
  cursor: crosshair;
}
.dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
#measurements {
  padding: 4px 8px;
  font-size: 16px;
  bottom: 15px;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
}
</style>