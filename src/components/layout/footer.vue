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
              <v-list-subheader class="text-h6">往年回顾</v-list-subheader>
              <p>
                <button @click="checkVideoFun">
                  2021级生态学专业自然地理学野外综合实习</button
                ><br />
                <button @click="checkVideoFun1">
                  2022级地理信息科学专业地理综合实习</button
                ><br />
              </p>
              <!-- 外层的遮罩 v-if用来控制显示隐藏 点击事件用来关闭弹窗 -->
              <div
                class="mask"
                v-if="videoState"
                @click="masksCloseFun"
              ></div>
              <!-- 弹窗 -->
              <div class="videomasks" v-if="videoState">
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
                v-if="videoState1"
                @click="masksCloseFun1"
              ></div>
              <!-- 弹窗 -->
              <div class="videomasks" v-if="videoState1">
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
import { ref } from 'vue';

export default {
  setup() {
    const videoSrc = ref("video/生态实习视频.mp4");
    const videoSrc1 = ref("video/实习视频.mp4");
    const videoState = ref(false);
    const videoState1 = ref(false);
    
    const cimsInputClick = () => {
      window.location.href = "http://dxs.sg.gov.cn/";
    };
    
    // 点击按钮出现弹窗播放视频
    const checkVideoFun = () => {
      videoState.value = true;
    };
    
    const masksCloseFun = () => {
      videoState.value = false;
    };
    
    const checkVideoFun1 = () => {
      videoState1.value = true;
    };
    
    const masksCloseFun1 = () => {
      videoState1.value = false;
    };
    
    return {
      videoSrc,
      videoSrc1,
      videoState,
      videoState1,
      cimsInputClick,
      checkVideoFun,
      masksCloseFun,
      checkVideoFun1,
      masksCloseFun1
    };
  }
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
