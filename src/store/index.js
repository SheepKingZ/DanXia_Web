/* import Vue from 'vue'//用cdn的时候要注释掉
import Vuex from 'vuex'//用cdn的时候要注释掉 */
import { createStore } from 'vuex';
import { reqMeterial,
   reqGetGroupAssess,
    reqGetDDL,
    reqGetAllAssessment,
    reqGetAllAnswer,
    reqGetAllThought,
    reqGetConfig} from '../api'
/* Vue.use(Vuex)//用cdn的时候要注释掉 */
//创建状态管理模式核心store（仓库）
/* global Vuex */
const store = createStore({
  state: {
    loginState: false,
    userName: "",
    class_name: "",
    group_id: "",
    group_leader: "",
    group_member: "",
    stu_id: "",
    password: "",
    stuName: "未登录",
    meterial: [],
    groupAssess: [],
    ddl: "",
    assessment: [],
    /* 
      连续派发，获取做大状态的，已废
    AllAssess:[], */
    status:[],
    thoughtList:[],
    gis:0,
    ditu:0,
    renwen:0,
    nature:0,
    reportP:0,
    normalP:0
  },
  getters: {

    userName: state => {
      if (!state.loginState) {
        state.userName = sessionStorage.getItem("userName")
      }
      return state.userName
    },
    class_name: state => {
      if (!state.loginState) {
        state.class_name = sessionStorage.getItem("class_name")
      }
      return state.class_name
    },
    group_id: state => {
      if (!state.loginState) {
        state.group_id = sessionStorage.getItem("group_id")
      }
      return state.group_id
    },
    group_leader: state => {
      if (!state.loginState) {
        state.group_leader = sessionStorage.getItem("groud_leader")
      }
      return state.group_leader
    },
    group_member: state => {
      if (!state.loginState) {
        state.group_member = sessionStorage.getItem("group_member")
      }
      return state.group_member
    },
    stu_id: state => {
      if (!state.loginState) {
        state.stu_id = sessionStorage.getItem("stu_id")
      }
      return state.stu_id
    },
    password: state => {
      if (!state.loginState) {
        state.password = sessionStorage.getItem("password")
      }
      return state.password
    },
    Qus_desserts(state) {
      let t = []
      console.log('ment0',state.assessment);
      for (let i = 0; i < state.assessment.length; i++) {
        t.push({
          question: state.assessment[i].title,
          id: state.assessment[i]._id,
          limit: state.assessment[i].end_time.split(".")[0].replace("T", " "),
        });
      }
      
      
      return t
    },

  },
  mutations: {
    //更改用户状态信息
    loginIn(state, user) {
      if (user) {
        state.userName = user.name;
        state.class_name = user.class_name;
        state.group_id = user.group.group_id;
        state.group_leader = user.group.leader;
        state.group_member = user.group.members;
        //改为Stu_id即可
        state.stu_id = user.Stu_id;
        state.password = user.Password;
        state.loginState = true
      } else if (user == null) {
        //登出的时候，清空sessionStorage里的东西
        sessionStorage.setItem("userName", null);
        sessionStorage.setItem("class_name", null);
        sessionStorage.setItem("group_id", null);
        sessionStorage.setItem("group_leader", null);
        sessionStorage.setItem("group_member", null);
        sessionStorage.setItem("stu_id", null);
        sessionStorage.setItem("password", null);
        sessionStorage.setItem("loginState", false);
        sessionStorage.setItem("is_leader", false);
        localStorage.removeItem('name');
        localStorage.removeItem('pwd');
        state.userName = null;
        state.class_name = null;
        state.group_id = null;
        state.group_leader = null;
        state.group_member = null;
        state.stu_id = null;
        state.password = null;
        state.isLogin = false;
      }
    },
    METERIAL(state, meterial) {
      state.meterial = meterial
    },
    ASSESSMENT(state,data){
      state.assessment=data
      console.log('state.assment',state.assessment);
    },
    ASSESS(state, data) {
      state.groupAssess = data
      console.log('state.groupAssess',state.groupAssess);
      
    },
    /* ALLASSESS(state, { data, id }) {
      state.AllAssess.push({
        data,
        id
      })
      console.log('state', state.AllAssess);
    }, */
    DDL(state, data) {
      state.ddl = data
    },
    ANSWERSTATUS(state,data){
      state.status=data
    },
    THOUGHT(state,data){
      state.thoughtList=data
    },
    CONFIG(state,data){
      state.ditu=data[0].value
      state.gis=data[2].value
      state.nature=data[3].value
      state.renwen=data[1].value
      state.reportP=data[8].value
      state.normalP=data[10].value
    }

  },
  actions: {
    async meterial(context) {
      let res = await reqMeterial()
      if (res.status == 200)
        context.commit('METERIAL', res.data)
    },
    /* 获取小组考核回答 */
    async getGroupAssess(context, g_id) {
      let res = await reqGetGroupAssess(g_id)
      if (res.status == 200)
      {  
        console.log('data',res.data);
        context.commit('ASSESS', res.data)
        return 'ok'
      }else
        return Promise.reject(new Error('fail'))
    },
    async getAllGroupAnswer(context) {
      /* let PromiseAll=[]
      for (let i = 0; i < num; i++) {
        
        let res = await reqGetGroupAssess(i)
        if (res.status == 200 && res.data.length != 0) {
        
          let promise=context.commit('ALLASSESS', { data: res.data, id: i })
          PromiseAll.push(promise)
        }
      }
      return Promise.all(PromiseAll) */
      let res=await reqGetAllAnswer()
      if(res.status==200)
        context.commit('ANSWERSTATUS',res.data)
    },
    async getDDL(context) {
      let res = await reqGetDDL();
      if (res.status == 200) {
        context.commit('DDL', res.data)
        return 'ok'
      }else
        return Promise.reject(new Error('fail'))
    },
    async getAllAssessment(context){
      let res=await reqGetAllAssessment()
      if(res.status==200)
        context.commit('ASSESSMENT',res.data)
    },
    async getAllThought(context){
      let res=await reqGetAllThought()
      if(res.status==200)
      {
        context.commit('THOUGHT',res.data)
        return 'ok'
      }else
        return Promise.reject(new Error('fail'))

    },
    async getConfig(context){
      let res=await reqGetConfig()
      if(res.status==200)
      {
        context.commit('CONFIG',res.data)
        return 'ok'
      }else
        return Promise.reject(new Error('fail'))
    }

  },
  /* actions: {
    updateName(context, userName) {
      context.commit('userStatus', userName)
    }
  } */
})

export default store;

