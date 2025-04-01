<template>
  <v-app class="green lighten-5">
    <v-container fluid>
      <v-row>
        <v-card
          class="pull-left ml-5 mt-5"
          height="500px"
          min-width="11%"
          id="l"
        >
          <v-list>
            <v-list-item-group v-model="model">
              <router-link
                :to="{
                  name: 'ClassIntro',
                  params: { currentClass: currentClass },
                }"
                class="text-decoration-none"
              >
                <v-list-item link>
                  <v-list-item-icon>
                    <v-icon>mdi-pen</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>课程介绍</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </router-link>
              <router-link
                :to="{
                  name:'ClassList',
                  params: { currentClass: currentClass },
                }"
                class="text-decoration-none"
              >
                <v-list-item link>
                  <v-list-item-icon>
                    <v-icon>mdi-book</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>课程内容</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </router-link>
              <router-link
                to="/front/pages/learning/DisscusList"
                class="text-decoration-none"
              >
                <!-- <v-list-item link>
                  <v-list-item-icon>
                    <v-icon>mdi-message</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>讨论区</v-list-item-title>
                  </v-list-item-content>
                </v-list-item> -->
              </router-link>
            </v-list-item-group>
          </v-list>
        </v-card>

        <div id="r">
          <div class="mx-auto fill-height fill-width">
            <v-card class="mx-auto pa-8" min-height="100%" min-width="100%">
              <v-row align="start" no-gutters>
                <router-link
                  :to="{
                    name: 'ClassList',
                    params: { currentClass: currentClass },
                  }"
                  class="text-decoration-none"
                >
                  <v-subheader
                    class="font-weight-black black--text text-subtitle-1"
                    >>所有内容</v-subheader
                  >
                </router-link>
                <v-subheader>专题 </v-subheader>
                <v-col cols="2" class="mt-1">
                  <v-select
                    @change="SelectChange($event)"
                    v-model="ztname"
                    :items="ZTname"
                    menu-props="auto"
                    label="select"
                    outlined
                    dense
                    single-line
                  ></v-select>
                </v-col>

                <v-subheader>内容 </v-subheader>

                <v-col cols="2" class="mt-1">
                  <v-select
                    @change="change($event)"
                    v-model="nrname"
                    :items="NRname"
                    menu-props="auto"
                    outlined
                    dense
                    label="select"
                    single-line
                  ></v-select>
                </v-col>
              </v-row>
              <!-- video版块 -->
              <div fill-height outlined class="mx-3">
                <v-tabs
                  background-color="grey lighten-3 "
                  fixed-tabs
                  height="35"
                >
                  <v-tab href="#ppt" @click="flag = true">
                    <v-icon>mdi-laptop</v-icon>
                  </v-tab>

                  <!-- <v-tab href="#video" @click="flag = false">
                      <v-icon>mdi-video</v-icon>
                    </v-tab> -->
                </v-tabs>
               
                <!-- 展示内容 -->
                <div>
                  <v-card height="750">
                    <iframe :src="pSrc" width="100%" height="100%"></iframe>
                  </v-card>
                </div>
              </div>
            </v-card>
          </div>
        </div>
      </v-row>
    </v-container>
  </v-app>
</template>


