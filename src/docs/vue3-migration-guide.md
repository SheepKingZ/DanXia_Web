# Vue 2 到 Vue 3 迁移指南

本指南提供了将Vue 2应用程序迁移到Vue 3的步骤和最佳实践，特别针对虚拟丹霞项目。

## 基本迁移步骤

1. 使用组合式API (Composition API) 替代选项式API (Options API)
2. 更新组件的生命周期钩子
3. 更新Vuetify相关的断点使用方式
4. 处理特定库的兼容性问题

## 组件迁移模式

### 基本组件结构变化

**Vue 2:**
```js
export default {
  name: 'ComponentName',
  data() {
    return {
      someValue: '',
      // 其他响应式数据
    }
  },
  methods: {
    someMethod() {
      // 方法实现
    }
  },
  created() {
    // 创建时逻辑
  },
  mounted() {
    // 挂载时逻辑
  }
}
```

**Vue 3:**
```js
import { ref, reactive, onMounted, onBeforeMount } from 'vue';

export default {
  name: 'ComponentName',
  setup() {
    // 响应式状态
    const someValue = ref('');
    
    // 方法
    const someMethod = () => {
      // 方法实现
    };
    
    // 生命周期钩子
    onBeforeMount(() => {
      // 相当于Vue 2中的created
    });
    
    onMounted(() => {
      // 挂载时逻辑
    });
    
    // 必须返回模板中使用的变量和方法
    return {
      someValue,
      someMethod
    };
  }
}
```

### Vuetify 断点迁移

**Vue 2:**
```js
// 在组件中使用
this.$vuetify.breakpoint.mdAndUp
```

**Vue 3:**
```js
import { useDisplay } from 'vuetify';

// 在setup函数中
const display = useDisplay();
const mdAndUp = computed(() => display.mdAndUp.value);

// 返回供模板使用
return {
  mdAndUp
}
```

### 复杂组件迁移 (如使用ArcGIS地图的组件)

对于使用ArcGIS等外部库的复杂组件，建议采用以下策略：

1. **使用shallowRef**：对于不需要深度响应式的大型对象(如地图实例)
```js
import { shallowRef, onMounted } from 'vue';
import { loadModules } from 'esri-loader';

export default {
  setup() {
    const mapView = shallowRef(null);
    
    onMounted(async () => {
      const [MapView, Map] = await loadModules(['esri/views/MapView', 'esri/Map']);
      const map = new Map({
        basemap: 'streets-vector'
      });
      
      mapView.value = new MapView({
        container: 'mapDiv',
        map: map,
        zoom: 4,
        center: [15, 65]
      });
    });
    
    return {
      mapView
    };
  }
}
```

2. **状态管理分离**：将ArcGIS相关逻辑分离到单独的服务或状态管理中
```js
// 创建mapService.js服务
import { loadModules } from 'esri-loader';

let mapInstance = null;
let viewInstance = null;

export async function initializeMap(container) {
  const [MapView, Map] = await loadModules(['esri/views/MapView', 'esri/Map']);
  
  mapInstance = new Map({
    basemap: 'streets-vector'
  });
  
  viewInstance = new MapView({
    container,
    map: mapInstance,
    zoom: 4,
    center: [15, 65]
  });
  
  return viewInstance;
}

export function getMapInstance() {
  return mapInstance;
}

export function getViewInstance() {
  return viewInstance;
}

// 在组件中使用
import { onMounted, ref } from 'vue';
import { initializeMap } from './mapService';

export default {
  setup() {
    const mapReady = ref(false);
    
    onMounted(async () => {
      const view = await initializeMap('mapDiv');
      mapReady.value = true;
    });
    
    return {
      mapReady
    }
  }
}
```

## 注意事项

1. **不要将Vue的响应式系统用于大型外部库对象**：如ArcGIS的Map和MapView对象不要直接放入reactive()中
2. **使用事件委托**：对于地图事件，使用事件委托模式，而不是直接在Vue组件中注册地图事件
3. **按需迁移**：对于特别复杂的组件，可以考虑先简单包装为Vue 3兼容，然后逐步重构内部逻辑

## 工具和资源

- [Vue 3官方迁移指南](https://v3-migration.vuejs.org/)
- [Vuetify 3文档](https://vuetifyjs.com/)
- [Vue 3 Composition API文档](https://vuejs.org/guide/extras/composition-api-faq.html) 