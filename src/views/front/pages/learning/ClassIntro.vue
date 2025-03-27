<template  >
  <v-app class="green lighten-5">
    <v-container fluid>
      <v-row>
        <v-card class="pull-left ml-5 mt-5" height="500px" min-width="11%">
          <v-list>
            <v-list-item-group v-model="model" >
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
                  name: 'ClassList',
                  params: { currentClass: this.currentClass },
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
              <!-- <router-link
                to="/front/pages/learning/DisscusList"
                class="text-decoration-none"
              >
              <v-list-item  link>
                <v-list-item-icon>
                  <v-icon>mdi-message</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>讨论区</v-list-item-title>
                </v-list-item-content>
              </v-list-item> 
              </router-link> -->
            </v-list-item-group>
          </v-list>
        </v-card>

        <div id="r">
          <v-card class="mx-auto" min-height="100%" min-width="100%">
            <v-card-text>
              <p id="pi" class="ml-5 mt-5 text-h6 font-weight-bold">
                课程名称 :
              </p>

              <p id="pi" class="ml-7 body-1">{{ currentItem.title }}</p>
              <v-btn
                outlined
                color="green lighten-1"
                absolute
                right
                @click="goBack"
                title="返回"
              >
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
              <br /> <p id="pi" class="ml-5  text-h6 font-weight-bold">
                任课老师 :
              </p>

              <p id="pi" class="ml-7 body-1">{{ currentItem.teacher }}</p>

              
              <p class="ml-5 text-h6 font-weight-bold">课程性质 ：</p>
              <v-textarea
                class="ml-5"
                v-if="isTeacher"
                v-model="currentItem.xingzhi"
                @change="updateIntro"
                auto-grow
                style="font-family: '楷体', sans-serif; font-size: 18px;" 
              ></v-textarea>
              <p class="mx-8" style="white-space: pre-wrap" v-if="!isTeacher">
                {{ currentItem.xingzhi }}
              </p>
              <p class="ml-5 text-h6 font-weight-bold">课程目的与要求 ：</p>
              <v-textarea
                class="ml-5"
                v-if="isTeacher"
                v-model="currentItem.aim"
                @change="updateIntro"
                auto-grow
                style="font-family: '楷体', sans-serif; font-size: 18px;" 
              ></v-textarea>
              <p class="mx-8" style="white-space: pre-wrap" v-if="!isTeacher">
                {{ currentItem.aim }}
              </p>
              <p class="ml-5 text-h6 font-weight-bold">教学重点与难点 ：</p>
              <v-textarea
                class="ml-5"
                v-if="isTeacher"
                v-model="currentItem.difficult"
                @change="updateIntro"
                auto-grow
                style="font-family: '楷体', sans-serif; font-size: 18px;" 
              ></v-textarea>
              <p class="mx-8" style="white-space: pre-wrap" v-if="!isTeacher">
                {{ currentItem.difficult }}
              </p>
              <p class="ml-5 text-h6 font-weight-bold">教学内容 ：</p>
              <v-textarea
                class="ml-5"
                v-if="isTeacher"
                v-model="currentItem.content"
                @change="updateIntro"
                auto-grow
                style="font-family: '楷体', sans-serif; font-size: 18px;" 
              ></v-textarea>
              <p class="mx-8" style="white-space: pre-wrap" v-if="!isTeacher">
                {{ currentItem.content }}
              </p>
            </v-card-text>
          </v-card>
        </div>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from "axios";

export default {
  name: "ClassIntro",
  
  setup() {
    const route = useRoute();
    const router = useRouter();
    
    const isTeacher = ref(sessionStorage.getItem("isteacher") == "true" ? true : false);
    const reveal = ref(false);
    const model = ref(0);
    const currentClass = ref("");
    const currentItem = ref({});
    const InfoItem = reactive([]);
    
    const updateIntro = () => {
      axios({
        url: "https://danxiagis.top:8081/teacher/updateCourseIntro",
        method: "post",
        data: {
          couName: currentItem.value.title,
          teaName: currentItem.value.teacher,
          nature: currentItem.value.xingzhi,
          objectives: currentItem.value.aim,
          focus: currentItem.value.difficult,
          content: currentItem.value.content,
        },
      }).then((res) => {
        console.log(res);
        alert(res.data);
        CurrentItem();
      });
    };
    
    const goBack = () => {
      router.push({
        name: "FirstView",
      });
    };
    
    const CurrentItem = () => {
      axios({
        url: "https://danxiagis.top:8081/teacher/courseIntro/get",
        method: "get",
      }).then((res) => {
        Object.assign(InfoItem, res.data);
        for (let i = 0; i < InfoItem.length; i++) {
          if (InfoItem[i].courseName == currentClass.value) {
            currentItem.value = {
              title: InfoItem[i].courseName,
              xingzhi: InfoItem[i].natureCurriculum,
              teacher: InfoItem[i].teacherName,
              content: InfoItem[i].teaching_content,
              aim: InfoItem[i].course_objectives,
              difficult: InfoItem[i].teaching_focus,
            };
          }
        }
      });
    };
    
    const PassClass = () => {
      currentClass.value = route.params.currentClass;
    };
    
    onMounted(() => {
      PassClass();
      CurrentItem();
    });
    
    return {
      isTeacher,
      reveal,
      model,
      currentClass,
      currentItem,
      InfoItem,
      updateIntro,
      goBack,
      CurrentItem,
      PassClass
    };
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
#pi {
  display: inline-block;
}
</style>