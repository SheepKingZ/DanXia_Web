<template>
  <div>
    <v-navigation-drawer
      v-if="!mdAndUp"
      v-model="drawer"
      :clipped="lgAndUp"
      app
      color="primary"
      dark
    >
      <v-list nav color="primary">
        <v-list-item
          v-for="(item, i) in btnItems"
          :key="i"
          :link="Link"
          :to="item.to"
          :href="item.href"
          :target="item.target"
        >
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      fixed
      app
      flat
      class="appbar"
      :clipped-left="lgAndUp"
      color="primary"
      dark
    >
      <v-container>
        <v-row align="center" justify="space-between">
          <v-col class="d-flex align-center">
            <v-toolbar-title
              style="cursor: pointer"
              class="font-weight-bold text-h5"
              @click="$router.push('/front')"
            >
              <v-img
                src="../../assets/图片1.png"
                dark
                class="ml-1 fixed-logo"
                :width="56"
                :height="56"
                :contain="true"
                title="返回首页"
              ></v-img>
            </v-toolbar-title>

            <v-menu offset-y open-on-hover>
              <template #activator="{ props }">
                <v-btn
                  variant="text"
                  class="ml-3 text-capitalize menu-btn white--text"
                  v-bind="props"
                  size="large"
                >
                  路线学习

                  <v-icon end> mdi-arrow-down-circle-outline </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  :to="item.to"
                  v-for="(item, index) in routePages"
                  :key="index"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-menu offset-y open-on-hover>
              <template #activator="{ props }">
                <v-btn
                  variant="text"
                  class="ml-3 text-capitalize menu-btn white--text"
                  v-bind="props"
                  size="large"
                  v-show="isuser"
                >
                  学习资料

                  <v-icon end> mdi-arrow-down-circle-outline </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  :to="item.to"
                  v-for="(item, index) in coursewares"
                  :key="index"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-menu offset-y open-on-hover>
              <template #activator="{ props }">
                <v-btn
                  variant="text"
                  class="ml-3 text-capitalize menu-btn white--text"
                  v-bind="props"
                  size="large"
                >
                  分析工具

                  <v-icon end> mdi-arrow-down-circle-outline </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  :to="item.to"
                  v-for="(item, index) in projectStudies"
                  :key="index"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-menu offset-y open-on-hover>
              <template #activator="{ props }">
                <v-btn
                  variant="text"
                  class="ml-3 text-capitalize menu-btn white--text"
                  v-bind="props"
                  size="large"
                  v-show="isstudent"
                >
                  实习报告

                  <v-icon end> mdi-arrow-down-circle-outline </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  :to="item.to"
                  v-for="(item, index) in reportPages"
                  :key="index"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-menu offset-y open-on-hover>
              <template #activator="{ props }">
                <v-btn
                  variant="text"
                  class="ml-3 text-capitalize menu-btn white--text"
                  v-bind="props"
                  size="large"
                  v-show="isteacher"
                >
                  教师功能

                  <v-icon end> mdi-arrow-down-circle-outline </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  :to="item.to"
                  v-for="(item, index) in teacherPages"
                  :key="index"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

          </v-col>
          <v-col class="text-right" v-if="mdAndUp">
            <v-menu offset-y open-on-hover>
              <template #activator="{ props }">
                <v-btn
                  variant="text"
                  class="ml-3 text-capitalize menu-btn white--text"
                  v-bind="props"
                  size="large"
                >
                  <v-icon start>mdi-account</v-icon>

                  {{ stuName }}

                  <v-icon end v-show="visiter"> mdi-arrow-down-circle-outline </v-icon>
                </v-btn>
              </template>
              <v-list >
                <v-list-item
                  :to="item.to"
                  :href="item.href"
                  v-for="(item, index) in personPages"
                  v-show="item.pp_isteacher"
                  :key="index"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useStore } from 'vuex';

