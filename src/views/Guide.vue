<template>
  <div style="background-color: rgba(239, 247, 233, 0.891)">
    <v-carousel
      cycle
      style="width: 95%; margin: auto"
      height="575px"
      interval="4500"
      :show-arrows-on-hover="true"
    >
      <v-carousel-item
        v-for="(item, i) in items"
        :key="i"
        :src="item.src"
        reverse-transition="fade-transition"
        transition="fade-transition"
      ></v-carousel-item>
    </v-carousel>

    <v-sheet
      tile
      class="py-12"
      style="background-color: rgba(239, 247, 233, 0.891)"
    >
      <v-container style="background-color: rgba(249, 251, 247, 0.863)">
        <!-- style="background-color: rgba(233, 246, 224, 0.863);" -->
        <div class="text-center my-12">
          <h2 class="text-h3 font-weight-bold">通过这个网站你可以获得什么？</h2>
        </div>

        <div class="my-12">
          <v-row class="py-10" justify="space-around">
            <v-col cols="2" md="4">
              <v-card>
                <v-img src="../assets/陆相红层沉积.gif"></v-img
                ><!-- https://danxiagis.top:3007/image/banner3.jpg -->
              </v-card>
            </v-col>
            <v-col cols="12" md="5">
              <div>
                <h3 class="text-h4 my-3">实习路线</h3>

                <div class="grey--text text--darken-1">
                  <h4 class="text-h6 my-3 font-weight-regular">
                    了解实习线路及相关实习点
                  </h4>
                  <div class="my-5">
                    <p class="font-weight-regular">
                      该模块展示了实习过程中的路线，包括其中的实习点<br />
                      以及相关数据。
                    </p>
                  </div>
                </div>

                <div class="my-12">
                  <v-btn
                    color="secondary"
                    class="text-capitalize"
                    large
                    to="/front/pages/route/route"
                    >开始了解</v-btn
                  >
                </div>

                <div class="my-12">
                  <v-row align="center">
                    <v-col class="flex-grow-0">
                      <v-avatar color="secondary">
                        <v-icon large dark>mdi-map-marker-path</v-icon>
                      </v-avatar>
                    </v-col>

                    <v-col class="flex-shrink-1">
                      <div>
                        <h4 class="text-body-1">Created by</h4>
                        <h3 class="subtitle font-weight-regular">DanXia</h3>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>

        <div class="my-12">
          <v-row class="py-12" justify="space-around">
            <v-col cols="12" md="5">
              <div>
                <h3 class="text-h4 my-3">飞行浏览</h3>

                <div class="grey--text text--darken-1">
                  <h4 class="text-h6 my-3 font-weight-regular">
                    通过飞行的方式浏览周围景象
                  </h4>
                  <div class="my-5">
                    <p class="font-weight-regular">
                      在三维地图中，通过飞行浏览方式查看实习线路中的沿途风景，也可以自己重新定义线路，
                      自由查看丹霞景象。
                    </p>
                  </div>
                </div>

                <div class="my-12">
                  <v-btn
                    color="primary"
                    class="text-capitalize"
                    large
                    to="/front/pages/fly/fly"
                    >开始浏览</v-btn
                  >
                </div>

                <div class="my-12">
                  <v-row align="center">
                    <v-col class="flex-grow-0">
                      <v-avatar color="primary">
                        <v-icon icon="mdi-airplane"></v-icon>
                      </v-avatar>
                    </v-col>

                    <v-col class="flex-shrink-1">
                      <div>
                        <h4 class="text-body-1">Created by</h4>
                        <h3 class="subtitle font-weight-regular">DanXia</h3>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-col>

            <v-col cols="2" md="4">
              <v-card>
                <v-img src="../assets/重力坍塌形成陡崖.gif"></v-img
                ><!-- https://danxiagis.top:3007/image/banner1.jpg -->
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- 新增的Cesium 3D游览部分 -->
        <div class="my-12">
          <v-row class="py-12" justify="space-around">
            <v-col cols="2" md="4">
              <v-card>
                <v-img src="../assets/陆相红层沉积.gif"></v-img>
              </v-card>
            </v-col>
            <v-col cols="12" md="5">
              <div>
                <h3 class="text-h4 my-3">丹霞3D地形游览</h3>

                <div class="grey--text text--darken-1">
                  <h4 class="text-h6 my-3 font-weight-regular">
                    沉浸式体验丹霞地貌3D地形
                  </h4>
                  <div class="my-5">
                    <p class="font-weight-regular">
                      使用先进的Cesium 3D技术，探索丹霞地区的精细地形。创建自定义飞行路线，从各个角度观察地貌特征，获得身临其境的地质体验。
                    </p>
                  </div>
                </div>

                <div class="my-12">
                  <v-btn
                    color="error"
                    class="text-capitalize"
                    large
                    to="/front/pages/cesium3d/tour"
                    style="animation: pulse 2s infinite;"
                    >
                    <v-icon icon="mdi-earth" class="mr-1"></v-icon>
                    开始3D探索
                  </v-btn>
                </div>

                <div class="my-12">
                  <v-row align="center">
                    <v-col class="flex-grow-0">
                      <v-avatar color="error">
                        <v-icon icon="mdi-earth"></v-icon>
                      </v-avatar>
                    </v-col>

                    <v-col class="flex-shrink-1">
                      <div>
                        <h4 class="text-body-1">Created by</h4>
                        <h3 class="subtitle font-weight-regular">DanXia</h3>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>

        <div class="my-12">
          <v-row class="py-12" justify="space-around">
            <v-col cols="2" md="4">
              <v-card>
                <v-img src="../assets/中国东南丹霞地貌演化.gif"></v-img
                ><!-- https://danxiagis.top:3007/image/banner6.jpg -->
              </v-card>
            </v-col>
            <v-col cols="12" md="5">
              <div>
                <h3 class="text-h4 my-3">资料学习</h3>

                <div class="grey--text text--darken-1">
                  <h4 class="text-h6 my-3 font-weight-regular">
                    充分的资料用于课前学习
                  </h4>
                  <div class="my-5">
                    <p class="font-weight-regular">
                      该模块可以观看老师上传的学习资料，用于课前预习，在预习中会记录学习时长，作为成绩考评的一部分。
                    </p>
                  </div>
                </div>

                <div class="my-12">
                  <v-btn
                    color="secondary"
                    class="text-capitalize"
                    large
                    to="/front/pages/download/download1"
                    v-show="isuser"
                    >开始学习</v-btn
                  >
                </div>

                <div class="my-12">
                  <v-row align="center">
                    <v-col class="flex-grow-0">
                      <v-avatar color="secondary">
                        <v-icon icon="mdi-book-open-page-variant"></v-icon>
                      </v-avatar>
                    </v-col>

                    <v-col class="flex-shrink-1">
                      <div>
                        <h4 class="text-body-1">Created by</h4>
                        <h3 class="subtitle font-weight-regular">DanXia</h3>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>

        <div class="my-12">
          <v-row class="py-12" justify="space-around">
            <v-col cols="12" md="5">
              <div>
                <h3 class="text-h4 my-3">分析工具</h3>

                <div class="grey--text text--darken-1">
                  <h4 class="text-h6 my-3 font-weight-regular">
                    独特的分析处理工具
                  </h4>
                  <div class="my-5">
                    <p class="font-weight-regular">
                      该模块包括剖面线工具、路径分析和可见性分析，能够对实习路线及点位进行进一步分析。
                    </p>
                  </div>
                </div>

                <div class="my-12">
                  <v-btn
                    color="primary"
                    class="text-capitalize"
                    large
                    to="/front/pages/projectStudies/SectionLine"
                    >开始体验</v-btn
                  >
                </div>

                <div class="my-12">
                  <v-row align="center">
                    <v-col class="flex-grow-0">
                      <v-avatar color="primary">
                        <v-icon large dark> mdi-text-box-search-outline</v-icon>
                      </v-avatar>
                    </v-col>

                    <v-col class="flex-shrink-1">
                      <div>
                        <h4 class="text-body-1">Created by</h4>
                        <h3 class="subtitle font-weight-regular">DanXia</h3>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-col>

            <v-col cols="2" md="4">
              <v-card>
                <v-img src="../assets/深切曲流差异风化.gif"></v-img
                ><!-- https://danxiagis.top:3007/image/banner4.jpg -->
              </v-card>
            </v-col>
          </v-row>
        </div>
        <div class="my-12">
          <v-row class="py-12" justify="space-around">
            <v-col cols="2" md="4">
              <v-card>
                <v-img src="../assets/线状瀑布侵蚀.gif"></v-img
                ><!-- https://danxiagis.top:3007/image/banner6.jpg -->
              </v-card>
            </v-col>
            <v-col cols="12" md="5">
              <div>
                <h3 class="text-h4 my-3">实习报告</h3>

                <div class="grey--text text--darken-1">
                  <h4 class="text-h6 my-3 font-weight-regular">
                    实习成果的体现
                  </h4>
                  <div class="my-5">
                    <p class="font-weight-regular">
                      该模块包括实习报告和拍照的一些注意事项，并在实习结束后可以进行编辑，上传提交。
                    </p>
                  </div>
                </div>

                <div class="my-12">
                  <v-btn
                    color="secondary"
                    class="text-capitalize"
                    large
                    to="/front/pages/report/groupReport"
                    v-show="isuser"
                    >查看更多</v-btn
                  >
                </div>

                <div class="my-12">
                  <v-row align="center">
                    <v-col class="flex-grow-0">
                      <v-avatar color="secondary">
                        <v-icon large dark>mdi-file-chart</v-icon>
                      </v-avatar>
                    </v-col>

                    <v-col class="flex-shrink-1">
                      <div>
                        <h4 class="text-body-1">Created by</h4>
                        <h3 class="subtitle font-weight-regular">DanXia</h3>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-sheet>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';

