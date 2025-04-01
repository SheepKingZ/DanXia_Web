<template>
  <v-img
    class="fill-height"
    src="@/assets/Learning.jpg"
    
    width="100%"
    :aspect-ratio="16 / 9"
    gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.4)"
  >
    <v-main fluid>
 
      <v-container fill-height fluid class="mx-auto my-10" >
        <v-hover
        v-slot="{ hover }"
        open-delay="200"
      >
         <v-card class="mx-auto" width="200" height="260"  link outlined @click="ClassPage1" color="rgba(255, 255, 255, 0)" id="b"
           :class="{ 'on-hover': hover }"  :elevation="hover ? 16 : 3" 
         >
           <v-col class="fill-height " align="center" justify="center">
             <v-row class="fill-height " align="center" justify="center">
              <v-icon color="white" size="70">mdi-terrain</v-icon>
            
            </v-row>
            <v-text id="text1">自然地理</v-text>
           </v-col>
            
          </v-card>
        </v-hover>
          
            <v-hover
            v-slot="{ hover }"
            open-delay="200"
          >
          <v-card class="mx-auto" width="210" height="260" link @click="ClassPage2" outlined color="rgba(255, 255, 255, 0)" id="b"
          :elevation="hover ? 16 : 3"  :class="{ 'on-hover': hover}" >
            <v-col class="fill-height " align="center" justify="center">
            <v-row class="fill-height" align="center" justify="center">
              <v-icon color="white" size="70">mdi-library</v-icon>
            </v-row>
            <v-text id="text1">人文与经济地理</v-text>
            </v-col>
          </v-card>
        </v-hover>
        
        <v-hover
        v-slot="{ hover }"
        open-delay="200">
          <v-card class="mx-auto" width="200" height="260" link @click="ClassPage4"  outlined color="rgba(255, 255, 255, 0)" id="b"
          :elevation="hover ? 16 : 3"  :class="{ 'on-hover': hover}" >
           <v-col class="fill-height " align="center" justify="center">
            <v-row class="fill-height" align="center" justify="center">
              <v-icon color="white" size="70">mdi-earth</v-icon>
            </v-row>
            <v-text id="text1">地图学</v-text>
           </v-col>
          </v-card>
        </v-hover>
        <v-hover
        v-slot="{ hover }"
        open-delay="200">
          <v-card class="mx-auto" width="200" height="260" link @click="ClassPage3"  outlined color="rgba(255, 255, 255, 0)" id="b"
          :elevation="hover ? 16 : 3"  :class="{ 'on-hover': hover}" >
           <v-col class="fill-height " align="center" justify="center">
            <v-row class="fill-height" align="center" justify="center">
              <v-icon color="white" size="70">mdi-city</v-icon>
            </v-row>
            <v-text id="text1">地理信息系统原理</v-text>
           </v-col>
          </v-card>
        </v-hover>
        <v-hover
        v-slot="{ hover }"
        open-delay="200">
          <v-card class="mx-auto" width="200" height="260" link @click="ClassPage5"  outlined color="rgba(255, 255, 255, 0)"
          id="b" :elevation="hover ? 16 : 3"  :class="{ 'on-hover': hover}"
          >
           <v-col class="fill-height " align="center" justify="center">
            <v-row class="fill-height" align="center" justify="center">
              <v-icon color="white" size="70">mdi-bookmark</v-icon>
            </v-row>
            <v-text id="text1" >其他资料</v-text>
           </v-col>
          </v-card>
        </v-hover>
        
      </v-container>
 
    </v-main>
  </v-img>
</template>

<script>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: "FirstView",
  setup() {
    const router = useRouter();
    
    const GetMaterial = () => {
      axios({
        method: "get",
        url: "https://danxiagis.top:8081/uploadData/get",
      }).then(response => {
        let res = response.data;
        if (localStorage.getItem('meterial') != null && localStorage.getItem('meterial') != JSON.stringify(res)) {
          localStorage.setItem('meterial', JSON.stringify(res));
          console.log('不相同', JSON.parse(localStorage.getItem('meterial')));
        }
      });
    };
    
    const ClassPage1 = () => {
      router.push({
        name: "ClassList",
        params: {
          currentClass: "自然地理",
        },
      });
    };
    
    const ClassPage2 = () => {
      router.push({
        name: "ClassList",
        params: {
          currentClass: "人文与经济地理",
        },
      });
    };
    
    const ClassPage3 = () => {
      router.push({
        name: "ClassList",
        params: {
          currentClass: "地理信息系统原理",
        },
      });
    };
    
    const ClassPage4 = () => {
      router.push({
        name: "ClassList",
        params: {
          currentClass: "地图学",
        },
      });
    };
    
    const ClassPage5 = () => {
      alert("暂未开放，敬请期待");
      /* router.push({
        name: "ClassList",
        params: {
          currentClass: "其他",
        },
      }); */
    };
    
    onMounted(() => {
      if (sessionStorage.getItem('isteacher') == 'true' ? false : true)
        GetMaterial();
    });
    
    return {
      GetMaterial,
      ClassPage1,
      ClassPage2,
      ClassPage3,
      ClassPage4,
      ClassPage5
    };
  }
};
</script>

<style>
#text {
  color: rgb(255, 255, 255);
  font-size: 25px;
  font-family: "隶书", serif, serif;
  text-align: center;
  display: block;
  margin-top: -60px;
}
#text1{
  color: rgb(255, 255, 255);
  font-size: 21.8px;
  font-family: "隶书", serif, serif;
  text-align: center;
  display: block;
  margin-top: -60px;
}

#b:not(.on-hover) {
  opacity: 0.6;
}
</style> 