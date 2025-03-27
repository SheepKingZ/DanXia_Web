<template  >
  <v-app class="green lighten-5">
    <v-container fluid style="margin:auto; left: 10%;position: relative;">
      <v-row>
        
        <div id="r" style="overflow:hidden">
         
          <v-card class="mx-auto py-8"  min-height="100%" min-width="100%">
            <div class="pr-10">
              <router-link
                to="/front/pages/learning/DisscusList"
                class="text-decoration-none"
              >
                <v-subheader
                  class="
                    font-weight-black
                    black--text
                    text-subtitle-1
                    ml-3
                    pt-3
                  "
                >
                  >返回</v-subheader
                >
              </router-link>
              <!-- 教师问题 -->
          <div id="ques">
                <v-icon size="50"> mdi-account</v-icon>
                <span v-html="Question" class="ml-8 font-weight-black"></span>
              </div>

              <div class="text-end" >
                <v-btn
                  v-show="isvisiter"
                  class="ma-2"
                  outlined
                  color="green lighten-1"
                  @click="show = !show"
                >
                  <v-icon>mdi-pencil</v-icon>
                  <span>我的回答</span>
                </v-btn>
              </div>
              <!-- 提问框 -->
              <v-expand-transition>
                <v-card v-show="show" class="ml-10" outlined>
                  <v-form>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-textarea
                            v-model="message"
                            :append-outer-icon="
                              message ? 'mdi-send' : 'mdi-send'
                            "
                            :prepend-icon="icon"
                            auto-grow
                            outlined
                            clear-icon="mdi-close-circle"
                            clearable
                            label="Message"
                            type="text"
                            @click:append-outer="sendMessage"
                            @click:prepend="changeIcon"
                            @click:clear="clearMessage"
                            class="mt-3 mb-n3"
                          ></v-textarea>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-form>
                </v-card>
              </v-expand-transition>
            </div>

            <v-divider class="my-5"></v-divider>
            <!-- 评论区 -->
            <div id="word" class="mx-10 overflow-y-auto " v-scroll.self="onScroll" style="max-height: 70%">
              <v-list v-for="(item, index) in list" :key="index" three-line>
                <v-list-item>
                  <v-row>
                    <v-subheader v-html="index + 1"> </v-subheader>
                    <v-subheader v-html="item.username"> </v-subheader>

                    <v-spacer></v-spacer>

                    <v-list-item-title
                      v-html="item.Text"
                      class="ml-8"
                    ></v-list-item-title>
                  </v-row>
                  <v-btn
                    tile
                    depressed
                    max-width="2"
                    @click="deleteText(index)"
                    class="mr-2"
                    v-show="isteacher"
                  >
                    <v-icon dense> mdi-delete </v-icon>
                  </v-btn>
                  <v-btn
                    tile
                    depressed
                    max-width="2"
                    @click=" Onclick(item)"
                    v-show="isvisiter"
                  >
                    <v-icon dense> mdi-chat </v-icon>
                  </v-btn>
                </v-list-item>
                <v-expand-transition>
                  <v-card v-show="item.comment" class="mx-10" outlined >
                    <v-form>
                      <v-container>
                        <v-row>
                          <v-col cols="12">
                            <v-text-field
                              v-model="commentmessage"
                              row="1"
                              clearable
                              append-outer-icon="mdi-send"
                              @click:append-outer="sendcommentMessage(index,cindex)"
                              class="my-n3 pl-5"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-form>
                  </v-card>
                </v-expand-transition>
                
                <!-- 回复评论 -->
                <v-list
                  v-for="(reply, cindex) in item.commentList"
                  :key="cindex"
                  class="px-8"
                >
                  <v-divider class="mx-8"></v-divider>
                  <v-list-item>
                    <v-row>
                      <v-subheader
                        class="text-sm-body-2"
                        v-html="cindex+1"
                      >
                      </v-subheader>
                      <v-subheader
                        class="text-sm-body-2"
                        v-html="reply.username"
                      >
                      </v-subheader>

                      <v-spacer></v-spacer>

                      <v-list-item-title
                        v-html="reply.replytext"
                        class="ml-8 text-sm-body-2"
                      ></v-list-item-title>
                    </v-row>
                    <v-btn
                      tile
                      depressed
                      max-width="2"
                      @click="deletecommentText(index, cindex)"
                      v-show="isteacher"
                      class="mr-2"
                    >
                      <v-icon dense> mdi-delete </v-icon>
                    </v-btn>
                  </v-list-item>
                </v-list>
                <v-divider class="mt-3"></v-divider>
              </v-list>
            </div>
          </v-card>
        </div>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { ref, reactive, computed, onMounted, onCreated } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: "Disscus",
  
  setup() {
    const route = useRoute();
    
    const model = ref(2);
    const show = ref(false);
    const isvisiter = ref('');
    const commentmessage = ref("");
    const message = ref("");
    const marker = ref(true);
    const iconIndex = ref(0);
    const isteacher = ref('');
    const icons = [
      "mdi-emoticon",
      "mdi-emoticon-cool",
      "mdi-emoticon-dead",
      "mdi-emoticon-excited",
      "mdi-emoticon-happy",
      "mdi-emoticon-neutral",
      "mdi-emoticon-sad",
      "mdi-emoticon-tongue",
    ];
    
    const list = reactive([
      {
        username: "学生A",
        Text: "a",
        comment: false,
        commentList: [
          {
            username: "xsB",
            replytext: "yes",
          },
        ],
      },
    ]);
    
    const Question = ref("");
    
    // 计算属性
    const icon = computed(() => {
      return icons[iconIndex.value];
    });
    
    // 评论区回复框
    const Onclick = (item) => {
      // console.log(e.target);
      if(item.comment) {
        // console.log(item)
        item.comment = false;
        // console.log(item.comment);
      } else {
        item.comment = true;
      }
    };
    
    const deleteText = (index) => {
      list.splice(index, 1);
    };
    
    const deletecommentText = (index, cindex) => {
      list[index].commentList.splice(cindex, 1);
    };
    
    const sendMessage = () => {
      // resetIcon();
      // console.log(sessionStorage.username);
      if (!message.value) {
        alert("评论不能为空");
        return;
      } else {
        list.push({ 
          Text: message.value, 
          comment: false, 
          username: sessionStorage.userName, 
          commentList: []
        });
      }
      // alert(list.index);
      clearMessage();
    };
    
    const clearMessage = () => {
      //console.log(11111);
      message.value = "";
    };
    
    const resetIcon = () => {
      iconIndex.value = 0;
    };
    
    const changeIcon = () => {
      iconIndex.value === icons.length - 1
        ? (iconIndex.value = 0)
        : iconIndex.value++;
    };
    
    const sendcommentMessage = (index) => {
      if (!commentmessage.value) {
        alert("评论不能为空");
        return;
      } else {
        // console.log(list[index]);
        // console.log(list[index].commentList);
        // console.log(index);
        list[index].commentList.push({
          replytext: commentmessage.value,
          username: sessionStorage.userName,
        });
      }
      
      commentmessage.value = "";
    };
    
    // 模拟 created 生命周期钩子
    // 获取传递的问题标题
    Question.value = route.params.title;
    
    // 判断用户权限
    if (sessionStorage.isteacher == 'true') {
      isteacher.value = true;
    } else {
      isteacher.value = false;
    }
    
    if (sessionStorage.isvisiter == 'true') {
      isvisiter.value = false;
    } else {
      isvisiter.value = true;
    }
    
    const onScroll = () => {
      // 滚动处理函数
    };

    return {
      model,
      show,
      isvisiter,
      commentmessage,
      message,
      marker,
      iconIndex,
      isteacher,
      icons,
      list,
      Question,
      icon,
      Onclick,
      deleteText,
      deletecommentText,
      sendMessage,
      clearMessage,
      resetIcon,
      changeIcon,
      sendcommentMessage,
      onScroll
    };
  }
};
</script>
<style>
#ques {
  padding: 5px 0 0 50px;
}
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
#pi {
  display: inline-block;
}
</style>