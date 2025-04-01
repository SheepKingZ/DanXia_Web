<template  >
  <v-app class="green lighten-5">
    <v-container fluid>
      <v-row>
        <v-card class="pull-left ml-5 mt-5" height="500px" min-width="11%">
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
                  <v-list-item-title>课程介绍</v-list-item-title>
                </v-list-item>
              </router-link>
              <router-link
                :to="{
                  name: 'ClassList',
                  params: { currentClass: currentClass },
                }"
                class="text-decoration-none"
              >
                <v-list-item link>
                  <v-list-item-icon>
                    <v-icon>mdi-book</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>课程内容</v-list-item-title>
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
                  <v-list-item-title>讨论区</v-list-item-title>
                </v-list-item> -->
              </router-link>
            </v-list-item-group>
          </v-list>
        </v-card>

        <div id="r">
          <v-card class="mx-auto" min-height="100%" min-width="100%">
            <div class="px-7">
              <v-list-item>
                <v-list-item-title class="mt-8 text-h6 font-weight-bold"
                  >教学章节</v-list-item-title
                >
              </v-list-item>
              <br />
              <!-- 第一层subject -->
              <v-list-group
                :value="true"
                prepend-icon="mdi-folder-open"
                v-for="(c1, index) in filteredSubject"
                :key="index"
                v-model="c1.active"
                no-action
              >
                <template v-slot:activator>
                  <v-list-item-title>{{ c1.Name }}</v-list-item-title>
                </template>
                <!-- 第二层专题名 -->
                <v-list-group
                  v-for="(c2, index) in c1.Chapter"
                  :key="index"
                  v-model="c2.active"
                  no-action
                  sub-group
                >
                  <template v-slot:activator>
                    <v-list-item-title>{{ c2._id }}</v-list-item-title>
                  </template>
                  <!-- 第三层节名 -->
                  <v-list-item
                    v-for="(c3, i) in c2.info"
                    @click="routeto($event)"
                    :key="i"
                    :value="c3.chapter"
                    link
                  >
                    <v-list-item-title>{{ c3.topic }}</v-list-item-title>

                    <v-list-item-icon>
                      <v-icon>mdi-file-outline</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list-group>
              </v-list-group>
              <!-- <v-list-group
                :value="false"
                no-action
                prepend-icon="mdi-video"
                v-show="video_flag"
              >
                <template v-slot:activator>
                  <v-list-item-title>视频资料</v-list-item-title>
                </template>

                <v-list-item
                  v-for="video in videoitem"
                  :key="video.title"
                  link
                  sub-title
                  @click="videoto($event)"
                >
                  <v-list-item-subtitle>{{ video.title }}</v-list-item-subtitle>

                  <v-list-item-icon>
                    <v-icon>mdi-play-circle-outline</v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-list-group> -->
            </div>
          </v-card>
        </div>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: "ClassList",
  setup() {
    const Subject = ref([]);
    const model = ref(1);
    const videoitem = ref([]);
    const currentItem = ref([]);
    const currentClass = ref("");
    const parentName = ref("");
    const pptsrc = ref("");
    const v_src = ref("");
    const v_pic = ref("");
    const v_title = ref("");
    const video_flag = ref(false);
    const AllChapter = ref([]);
    const router = useRouter();

    //获取上一页面信息
    const PassClass = () => {
      currentClass.value = router.currentRoute.value.params.currentClass;
    };

    //加载的目录
    const loadClassList = () => {
      const res = JSON.parse(localStorage.getItem("meterial"));
      console.log('res', res);
      /* 章节名，去前缀 */
      for (let i = 0; i < res.length; i++) {
        let index = -1;
        for (let j = 0; j < res[i].info.length; j++) {
          index = res[i].info[j].chapter.indexOf("—");
          if (index != -1)
            res[i].info[j].chapter = res[i].info[j].chapter.slice(index + 1);
        }
        if (index != -1) res[i]._id = res[i]._id.slice(index + 1);
      }
      AllChapter.value = res;
      // 使用Set去重学科名，map是返回一个数组的方法
      let uniqueSubjects = new Set(res.map((item) => item.info[0].subject));
      // 重构Subject数组，subjectName是uniqueSubjects中的值初始化Chapter为空数组
      /* 箭头函数的简写，当想要隐式返回一个对象时，需要将对象字面量用括号()包裹起来 */
      Subject.value = Array.from(uniqueSubjects).map((subjectName) => ({
        Name: subjectName,
        Chapter: [],
      }));
      // 将章节塞入对应的学科对象
      res.forEach((item) => {
        /* 将res[i]插入到其对应的学科名下去*/
        /* subjectObj是对this.Subject的引用，指向它，即subjectObj===this.Subject符合的那一条
         返回this.Subject数组中第一个满足条件的对象，所以数组中自然地理那个对象一直被找到，

         反过来就不行了，如果是item.info[0].subject.find就不对，只会找到第一个
         ，find方法适合唯一的那个数组用，如果该数组中的值不唯一，就用filter
                     item是每一个{,}，因为filter会遍历数组
         用res.filter(item => item.subject === this.Subject.Name) 
         来指定过滤条件。这个函数检查每个元素的Name属性是否等于this.Subject.Name。
         find和filter都是数组方法，会遍历数组
         find返回数组中符合条件的第一条，filter会返回数组中符合条件的所有，返回一个数组*/
        let subjectObj = Subject.value.find(
          (subj) => subj.Name === item.info[0].subject
        );
        /* 将所有满足的例子的Chapter中加入该item */
        if (subjectObj) {
          subjectObj.Chapter.push(item);
        }
      });

      console.log('sub', Subject.value);
      for (let i = 0; i < Subject.value.length; i++) {
        if(Subject.value[i].Name == currentClass.value) {
          Subject.value[i].Chapter.sort((a, b) => {
            return a.info[0].order - b.info[0].order;
          });
          for (let j = 0; j < Subject.value[i].Chapter.length; j++) {
            Subject.value[i].Chapter[j].info.sort((a, b) => {
              return a.order - b.order;
            });
          }
        }
      }
    };

    //PPT点击跳转事件
    const routeto = (event) => {
      //先获取当前点击事件的name，查找相应psrc地址
      const currentName = event.currentTarget.innerText;

      for (let i = 0; i < AllChapter.value.length; i++) {
        for (let j = 0; j < AllChapter.value[i].info.length; j++)
          if (currentName == AllChapter.value[i].info[j].topic) {
            parentName.value = AllChapter.value[i].info[j].chapter;
            pptsrc.value = AllChapter.value[i].info[j].pdf;
            currentClass.value = AllChapter.value[i].info[j].subject;
            currentItem.value = {
              ppt: pptsrc.value,
              text: currentName,
            };
          }
      }
      router.push({
        name: 'Class',
        params: {
          currentName: currentName,
          parentName: parentName.value,
          pptsrc: pptsrc.value,
          currentItem: currentItem.value,
          currentClass: currentClass.value,
        },
      });
    };

    //视频跳转页面
    const videoto = (event) => {
      const v_name = event.currentTarget.innerText;
      // console.log(v_name);
      // console.log(this.videoitem);
      for (let b = 0; b < videoitem.value.length; b++) {
        const vit = videoitem.value[b];
        if (v_name == vit.title) {
          v_src.value = vit.video;
        }
      }
      router.push({
        name: "video",
        params: {
          v_name: v_name,
          v_src: v_src.value,
          currentClass: currentClass.value,
        },
      });
    };

    onMounted(() => {
      // 展示
      localStorage.removeItem('ZT');
      localStorage.removeItem('NR');
      localStorage.removeItem('src');
      PassClass();
      loadClassList();
      // this.loadList();
    });

    const filteredSubject = computed(() => {
      // 使用this.currentClass来过滤Subject数组
      return Subject.value.filter((c1) => c1.Name === currentClass.value);
    });

    return {
      Subject,
      model,
      videoitem,
      currentItem,
      currentClass,
      parentName,
      pptsrc,
      v_src,
      v_pic,
      v_title,
      video_flag,
      AllChapter,
      PassClass,
      loadClassList,
      routeto,
      videoto,
      filteredSubject,
    };
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