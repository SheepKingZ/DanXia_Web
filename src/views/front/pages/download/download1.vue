<template>
  <v-app class="green lighten-5">
 
  <v-row>
    <v-col cols="12" md="2" >
    <v-card class="pull-left ml-5 mt-5" height="500px" min-width="11%">
      
      <v-list>

          <v-list-item-group v-model="selectedItem">
            <v-list-item
              class="list-item-wrap"
              v-for="(item, i) in items"
              :key="i"
              variant="tonal"
              color="primary"
              @click="pSrc=item.pdf"
              v-ripple="{class:'grey--text'}"
              :title="item.title"
              
              >
              <v-list-item-title class="title-wrap">{{item.title}}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        
      </v-list>
    </v-card>
  </v-col>

      <v-col cols="12" md="9" >
      <v-card height="1000px" width="2000px" id="r">
        <iframe :src="pSrc" width="100%" height="100%" ></iframe>
      </v-card>
    </v-col>

  </v-row>

  </v-app>
  
</template>

<script>
import { ref, reactive, onMounted } from 'vue';

export default {
  name: "download",
  setup() {
    const selectedItem = ref(null);
    const items = ref([]);
    const subjectItem = ref([]);
    const childItems = ref([]);
    const pSrc = ref("");
    
    // 加载目录
    const loadClassList = () => {
      const res = JSON.parse(localStorage.getItem('meterial'));
      
      items.value = [];
      for (let i = 0; i < res.length; i++) {
        // 将条件检查移到外层循环，只有当_id包含'实习资料'时，才处理内层的info
        if(res[i]._id.indexOf('实习资料') !== -1) {
          for(let j = 0; j < res[i].info.length; j++) {
            items.value.push({
              title: res[i].info[j].topic,
              pdf: res[i].info[j].pdf,
              time: Date.parse(res[i].info[j].uploadTime)
            });
          }
        }
      }
      
      items.value.sort(function(a, b) {
        return b.time - a.time;
      });
      
      if(items.value.length > 0) {
        pSrc.value = items.value[0].pdf; // 设置pSrc为第一个PDF的路径
      }
    };
    
    onMounted(() => {
      loadClassList();
    });
    
    return {
      selectedItem,
      items,
      subjectItem,
      childItems,
      pSrc
    };
  }
};
</script>

<style>
#r {
  min-height: 900px;
  min-width: 80%;
  position: relative;
  box-shadow: 0px 0px 3px rgb(160, 157, 157);
  left: 20px;
  top: 20px;
  margin-bottom: 40px;
  border-radius: 3%;
}
.list-item-wrap {
  white-space: normal;
}

.title-wrap {
  word-break: break-word;
}
</style>