<script>
import { ref, reactive, onMounted, onBeforeUnmount, onCreated } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: "Class",
  
  setup() {
    const route = useRoute();
    const router = useRouter();
    
    const timeoutId = ref(null); // 计时器的 ID  
    const model = ref(1);
    const ztname = ref("");
    const nrname = ref("");
    const ZTname = ref(["nodata"]);
    const NRname = ref(["nodata"]);
    const ZTchild = ref([]);
    const pSrc = ref("");
    const PassPPtSrc = ref("");
    const currentClass = ref("");
    
    // 获取上一页面信息
    const PassClass = () => {
      currentClass.value = route.params.currentClass;
      loadPPTList();
    };
    
    const loadPPTList = () => {
      const res = JSON.parse(localStorage.getItem('meterial'));
      
      ZTname.value = [];
      ZTchild.value = [];
      /* 整理专题selectitem */
      for (let i = 0; i < res.length; i++) {
        const resInfo = res[i].info;
        
        if (res[i].info[0].subject.indexOf(currentClass.value) !== -1) {
          
          ZTchild.value = [];
          for (let j = 0; j < resInfo.length; j++) {
            let nr = {
              text: resInfo[j].topic,
              ppt: resInfo[j].pdf,
            };
            ZTchild.value.push(nr);
          }
          
          let del_t = resInfo[0].subject + "—";
          let it_title = res[i]._id.replace(del_t, "");
          let zt = {
            zt_id: it_title,
            items: ZTchild.value,
            text: it_title,
          };
          
          ZTname.value.push(zt);
        }
      }
      
      /* 整理内容selectitem */
      for (let i = 0; i < ZTname.value.length; i++) {
        if (ztname.value == ZTname.value[i].zt_id) {
          NRname.value = [];
          // console.log(ZTname.value[i]);
          const nrItem = ZTname.value[i].items;
          
          for (let j = 0; j < nrItem.length; j++) {
            const item = {
              text: nrItem[j].text,
              ppt: nrItem[j].ppt,
            };
            NRname.value.push(item);
          }
        }
      }
    };
    
    // 双向联动点击事件
    const SelectChange = (event) => {
      // console.log(typeof event); --string
      // console.log( event) --string
      // 判断相等，然后取专题项目里的内容item
      ztname.value = event;
      localStorage.setItem('ZT', ztname.value);
      for (let i = 0; i < ZTname.value.length; i++) {
        if (event == ZTname.value[i].zt_id) {
          NRname.value = [];
          // console.log(ZTname.value[i]);
          const nrItem = ZTname.value[i].items;
          
          for (let j = 0; j < nrItem.length; j++) {
            console.log(nrItem[j]);
            const item = {
              text: nrItem[j].text,
              ppt: nrItem[j].ppt,
            };
            NRname.value.push(item);
          }
        }
      }
    };
    
    // 子选项点击展示PPT
    const change = (event) => {
      // console.log(event);
      // console.log(NRname.value);
      nrname.value = event;
      localStorage.setItem('NR', nrname.value);
      pSrc.value = "";
      for (let i = 0; i < NRname.value.length; i++) {
        if (event == NRname.value[i].text) {
          pSrc.value = NRname.value[i].ppt;
          localStorage.setItem('src', pSrc.value);
        }
      }
      // console.log(NRname.value[i].ppt)
      localStorage.setItem('ZT', ztname.value);
      localStorage.setItem('NR', nrname.value);
      localStorage.setItem('src', pSrc.value);
    };
    
    const loadPPT = () => {
      // console.log(111)
      pSrc.value = PassPPtSrc.value;
    };
    
    // 调用前一个页面的数据
    const PassSrc = () => {
      if (localStorage.getItem('src') == null) {
        const src = route.params.pptsrc;
        PassPPtSrc.value = src;
        
        const currentName = route.params.currentName;
        nrname.value = currentName;
        
        const parentName = route.params.parentName;
        ztname.value = parentName;
        
        const currentItem = route.params.currentItem;
        NRname.value = currentItem;
      } else {
        nrname.value = localStorage.getItem('NR');
        ztname.value = localStorage.getItem('ZT');
        PassPPtSrc.value = localStorage.getItem('src');
      }
      localStorage.setItem('ZT', ztname.value);
      localStorage.setItem('NR', nrname.value);
      localStorage.setItem('src', PassPPtSrc.value);
    };
    
    const startTimer = () => {
      timeoutId.value = setTimeout(() => {
        alert('页面已停留过长！');
        router.push("/front"); // 计时器到时，显示弹窗提示   
      }, 1800000); // 设置计时器时间为 30分钟，可根据需要调整  
    };
    
    const clearTimeout = () => {
      clearTimeout(timeoutId.value); // 清除计时器  
    };
    
    const resetTimer = () => {
      clearTimeout(); // 清除当前计时器  
      startTimer(); // 重新设置计时器  
    };
    
    // 替代 created 生命周期钩子
    ztname.value = localStorage.getItem('ZT') || '';
    nrname.value = localStorage.getItem('NR') || '';
    PassPPtSrc.value = localStorage.getItem('src') || '';
    console.log('create', ztname.value);
    
    onMounted(() => {
      console.log('mountedzt', ztname.value);
      startTimer();
      
      PassSrc();
      loadPPT();
      PassClass();
    });
    
    onBeforeUnmount(() => {
      clearTimeout(); // 在组件销毁前清除计时器，避免内存泄漏  
    });
    
    return {
      timeoutId,
      model,
      ztname,
      nrname,
      ZTname,
      NRname,
      ZTchild,
      pSrc,
      PassPPtSrc,
      currentClass,
      PassClass,
      loadPPTList,
      SelectChange,
      change,
      loadPPT,
      PassSrc,
      startTimer,
      clearTimeout,
      resetTimer
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
</style>