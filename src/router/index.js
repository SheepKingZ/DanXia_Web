/* import Vue from "vue";//用cdn的时候要注释掉
import VueRouter from "vue-router";//用cdn的时候要注释掉，路由引入 */
import { createRouter, createWebHashHistory } from "vue-router"
import Guide from "../views/Guide.vue";
import t1 from "../views/front/pages/learning/t1.vue";
import NProgress from 'nprogress';
//路由安装注册
/* Vue.use(VueRouter);//路由插件初始化//用cdn的时候要注释掉 */
/* global VueRouter */
//配置路由规则
const routes = [
  //重定向，让项目跑起来的时候，访问/，立马让他定向到首页
  {
    path: '/:pathMatch(.*)*',
    redirect: "/front",
  },
  {
    path: "/front",
    component: () => import("../components/root/front"),
    children: [
      {
        path: "/front",
        name: "Guide",//命名路由
        component: Guide,
      },
    ],
    meta: {
      auth: true
    }
  },
  {
    path: "/Login",
    component: () => import("../components/login.vue"),
    meta: {
      auth: false
    }
  },
  {
    path: "/front/pages",
    component: () => import("../components/root/front"),
    meta: {
      auth: false
    },
    children: [
      {
        path: "/front/pages/download/download1",
        name: "front-pages-download-download1",
        component: () => import("../views/front/pages/download/download1.vue"),
        meta: {
          auth: true
        }
      },
      {
        path: "/front/pages/route/route",
        name: "front-pages-route-route",
        component: () => import("../views/front/pages/route/route.vue"),
        meta: {
          auth: true
        }
      },
      {
        path: "/front/pages/route/route2",
        name: "front-pages-route-route2",
        component: () => import("../views/front/pages/route/route2.vue"),
        meta: {
          auth: true
        }
      },
      {
        path: "/front/pages/route/route3",
        name: "front-pages-route-route3",
        component: () => import("../views/front/pages/route/route3.vue"),
        meta: {
          auth: true
        }
      },
      {
        path: "/front/pages/fly/fly",
        name: "front-pages-fly-fly",
        component: () => import("../views/front/pages/fly/fly.vue"),
        meta: {
          auth: true
        }
      },
      {
        path: "/front/pages/fly/fly2",
        name: "front-pages-fly-fly2",
        component: () => import("../views/front/pages/fly/fly2.vue"),
        meta: {
          auth: false
        }
      },
      {
        path: "/front/pages/projectStudies/visible",
        name: "front-pages-projectStudies-visible",
        component: () => import("../views/front/pages/projectStudies/visible.vue"),
        meta: {
          auth: true
        }
      },
      {
        path: "/front/pages/projectStudies/SectionLine",
        name: "front-pages-projectStudies-SectionLine",
        component: () => import("../views/front/pages/projectStudies/SectionLine.vue"),
        meta: {
          auth: true
        }
      },
      {
        path: "/front/pages/projectStudies/pathAnalysis",
        name: "front-pages-projectStudies-pathAnalysis",
        component: () => import("../views/front/pages/projectStudies/pathAnalysis.vue"),
        meta: {
          auth: true
        }
      },
      {
        path: "/front/pages/person/personalMa",
        name: "front-pages-person-personalMa",
        component: () => import("../views/front/pages/person/personalMa.vue"),
        meta: {
          auth: true
        }
      },
      {
        path: "/front/pages/person/logout",
        name: "front-pages-person-logout",
        component: () => import("../views/front/pages/person/logout.vue"),
        meta: {
          auth: true
        }
      },
      {
        path: "/front/pages/learning/ClassIntro/:currentClass",
        name: "ClassIntro",
        component: () => import("../views/front/pages/learning/ClassIntro.vue"),
        meta: {
          auth: true
        }
      },

      {
        path: "/front/pages/learning/Class/:currentClass",
        name: "Class",
        component: () => import("../views/front/pages/learning/Class.vue"),
        meta: {
          auth: true
        }
       
      },

      {
        path: "/front/pages/learning/FirstView",
        name: "FirstView",
        component: () => import("../views/front/pages/learning/FirstView.vue"),
        meta: {
          auth: true
        }
       
      },
      {
        path: "/front/pages/learning/video",
        name: "video",
        component: () => import("../views/front/pages/learning/video.vue"),
        meta: {
          auth: true
        }
       
      },
      {
        path: "/front/pages/learning/Disscus",
        name: "Disscus",
        component: () => import("../views/front/pages/learning/Disscus.vue"),
        meta: {
          auth: true
        }
       
      },
      {
        path: "/front/pages/learning/DisscusList",
        name: "DisscusList",
        component: () => import("../views/front/pages/learning/DisscusList.vue"),
        meta: {
          auth: true
        }
       
      },
      {
        path: "/front/pages/learning/ClassList/:currentClass",
        name: "ClassList",
        component: () => import("../views/front/pages/learning/ClassList.vue"),
        meta: {
          auth: true
        }
       
      },

      // 教师端
      {
        path: "/front/pages/teacherpage/StudentInfo",
        name: "StudentInfo",
        component: () => import("../views/front/pages/teacherpage/StudentInfo.vue"),
        meta: {
          auth: true
        }
       
      },
      {
        path: "/front/pages/teacherpage/StudentMark",
        name: "StudentMark",
        component: () => import("../views/front/pages/teacherpage/StudentMark.vue"),
        meta: {
          auth: true
        }
       
      },
      {
        path: "/front/pages/teacherpage/Update",
        name: "Update",
        component: () => import("../views/front/pages/teacherpage/Update.vue"),
        meta: {
          auth: true
        }
       
      },
      // 实习报告
      {
        path: "/front/pages/report/groupReport",
        name: "groupReport",
        component: () => import("../views/front/pages/report/groupReport.vue"),
        meta: {
          auth: true
        }
       
      },
      {
        path: "/front/pages/report/studentReport",
        name: "studentReport",
        component: () => import("../views/front/pages/report/studentReport.vue"),
        meta: {
          auth: true
        }
       
      },
      // 添加Cesium 3D地形游览页面路由
      {
        path: "/front/pages/cesium3d/tour",
        name: "cesium3d-tour",
        component: () => import("../views/front/pages/cesium3d/Cesium3DTour.vue"),
        meta: {
          auth: false
        }
      },
    ],
  },
  
  {
    // 修改登录页面
    path: "/front",
    component: () => import("../components/root/front"),
    children: [
      {
        path: "/learning",
        name: "t1",
        component: t1,
      },
    ],
    meta: {
      auth: false
    }
  },
  
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.afterEach(() => {
  if (NProgress.isStarted())
  {
    NProgress.done();
  }
  
});

export default router;

