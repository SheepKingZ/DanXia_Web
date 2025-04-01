<template  >
  <v-app class="green lighten-5">
    <v-container fluid style="margin:auto; left: 10%;position: relative;">
      <v-row>
        <div id="r">
          
          <v-card class="mx-auto pb-10"  min-height="100%" min-width="100%">
           <div v-show="isteacher">
            <v-card-title >问题发布</v-card-title>
            <v-row class="mx-8">
            <v-col cols="10">
            <v-textarea
                outlined
                name="input-7-4"
                v-model="ques_text"
            ></v-textarea></v-col>
            <v-btn  class="mx-8 my-5" outlined @click="QusSent()">确认发布</v-btn>
          </v-row>
           </div>
           <v-divider class="pt-10"></v-divider>
          
            <v-list v-for="(item, index) in QuesList" :key="index" class="px-10 ">
              <v-list-item >
                <v-row>
                  <v-col cols="10" >
                      <v-list-item-icon>
                      <v-icon color="green lighten-1">mdi-forward</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                      <v-list-item-title  v-html="item"></v-list-item-title>
                    
                    <v-btn
                      class="ma-2 text-end"
                      outlined
                      color="green lighten-1"
                      absolute
                      right
                      @click="nextpage(item)"
                    >
                      <v-icon>mdi-forum</v-icon>
                      <span>加入讨论</span>
                    </v-btn>
                   
                    </v-list-item-content>
                  </v-col>
                </v-row>
              </v-list-item>
              <v-divider class="mt-3"></v-divider>
            </v-list>
          
          </v-card>
        </div>
      </v-row>
    </v-container>
  </v-app>
</template>
<style>
#r {
  min-height: 900px; 
  min-width: 80%;
  position: relative;
  box-shadow: 0px 0px 3px rgb(160, 157, 157);
  left: 20px;
  top: 20px;
  margin-bottom: 50px;
  border-radius: 3%;
}

</style>
<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: "DisscusList",
  setup() {
    const router = useRouter();

    // 响应式状态
    const QuesList = ref(["这里的沉积岩是如何形成的", "天生桥"]);
    const reveal = ref(false);
    const model = ref(2);
    const ques_text = ref('');
    const isteacher = ref('');
    const title = ref('');

    // 方法
    const nextpage = (e) => {
      title.value = e;
      router.push({
        name: "Disscus",
        params: {
          title: title.value,
        },
      });
      router.replace('/front/pages/learning/Disscus');
    };

    const QusSent = () => {
      if (ques_text.value !== '') {
        QuesList.value.push(ques_text.value);
        alert('发布成功');
      } else {
        alert('请输入问题');
      }
    };

    onMounted(() => {
      // console.log(sessionStorage.isteacher)
      if (sessionStorage.isteacher === 'false' || sessionStorage.isvisiter === 'true') {
        isteacher.value = false;
      } else if (sessionStorage.isteacher === 'true') {
        isteacher.value = true;
      }
    });

    return {
      QuesList,
      reveal,
      model,
      ques_text,
      isteacher,
      title,
      nextpage,
      QusSent
    };
  }
};
</script>