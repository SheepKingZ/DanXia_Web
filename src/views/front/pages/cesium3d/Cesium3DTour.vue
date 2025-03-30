<template>
  <div class="cesium-container">
    <div id="cesiumContainer"></div>
    
    <!-- 控制面板 -->
    <div class="control-panel">
      <div class="panel-header">
        <h2>丹霞地貌3D游览</h2>
      </div>
      
      <div class="panel-content">
        <div class="control-section">
          <h3>基本控制</h3>
          <v-btn color="primary" class="control-btn" @click="flyToDefaultLocation">
            <v-icon icon="mdi-home" class="mr-1"></v-icon>
            返回起点
          </v-btn>
          <v-btn color="secondary" class="control-btn" @click="toggleTerrainDepth">
            <v-icon icon="mdi-earth" class="mr-1"></v-icon>
            {{ showTerrainDepth ? '关闭' : '开启' }}地形深度
          </v-btn>
        </div>
        
        <div class="control-section">
          <h3>飞行路线</h3>
          <v-btn-toggle v-model="selectedRoute" mandatory>
            <v-btn value="route1" color="info">
              <v-icon icon="mdi-route" class="mr-1"></v-icon>
              经典路线1
            </v-btn>
            <v-btn value="route2" color="info">
              <v-icon icon="mdi-route" class="mr-1"></v-icon>
              经典路线2
            </v-btn>
          </v-btn-toggle>
          
          <div class="mt-4">
            <v-btn color="success" class="control-btn" @click="startFlight">
              <v-icon icon="mdi-play" class="mr-1"></v-icon>
              开始飞行
            </v-btn>
            <v-btn color="error" class="control-btn" @click="stopFlight">
              <v-icon icon="mdi-stop" class="mr-1"></v-icon>
              停止飞行
            </v-btn>
          </div>
        </div>
        
        <div class="control-section">
          <h3>自定义路线</h3>
          <v-switch
            v-model="isAddingPoints"
            color="purple"
            label="添加路径点"
            hide-details
          ></v-switch>
          <p v-if="isAddingPoints" class="text-caption mt-2">
            点击地图添加路径点，完成后点击"开始飞行"
          </p>
          <div class="mt-2">
            <v-btn color="warning" class="control-btn" @click="clearCustomRoute">
              <v-icon icon="mdi-delete" class="mr-1"></v-icon>
              清除路径点
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, reactive, toRefs, nextTick } from 'vue';
import * as Cesium from 'cesium';

