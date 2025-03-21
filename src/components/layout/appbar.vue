<template>
  <div>
    <v-navigation-drawer
      v-if="!$vuetify.breakpoint.smAndUp"
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
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
          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      fixed
      app
      flat
      class="appbar"
      :clipped-left="$vuetify.breakpoint.lgAndUp"
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
                class="ml-1"
                height="56px"
                :contain="true"
                title="返回首页"
              ></v-img>
            </v-toolbar-title>

            <v-menu offset-y open-on-hover>
              <template v-slot:activator="{ on }">
                <v-btn
                  color="primary"
                  dark
                  v-on="on"
                  class="ml-3 text-capitalize"
                  depressed
                  large
                >
                  路线学习

                  <v-icon right> mdi-arrow-down-circle-outline </v-icon>
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
              <template v-slot:activator="{ on }">
                <v-btn
                  color="primary"
                  dark
                  v-on="on"
                  class="ml-3 text-capitalize"
                  depressed
                  large
                  v-show="isuser"
                >
                  学习资料

                  <v-icon right> mdi-arrow-down-circle-outline </v-icon>
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
              <template v-slot:activator="{ on }">
                <v-btn
                  color="primary"
                  dark
                  v-on="on"
                  class="ml-3 text-capitalize"
                  depressed
                  large
                >
                  分析工具

                  <v-icon right> mdi-arrow-down-circle-outline </v-icon>
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
              <template v-slot:activator="{ on }">
                <v-btn
                  color="primary"
                  dark
                  v-on="on"
                  class="ml-3 text-capitalize"
                  depressed
                  large
                  v-show="isstudent"
                >
                  实习报告

                  <v-icon right> mdi-arrow-down-circle-outline </v-icon>
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
              <template v-slot:activator="{ on }" >
                <v-btn
                  color="primary"
                  dark
                  v-on="on"
                  class="ml-3 text-capitalize"
                  depressed
                  large
                  v-show="isteacher"
                >
                  教师功能

                  <v-icon right> mdi-arrow-down-circle-outline </v-icon>
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
          <v-col class="text-right" v-if="$vuetify.breakpoint.smAndUp">
            <v-menu offset-y open-on-hover>
              <template v-slot:activator="{ on }">
                <v-btn
                  color="primary"
                  dark
                  v-on="on"
                  class="ml-3 text-capitalize"
                  depressed
                  large
                >
                  <v-icon left>mdi-account</v-icon>

                  {{ stuName }}

                  <v-icon right v-show="visiter"> mdi-arrow-down-circle-outline </v-icon>
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
export default {
  data: () => ({
    stuName:sessionStorage.getItem("userName"),
    isteacher:'',
    isstudent:'',
    isuser:'',
    visiter:'',
    drawer: null,
    Link: true,
    routePages: [
      {
        title: "实习路线",
        to: "/front/pages/route/route",
      },
      {
        title: "飞行浏览",
        to: "/front/pages/fly/fly",
      },
    ],
    coursewares: [
      {
        title: "实习资料",
        to: "/front/pages/download/download1",
      },
       {
        title: "课程资料",
        to: "/front/pages/learning/FirstView",
      },
      // {
      //   title: "专题讨论",
      //   to: "/front/pages/learning/DisscusList",
      // }
    ],
    projectStudies: [
      {
        title: "剖面线工具",
        to: "/front/pages/projectStudies/SectionLine",
      },
      /* {
        title: "路径分析",
        to: "/front/pages/projectStudies/pathAnalysis",
      }, */
      {
        title: "可见性分析",
        to: "/front/pages/projectStudies/visible",
      },
    ],
    reportPages: [
      {
        title: "小组报告",
        to: "/front/pages/report/groupReport",
      },
       {
        title: "个人感想",
        to: "/front/pages/report/studentReport",
      },

    ],
    personPages: [
      {
        title: "个人空间",
        pp_isteacher:true,
        to:"/front/pages/person/personalMa",
      },
      {
        title: "退出登录",
        pp_isteacher:true,
        to: "/front/pages/person/logout",
      },
    ],
     teacherPages: [
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
    ],
  }),

  
  created(){
    
      let pageS = sessionStorage.isteacher
      
     let visiter = sessionStorage.isvisiter
     if(visiter=='true'){
        this.isteacher = false
        this.isstudent = false
        
        this.personPages[0].pp_isteacher =false
      }else{
        this.visiter = true
        this.isuser = true
        if(pageS=='false'){
        this.isteacher = false
        this.isstudent = true 
        
        // console.log(this.personPages[0].pp_isteacher)
      }else{
        this.isteacher = true
        this.isstudent = false
        this.personPages[0].pp_isteacher =false
      }
       
      }
    
  }
};
</script>