export default {
  setup() {
    const items = reactive([
      {
        src: "https://danxiagis.top:3007/image/banner1.jpg",
      },
      {
        src: "https://danxiagis.top:3007/image/banner2.jpg",
      },
      {
        src: "https://danxiagis.top:3007/image/banner3.jpg",
      },
      {
        src: "https://danxiagis.top:3007/image/banner4.jpg",
      },
      {
        src: "https://danxiagis.top:3007/image/banner5.jpg",
      },
      {
        src: "https://danxiagis.top:3007/image/banner6.jpg",
      },
    ]);
    
    const isuser = ref(false);
    const visiter = ref(false);
    const isteacher = ref(false);
    const isstudent = ref(false);
    const d = ref(0);
    const personPages = reactive([
      {
        pp_isteacher: true,
      },
    ]);
    
    const setTime = () => {
      let timerForReckon = setInterval(function () {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            // console.log(new Date());
            // console.log("111");
          }
        };
        xhr.open("post", "https://danxiagis.top:8081/login/recordingTime"); 
        xhr.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );
        xhr.send(`stu_id=${sessionStorage.getItem("stu_id")}`);
      }, 60000);
      
      let hidden, visibilityChange;
      if (typeof document.hidden !== "undefined") {
        hidden = "hidden";
        visibilityChange = "visibilitychange";
      } else if (typeof document.mozHidden !== "undefined") {
        hidden = "mozHidden";
        visibilityChange = "mozvisibilitychange";
      } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
      } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
      }

      // 添加监听器，在title里显示状态变化
      document.addEventListener(
        visibilityChange,
        function () {
          if (document[hidden]) {
            clearInterval(timerForReckon);
          } else {
            let date = new Date();
            let date1 = new Date(2020, 9, 5);
            d.value = Math.round((date.valueOf() - date1.valueOf()) / 86400000);
            
            timerForReckon = setInterval(function () {
              let xhr = new XMLHttpRequest();
              xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                  // console.log("222");
                }
              };
              xhr.open(
                "post",
                "https://danxiagis.top:8081/login/recordingTime"
              );
              xhr.setRequestHeader(
                "Content-Type",
                "application/x-www-form-urlencoded"
              );
              xhr.send(`stu_id=${sessionStorage.getItem("stu_id")}`);
            }, 60000);
          }
        },
        false
      );
    };
    
    onMounted(() => {
      setTime();
      
      let pageS = sessionStorage.getItem('isteacher');
      let visiterValue = sessionStorage.getItem('isvisiter');
      
      if (visiterValue == "true") {
        isteacher.value = false;
        isstudent.value = false;
        personPages[0].pp_isteacher = false;
      } else {
        visiter.value = true;
        isuser.value = true;
        
        if (pageS == "false") {
          isteacher.value = false;
          isstudent.value = true;
        } else {
          isteacher.value = true;
          isstudent.value = false;
          personPages[0].pp_isteacher = false;
        }
      }
    });
    
    return {
      items,
      isuser,
      visiter,
      isteacher,
      isstudent,
      d,
      personPages,
      setTime
    };
  }
};
</script>

<style scoped>
.carousel {
  perspective: 1200px; /* 定义3D空间的观察距离 */
}

.carousel-item {
  width: 500px; /* 根据需求调整 */
  height: 300px; /* 根据需求调整 */
  position: absolute;
  transition: transform 1s; /* 控制旋转过渡效果 */
  transform-style: preserve-3d; /* 保持3D空间中的子元素 */
}

.carousel-item img {
  width: 100%;
  height: 100%;
  backface-visibility: hidden; /* 隐藏背面，使图片看起来更平滑 */
}

/* 脉动动画效果 */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
    transform: scale(1);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(244, 67, 54, 0);
    transform: scale(1.05);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
    transform: scale(1);
  }
}
</style>
