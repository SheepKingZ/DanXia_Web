<template>
  <div>
    <v-footer color="primary" dark app absolute>
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="10">
            <h4 class="text-h5 font-weight-bold">华南农业大学</h4>
            <p class="text-body-1">
              广东省广州市天河区五山路483号华南农业大学<br />
              邮编： 510642<br />
              微信公众号： 虚拟丹霞pro<br />
            </p>
          </v-col>

          <v-col cols="12" md="2">
            <v-list flat color="transparent">
              <v-subheader class="text-h6">往年回顾</v-subheader>
              <p>
                <button @click="checkVideoFun()">
                  2021级生态学专业自然地理学野外综合实习</button
                ><br />
                <button @click="checkVideoFun1()">
                  2022级地理信息科学专业地理综合实习</button
                ><br />
              </p>
              <!-- 外层的遮罩 v-if用来控制显示隐藏 点击事件用来关闭弹窗 -->
              <div
                class="mask"
                v-if="videoState == true"
                @click="masksCloseFun"
              ></div>
              <!-- 弹窗 -->
              <div class="videomasks" v-if="videoState == true">
                <!-- 视频：h5的视频播放video -->
                <video
                  :src="videoSrc"
                  controls="controls"
                  autoplay
                  width="100%"
                  height="100%"
                >
                  您的浏览器不支持 video 标签。
                </video>
              </div>
              <div
                class="mask"
                v-if="videoState1 == true"
                @click="masksCloseFun1"
              ></div>
              <!-- 弹窗 -->
              <div class="videomasks" v-if="videoState1 == true">
                <!-- 视频：h5的视频播放video -->
                <video
                  :src="videoSrc1"
                  controls="controls"
                  autoplay
                  width="100%"
                  height="100%"
                >
                  您的浏览器不支持 video 标签。
                </video>
              </div>
              <!-- <v-list-item-group color="primary">
                <v-list-item
                  v-for="(item, i) in bofang"
                  :key="i"
                  :href="item.href"
                  dense
                  target="_black"
                >
                  <v-list-item-content>
                    
                    <v-list-item-title
                      class="text-body-1"
                      v-text="item.text"
                    ></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
              <v-list-item-group color="primary">
                <v-list-item
                  v-for="(item, i) in bofang"
                  :key="i"
                  :href="item.href"
                  dense
                  target="_black"
                >
                  <v-list-item-content>
                    
                    <v-list-item-title
                      class="text-body-1"
                      v-text="item.text"
                    ></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group> -->
            </v-list>
          </v-col>
        </v-row>

        <div class="text-center mt-6">
          Copyright &copy;
          <a
            class="white--text"
            href="*"
            target="_blank"
            rel="noopener noreferrer"
            >虚拟丹霞</a
          >
          {{ new Date().getFullYear() }}. All rights reserved.
        </div>
      </v-container>
    </v-footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      videoSrc: "video/生态实习视频.mp4",
      videoSrc1: "video/实习视频.mp4",
      videoState: false,
      videoState1: false,
    };
  },
  methods: {
    cimsInputClick() {
      window.location.href = "http://dxs.sg.gov.cn/";
    },
    bofang() {},
    //点击按钮出现弹窗播放视频
    checkVideoFun() {
      this.videoState = true;
    },
    masksCloseFun() {
      this.videoState = false;
    },
    checkVideoFun1() {
      this.videoState1 = true;
    },
    masksCloseFun1() {
      this.videoState1 = false;
    },
  },
};
</script>
<style scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 10;
  background-color: #000000;
  opacity: 0.6;
}
/* 内容层 z-index要比遮罩大，否则会被遮盖 */
.videomasks {
  max-width: 1200px;
  position: fixed;
  left: 0;
  top: 50%;
  margin-top: -20%;
  z-index: 20;
  /* transform: translate(-50%, -50%); */
}
</style>