export default {
  name: "Appbar",
  setup() {
    const store = useStore();
    const display = useDisplay();
    
    // 使用computed获取断点值
    const mdAndUp = computed(() => display.mdAndUp.value);
    const lgAndUp = computed(() => display.lgAndUp.value);
    
    // 获取用户名
    const stuName = computed(() => store.state.stuName || sessionStorage.getItem("userName") || "未登录");
    
    // 响应式状态
    const drawer = ref(false);
    const Link = ref(true);
    const login = ref(true);
    const isuser = ref(false);
    const visiter = ref(false);
    const isteacher = ref(false);
    const isstudent = ref(false);
    
    // 菜单数据
    const btnItems = reactive([
      {
        text: "路线学习",
        to: "/front/pages/route/route",
      },
      {
        text: "飞行浏览",
        to: "/front/pages/fly/fly",
      },
      {
        text: "学习资料",
        to: "/front/pages/learning/FirstView",
      },
      {
        text: "讨论区",
        to: "/front/pages/learning/Disscus",
      },
      {
        text: "个人空间",
        to: "/front/pages/person/personalMa",
      },
    ]);
    
    const routePages = reactive([
      {
        title: "普通视图",
        to: "/front/pages/route/route",
      },
      {
        title: "线路高程",
        to: "/front/pages/route/route2",
      },
      {
        title: "实习点详情",
        to: "/front/pages/route/route3",
      },
    ]);

    const flyPages = reactive([
      {
        title: "飞行",
        to: "/front/pages/fly/fly"
      },
      {
        title: "飞行2",
        to: "/front/pages/fly/fly2",
      },
    ]);

    const coursewares = reactive([
      {
        title: "课程资料",
        to: "/front/pages/learning/FirstView",
      },
    ]);

    const projectStudies = reactive([
      {
        title: "剖面线工具",
        to: "/front/pages/projectStudies/SectionLine",
      },
      {
        title: "可见性分析",
        to: "/front/pages/projectStudies/visible",
      },
    ]);

    const reportPages = reactive([
      {
        title: "小组报告",
        to: "/front/pages/report/groupReport",
      },
      {
        title: "个人感想",
        to: "/front/pages/report/studentReport",
      },
    ]);

    const personPages = reactive([
      {
        title: "个人空间",
        pp_isteacher: true,
        to: "/front/pages/person/personalMa",
      },
      {
        title: "退出登录",
        pp_isteacher: true,
        to: "/front/pages/person/logout",
      },
    ]);

    const teacherPages = reactive([
      {
        title: "学生信息及报告",
        to: "/front/pages/teacherpage/StudentInfo",
      },
      {
        title: "成绩管理与设置",
        to: "/front/pages/teacherpage/StudentMark",
      },
      {
        title: "资料管理",
        to: "/front/pages/teacherpage/Update",
      },
    ]);
    
    // 生命周期钩子
    onMounted(() => {
      const pageS = sessionStorage.getItem("isteacher");
      const visiterValue = sessionStorage.getItem("isvisiter");
      
      if (visiterValue === 'true') {
        isteacher.value = false;
        isstudent.value = false;
        personPages[0].pp_isteacher = false;
      } else {
        visiter.value = true;
        isuser.value = true;
        
        if (pageS === 'false') {
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
      drawer,
      Link,
      login,
      isuser,
      visiter,
      isteacher,
      isstudent,
      btnItems,
      routePages,
      flyPages,
      coursewares,
      projectStudies,
      reportPages,
      personPages,
      teacherPages,
      mdAndUp,
      lgAndUp,
      stuName
    };
  }
};
</script>

<style>
.appbar {
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

/* 确保按钮文本颜色可见 */
.v-btn.text-capitalize {
  color: white !important;
}
.v-list-item-title {
  color: black !important;
}

/* 菜单按钮样式 - 减小字体大小 */
.menu-btn {
  color: white !important;
  font-weight: 500;
  font-size: 14px; /* 从16px减小到14px */
  background-color: transparent;
  height: 48px !important;
  letter-spacing: 0.5px;
  text-transform: none;
}

/* 添加固定尺寸图标样式 */
.fixed-logo {
  min-width: 56px !important;
  min-height: 56px !important;
  width: 56px !important;
  height: 56px !important;
  flex-shrink: 0 !important;
  object-fit: contain;
}
</style>
