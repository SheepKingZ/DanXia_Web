<template>
  <div>
    <v-footer color="primary" dark app absolute class="footer">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="10" class="footer-section">
            <h4 class="text-h5 font-weight-bold footer-title">华南农业大学</h4>
            <p class="text-body-1 footer-links">
              广东省广州市天河区五山路483号华南农业大学<br />
              邮编： 510642<br />
              微信公众号： 虚拟丹霞pro<br />
            </p>
          </v-col>

          <v-col cols="12" md="2" class="footer-section">
            <v-list flat color="transparent" class="historical-records-section">
              <v-list-subheader class="text-h6 history-title">往年回顾</v-list-subheader>
              <div class="video-buttons">
                <v-btn
                  block
                  color="white"
                  variant="outlined"
                  prepend-icon="mdi-video"
                  class="video-btn mb-3"
                  @click="checkVideoFun"
                >
                  <div class="btn-content">
                    <span class="btn-title">2021级生态学专业</span>
                    <small>自然地理学野外综合实习</small>
                  </div>
                </v-btn>
                
                <v-btn
                  block
                  color="white"
                  variant="outlined"
                  prepend-icon="mdi-video"
                  class="video-btn"
                  @click="checkVideoFun1"
                >
                  <div class="btn-content">
                    <span class="btn-title">2022级地理信息科学</span>
                    <small>专业地理综合实习</small>
                  </div>
                </v-btn>
              </div>

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

        <div class="text-center mt-6 footer-bottom">
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
  max-width: 80%;
  width: 800px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
}

/* 修改往年回归区域的背景颜色 - 与主题一致 */
.historical-records-section {
  background-color: var(--v-primary-base, #1976d2); /* 使用与主题相同的颜色 */
  border-radius: 8px;
  padding: 15px;
  margin: 10px 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* 往年回顾标题样式 */
.history-title {
  font-weight: bold;
  color: white !important;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 12px;
  padding-bottom: 8px;
}

/* 视频按钮容器 */
.video-buttons {
  padding: 5px 0;
}

/* 视频按钮样式优化 */
.video-btn {
  text-align: left;
  border-radius: 6px !important;
  padding: 8px 10px !important;
  transition: all 0.3s ease;
  height: auto !important;
  min-height: 60px;
  line-height: 1.2;
  border: 1px solid white !important;
  color: white !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.video-btn .v-icon {
  color: white !important;
  margin-right: 5px;
}

.btn-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
}

.btn-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.video-btn small {
  display: block;
  opacity: 0.85;
  font-size: 0.75em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.video-btn:hover {
  background-color: rgba(255, 255, 255, 0.2) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* 视频模态框优化 */
.videomasks {
  max-width: 80%;
  width: 800px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
}

/* 修复往年回归区域的背景颜色 */
.historical-records-section {
  background-color: #f5f5f5; /* 浅灰色背景，替代纯白色 */
  border-radius: 8px;
  padding: 20px;
  margin: 15px 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

/* 往年回顾标题样式 */
.history-title {
  font-weight: bold;
  color: #1976d2 !important;
  border-bottom: 2px solid #1976d2;
  margin-bottom: 16px;
  padding-bottom: 8px;
}

/* 视频按钮容器 */
.video-buttons {
  padding: 8px 0;
}

/* 视频按钮样式 */
.video-btn {
  text-align: left;
  border-radius: 8px !important;
  padding: 8px 16px !important;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: auto !important;
  line-height: 1.3;
}

.video-btn small {
  display: block;
  opacity: 0.85;
  font-size: 0.8em;
  margin-top: 2px;
}

.video-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 美化整体 footer */
.footer {
  background-color: var(--v-primary-base, #1976d2);
  color: white;
  padding: 30px 0 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.footer-section {
  margin-bottom: 20px;
}

.footer-title {
  font-weight: 500;
  margin-bottom: 15px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 8px;
}

.footer-links a,
.footer-links div {
  transition: color 0.3s;
  display: block;
  padding: 5px 0;
}

.footer-links a:hover {
  color: #b3e5fc !important;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 15px;
  margin-top: 10px;
  text-align: center;
  font-size: 0.85rem;
}

.social-icons {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

/* 适配移动端 */
@media (max-width: 960px) {
  .footer {
    padding: 20px 0 10px;
  }
  
  .videomasks {
    width: 95%;
  }
}
</style>