export default {
  name: 'Cesium3DTour',
  setup() {
    // 状态变量
    const state = reactive({
      viewer: null,
      selectedRoute: 'route1',
      showTerrainDepth: false,
      isAddingPoints: false,
      customRoutePoints: [],
      flightEntity: null,
      isFlying: false
    });

    // 预定义的飞行路线
    const routes = {
      route1: [
        { longitude: 113.7339, latitude: 24.9965, height: 1000, heading: 0, pitch: -20, duration: 5 },
        { longitude: 113.7359, latitude: 24.9975, height: 800, heading: 45, pitch: -30, duration: 5 },
        { longitude: 113.7379, latitude: 24.9985, height: 600, heading: 90, pitch: -15, duration: 5 },
        { longitude: 113.7399, latitude: 24.9975, height: 800, heading: 135, pitch: -10, duration: 5 },
        { longitude: 113.7339, latitude: 24.9965, height: 1000, heading: 180, pitch: -20, duration: 5 }
      ],
      route2: [
        { longitude: 113.7339, latitude: 24.9965, height: 1200, heading: 180, pitch: -30, duration: 5 },
        { longitude: 113.7319, latitude: 24.9955, height: 1000, heading: 225, pitch: -20, duration: 5 },
        { longitude: 113.7299, latitude: 24.9945, height: 800, heading: 270, pitch: -15, duration: 5 },
        { longitude: 113.7319, latitude: 24.9935, height: 1000, heading: 315, pitch: -20, duration: 5 },
        { longitude: 113.7339, latitude: 24.9965, height: 1200, heading: 0, pitch: -30, duration: 5 }
      ]
    };

    // 初始化Cesium
    const initCesium = () => {
      try {
        console.log('尝试初始化Cesium...');
        
        // 确保DOM中存在cesiumContainer元素
        const container = document.getElementById('cesiumContainer');
        if (!container) {
          console.error('无法找到cesiumContainer元素!');
          return;
        }
        
        console.log('容器元素已找到:', container);
        
        // 设置Cesium ion令牌
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiYTUyYWRjOC01MzFmLTRiYTctYmQyNi0zNDM2M2JkNDJiNjIiLCJpZCI6Mjg4OTE3LCJpYXQiOjE3NDMyMzg4OTZ9.mq_pp9fovtEegMrSlKjn_7lO3AZOot5uW64BfrhO0ds';

        // 使用最基本的配置创建Cesium查看器
        state.viewer = new Cesium.Viewer('cesiumContainer', {
          animation: false,
          baseLayerPicker: false,  // 简化配置
          fullscreenButton: false,  // 简化配置
          geocoder: false,  // 简化配置
          homeButton: false,  // 简化配置
          infoBox: false,  // 简化配置
          sceneModePicker: false,  // 简化配置
          timeline: false
        });

        console.log('Cesium查看器创建成功!');

        // 设置初始视图为丹霞地区
        flyToDefaultLocation();

        // 创建自定义路线点击事件
        setupCustomRouteHandler();
      } catch (error) {
        console.error('初始化Cesium失败:', error);
        alert('初始化3D地图失败，请刷新页面重试。');
      }
    };

    // 设置自定义路线处理
    const setupCustomRouteHandler = () => {
      if (!state.viewer) return;
      
      try {
        // 设置鼠标点击事件，用于自定义飞行路线
        state.viewer.screenSpaceEventHandler.setInputAction((click) => {
          if (!state.isAddingPoints) return;
          
          const cartesian = state.viewer.camera.pickEllipsoid(
            click.position, 
            state.viewer.scene.globe.ellipsoid
          );
          
          if (cartesian) {
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            const longitude = Cesium.Math.toDegrees(cartographic.longitude);
            const latitude = Cesium.Math.toDegrees(cartographic.latitude);
            const height = 800; // 默认高度
            
            // 添加点到自定义路线
            state.customRoutePoints.push({
              longitude,
              latitude,
              height,
              heading: 0,
              pitch: -20,
              duration: 5
            });
            
            // 在地图上添加点标记
            state.viewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
              point: {
                pixelSize: 10,
                color: Cesium.Color.YELLOW,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2
              },
              label: {
                text: `点 ${state.customRoutePoints.length}`,
                font: '14pt sans-serif',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -9)
              }
            });
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      } catch (error) {
        console.error('设置自定义路线处理失败:', error);
      }
    };

    // 飞到默认位置（丹霞地区）
    const flyToDefaultLocation = () => {
      if (!state.viewer) return;
      
      try {
        state.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(113.7339, 24.9965, 3000),
          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-30),
            roll: 0.0
          },
          duration: 3
        });
      } catch (error) {
        console.error('飞行到默认位置失败:', error);
      }
    };

    // 切换地形深度效果
    const toggleTerrainDepth = () => {
      if (!state.viewer) return;
      
      try {
        state.showTerrainDepth = !state.showTerrainDepth;
        state.viewer.scene.globe.depthTestAgainstTerrain = state.showTerrainDepth;
      } catch (error) {
        console.error('切换地形深度失败:', error);
      }
    };

    // 开始沿路线飞行
    const startFlight = () => {
      if (!state.viewer) return;
      
      try {
        if (state.isFlying) {
          stopFlight();
        }
        
        state.isFlying = true;
        let routePoints = [];
        
        // 确定使用哪个路线
        if (state.customRoutePoints.length > 1) {
          routePoints = state.customRoutePoints;
        } else {
          routePoints = routes[state.selectedRoute];
        }
        
        // 如果路线点不足，无法飞行
        if (routePoints.length < 2) {
          alert('请至少添加两个路径点');
          return;
        }
        
        let currentPointIndex = 0;
        
        // 飞到第一个点
        state.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            routePoints[0].longitude,
            routePoints[0].latitude,
            routePoints[0].height
          ),
          orientation: {
            heading: Cesium.Math.toRadians(routePoints[0].heading),
            pitch: Cesium.Math.toRadians(routePoints[0].pitch),
            roll: 0.0
          },
          complete: flyToNextPoint
        });
        
        // 飞行到下一个点的函数
        function flyToNextPoint() {
          if (!state.isFlying) return;
          
          currentPointIndex++;
          
          // 如果到达路线终点，飞行结束
          if (currentPointIndex >= routePoints.length) {
            state.isFlying = false;
            return;
          }
          
          const point = routePoints[currentPointIndex];
          
          // 飞到下一个点
          state.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
              point.longitude,
              point.latitude,
              point.height
            ),
            orientation: {
              heading: Cesium.Math.toRadians(point.heading),
              pitch: Cesium.Math.toRadians(point.pitch),
              roll: 0.0
            },
            duration: point.duration,
            complete: flyToNextPoint
          });
        }
      } catch (error) {
        console.error('开始飞行失败:', error);
        state.isFlying = false;
      }
    };

    // 停止飞行
    const stopFlight = () => {
      state.isFlying = false;
    };

    // 清除自定义路线
    const clearCustomRoute = () => {
      if (!state.viewer) return;
      
      try {
        state.customRoutePoints = [];
        // 清除所有路径点实体
        state.viewer.entities.removeAll();
      } catch (error) {
        console.error('清除自定义路线失败:', error);
      }
    };

    // 生命周期钩子：挂载后初始化Cesium
    onMounted(() => {
      console.log('组件已挂载，准备初始化Cesium...');
      
      // 给DOM一些时间完全渲染
      setTimeout(() => {
        initCesium();
      }, 1000);
    });

    // 生命周期钩子：卸载前销毁Cesium
    onUnmounted(() => {
      if (state.viewer) {
        try {
          state.viewer.destroy();
          state.viewer = null;
          console.log('Cesium查看器已销毁');
        } catch (error) {
          console.error('销毁Cesium查看器失败:', error);
        }
      }
    });

    return {
      ...toRefs(state),
      flyToDefaultLocation,
      toggleTerrainDepth,
      startFlight,
      stopFlight,
      clearCustomRoute
    };
  }
};
</script>

<style scoped>
.cesium-container {
  width: 100%;
  height: 100vh;
  position: relative;
}

#cesiumContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.control-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 300px;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 999;
  overflow: hidden;
}

.panel-header {
  background-color: #3f51b5;
  color: white;
  padding: 12px 16px;
  text-align: center;
}

.panel-header h2 {
  margin: 0;
  font-size: 1.4rem;
}

.panel-content {
  padding: 16px;
}

.control-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.control-section:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.control-section h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 1.1rem;
  color: #333;
}

.control-btn {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style> 