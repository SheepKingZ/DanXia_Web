<template>
  <v-app class="green lighten-5">
    <v-container fluid>
      <v-row>
        <v-card class="pull-left ml-5 mt-5" height="500px" min-width="11%">
          <v-list>
            <v-list-item-group v-model="model">
              <router-link
                :to="{name:'ClassIntro',params:{currentClass:this.currentClass}}"
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
                :to="{name:'ClassList',params:{currentClass:this.currentClass}}"
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
                   :to="{name:'ClassList',params:{currentClass:this.currentClass}}"
                    class="text-decoration-none"
                  >
                    <v-subheader
                      class="font-weight-black black--text text-subtitle-1"
                      >>所有内容</v-subheader
                    >
                  </router-link>
                  <v-subheader>内容 </v-subheader>
                  <v-col cols="2" class="mt-1">
                    <v-select
                      v-model="vname"
                      :items="videoList"
                      menu-props="auto"
                      label="select"
                      outlined
                      dense
                      single-line
                      @change="selectVideo($event)"
                    ></v-select>
                  </v-col>

                </v-row>
                <!-- video版块 -->
                <div fill-height outlined class="mx-3">
                  <div class="mx-5">
                    <v-tabs
                      background-color="grey lighten-3 "
                      fixed-tabs
                      height="35" >
                      <v-tab href="#video" @click="flag = false" >
                        <v-icon>mdi-video</v-icon>
                      </v-tab>
                    </v-tabs>
                    <!-- 展示内容 -->
                    <v-card max-height="780" >
                      <!-- 使用iframe会出现分辨率不适配的问题 -->
                      <video-player
                        ref="videoPlayer"
                        class="video-player vjs-custom-skin"
                        :playsinline="true"
                        :options="playerOptions"
                        @play="onPlayerPlay($event)"
                        @pause="onPlayerPause($event)"
                      />
                    </v-card>
                  </div>
                 
                <div>
                   
                      <!-- 视频卡片区 -->
                      <v-row>
                        <v-sheet class="mx-auto" width="100%">
                          <v-slide-group
                            
                            class="pt-5"
                            show-arrows
                          >
                            <v-slide-item
                              v-for="(item, id) in videoList"
                              class="ma-3"
                              :key="id"
                              align="center"
                              
                            >
                              <v-hover>
                                <template v-slot:default="{ hover }" >
                                  <v-card class="mt-5" max-width="23%" max-height="220px"
                                  >
                                    <v-img
                                      max-height="75%"
                                      :src="item.pic"
                                    ></v-img>

                                    <v-card-text>
                                      <h2
                                        class=" primary--text"
                                        v-html="item.text"
                                      ></h2>
                                    </v-card-text>

                                    <v-fade-transition>
                                      <v-overlay
                                        v-if="hover"
                                        absolute
                                        color="#036358"
                                      >
                                        <v-btn 
                                          value="item.text"
                                          @click="nextvideo(item.text)"
                                   
                                          >Learn more</v-btn
                                        >
                                      </v-overlay>
                                    </v-fade-transition>
                                  </v-card>
                                </template>
                              </v-hover>
                            </v-slide-item>
                          </v-slide-group>
                        </v-sheet>
                      </v-row>
                    
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
import axios from "axios";
export default {
  name: "Class",

  data() {

    return {
      model:1,
      vname:"",
      picmodel: null,
      videoSrc:"",
      vsrc:"",
      videoList: [],
       playerOptions: {
                playbackRates: [0.5, 1.0, 1.5, 2.0], // 可选的播放速度
                autoplay: false,  // 如果为true,浏览器准备好时开始回放
                muted: false,     // 默认情况下将会消除任何音频。
                loop: false,      // 是否视频一结束就重新开始。
                preload: 'auto',  // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: 'zh-CN',
                aspectRatio: '16:9',  // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true,  // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
               
               sources: [{
                    type: "video/mp4",  // 类型
                    src:"" ,  // url地址
                }],
                // poster: '',  // 封面地址
                width: document.documentElement.clientWidth, // 播放器宽度
                notSupportedMessage: '此视频暂无法播放，请稍后再试',  // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                    timeDivider: true,           // 当前时间和持续时间的分隔符
                    durationDisplay: true,       // 显示持续时间
                    remainingTimeDisplay: false, // 是否显示剩余时间功能
                    fullscreenToggle: true       // 是否显示全屏按钮
                }
       }

    };
  },
  components: {},
  methods: {
     PassClass(){
    var self =this;
    self.currentClass = self.$route.params.currentClass;
    this.currentClass = self.currentClass;
    // console.log(111+ this.currentClass)
    },
   PassSrc(){
      var self =this;
      self.src = self.$route.params.v_src;
      self.v_name = self.$route.params.v_name;
      self.pic = self.$route.params.v_pic;
      this.PassPPtSrc = self.src;
      this.vname = self.v_name;
      this.videoSrc = self.src;
      // console.log("1"+this.vname)
      this.playerOptions.sources[0].src=this.videoSrc;
              
    },
    loadVideo(){
     axios({
        method: "get",
        url: "https://danxiagis.top:8081/uploadData/get",
      }).then((response) => {
      const res = response.data;
      for (var i = 0; i < res.length; i++) {
         const resInfo = res[i].info; 
      
        //调试用视频
         if(res[i]._id=='视频'){
          //  console.log(res[i])
        for (var a = 0; a < resInfo.length; a++) { 
             const vitem = {
              pic: resInfo[a].picture,
              vsrc:resInfo[a].video,
              text:resInfo[a].topic
             }  
            this.videoList.push(vitem);
            }
              // console.log(this.videoList)
        }
      
        }
      })
    },
    //图片点击选择事件
    nextvideo(text){
    // console.log(text);
     for (var i = 0; i < this.videoList.length; i++) {
        if (text == this.videoList[i].text) {
          this.vsrc = this.videoList[i].vsrc;
          }
        }
    //  console.log(this.vsrc);
     this.playerOptions.sources[0].src=this.vsrc;  
     this.vname=text;
    },
    // selection点击选择
    selectVideo(event){
    // console.log(event);
    
     for (var i = 0; i < this.videoList.length; i++) {
        if (event == this.videoList[i].text) {
          this.vsrc = this.videoList[i].vsrc;
          }
        }
    //  console.log(this.vsrc);
     this.playerOptions.sources[0].src=this.vsrc;  
    },


  },
   mounted: function () {
    // this.loadPPTList();
    this.PassSrc();
    this. loadVideo();
    this.PassClass()
  },
  created:function(){
    // this.PassSrc();
  }
  };
</script>
<style>
#r {
  min-height: 900px; 
  width: 80%;
  position: relative;
  box-shadow: 0px 0px 3px rgb(160, 157, 157);
  left: 20px;
  top: 20px;
  margin-bottom: 40px;
  border-radius: 3%;
}
</style>