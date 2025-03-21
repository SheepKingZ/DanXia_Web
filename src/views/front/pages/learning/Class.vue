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

export default {
  name: "Class",

  data() {
    return {
       
      timeoutId: null, // 计时器的 ID  
      model: 1,
      ztname: "",
      nrname: "",
      ZTname: ["nodata"],
      NRname: ["nodata"],
      ZTchild: [],
      pSrc: "",
      PassPPtSrc: "",
      currentClass: "",
    };
  },
  
  components: {},
  
  methods: {
    
    PassClass() {
      this.currentClass = this.$route.params.currentClass
      this.loadPPTList();
    },
    loadPPTList() {
        const res = JSON.parse(localStorage.getItem('meterial'));
        
        this.ZTname = [];
        this.ZTchild = [];
      /* 整理专题selectitem */
        for (let i = 0; i < res.length; i++) {
          const resInfo = res[i].info;
          
          if (res[i].info[0].subject.indexOf(this.currentClass) !=-1 ) {

            this.ZTchild = [];
            for (let j = 0; j < resInfo.length; j++) {
              let nr = {
                text: resInfo[j].topic,
                ppt: resInfo[j].pdf,
              };
              this.ZTchild.push(nr);
            }
            
            let del_t = resInfo[0].subject + "—";
            let it_title = res[i]._id.replace(del_t, "");
            let zt = {
              zt_id: it_title,
              items: this.ZTchild,
              text: it_title,
            };
            
            this.ZTname.push(zt);

          }
        }
        /* 整理内容selectitem */
        for (let i = 0; i < this.ZTname.length; i++) {
          if (this.ztname == this.ZTname[i].zt_id) {
            this.NRname = [];
            // console.log(this.ZTname[i]);
            const nrItem = this.ZTname[i].items;

            for (let j = 0; j < nrItem.length; j++) {
              const item = {
                text: nrItem[j].text,
                ppt: nrItem[j].ppt,
              };
              this.NRname.push(item);
            }
          }
        }
        
    },
    //双向联动点击事件
    SelectChange(event) {
      // console.log(typeof event); --string
      // console.log( event) --string
      //判断相等，然后取专题项目里的内容item
      this.ztname = event;
      localStorage.setItem('ZT', this.ztname);
      for (let i = 0; i < this.ZTname.length; i++) {
        if (event == this.ZTname[i].zt_id) {
          this.NRname = [];
          // console.log(this.ZTname[i]);
          const nrItem = this.ZTname[i].items;

          for (let j = 0; j < nrItem.length; j++) {
            console.log(nrItem[j]);
            const item = {
              text: nrItem[j].text,
              ppt: nrItem[j].ppt,
            };
            this.NRname.push(item);
          }
        }
      }
    },
    // 子选项点击展示PPT
    change(event) {
      // console.log(event);
      // console.log(this.NRname);
      this.nrname = event;
      localStorage.setItem('NR', this.nrname); 
      this.pSrc = "";
      for (let i = 0; i < this.NRname.length; i++) {
        if (event == this.NRname[i].text) {
          this.pSrc = this.NRname[i].ppt
          localStorage.setItem('src', this.pSrc);
        }
      }
      // console.log(this.NRname[i].ppt)
      localStorage.setItem('ZT',this.ztname)
      localStorage.setItem('NR',this.nrname)
      localStorage.setItem('src',this.pSrc)
    },
    loadPPT() {
      //  console.log(111)
      this.pSrc = this.PassPPtSrc
    },
    //调用前一个页面的数据
    PassSrc() {
      let self = this;
      if(localStorage.getItem('src')==null)
      {
        self.src = self.$route.params.pptsrc;
        this.PassPPtSrc = self.src;

        self.currentName = self.$route.params.currentName;
        this.nrname = self.currentName;

        self.parentName = self.$route.params.parentName;
        this.ztname = self.parentName;

        self.currentItem = self.$route.params.currentItem;
        this.NRname = self.currentItem;
      }
      else
      {
        this.nrname=localStorage.getItem('NR')
        this.ztname=localStorage.getItem('ZT')
        this.PassPPtSrc=localStorage.getItem('src')
      }
      localStorage.setItem('ZT',this.ztname)
      localStorage.setItem('NR',this.nrname)
      localStorage.setItem('src',this.PassPPtSrc)
      
    },
    startTimer() {  
      this.timeoutId = setTimeout(() => {  
        alert('页面已停留过长！');
        this.$router.push("/front"); // 计时器到时，显示弹窗提示   
      }, 1800000); // 设置计时器时间为 30分钟，可根据需要调整  
      
       
      
    },  
    clearTimeout() {  
      clearTimeout(this.timeoutId); // 清除计时器  
    },  
    resetTimer() {  
      this.clearTimeout(); // 清除当前计时器  
      this.startTimer(); // 重新设置计时器  
    },  
  },
  created() {
    this.ztname = localStorage.getItem('ZT') || ''; 
    this.nrname = localStorage.getItem('NR') || '';
    this.PassPPtSrc = localStorage.getItem('src') || '';
    console.log('create',this.ztname);
  },
  mounted() {
    
    console.log('mountedzt',this.ztname);
    this.startTimer(); 
    
    this.PassSrc();
    this.loadPPT();
    this.PassClass();
  },
  beforeDestroy() {  
    this.clearTimeout(); // 在组件销毁前清除计时器，避免内存泄漏  
  },  
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