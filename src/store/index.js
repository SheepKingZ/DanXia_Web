// 导入 Vue 3 版本的 Vuex 提供的 createStore 方法，用于创建状态管理仓库实例
import { createStore } from 'vuex';

// 导入定义在 api 文件中的各种后端 API 请求函数
// reqMeterial: 获取教学资料的请求函数
// reqGetGroupAssess: 获取小组考核数据的请求函数
// reqGetDDL: 获取截止日期的请求函数
// reqGetAllAssessment: 获取所有评估信息的请求函数
// reqGetAllAnswer: 获取所有答案的请求函数
// reqGetAllThought: 获取所有思考内容的请求函数
// reqGetConfig: 获取配置信息的请求函数
import { reqMeterial,
   reqGetGroupAssess,
    reqGetDDL,
    reqGetAllAssessment,
    reqGetAllAnswer,
    reqGetAllThought,
    reqGetConfig} from '../api'

// 使用 createStore 方法创建 Vuex 状态管理仓库实例
const store = createStore({
  // state: 定义应用的核心数据状态，所有组件共享的数据源
  state: {
    loginState: false,  // 用户登录状态标志，true 表示已登录，false 表示未登录
    userName: "",       // 存储当前登录用户的用户名
    class_name: "",     // 存储当前用户所属的班级名称
    group_id: "",       // 存储当前用户所属小组的唯一标识符
    group_leader: "",   // 存储当前用户所属小组的组长信息
    group_member: "",   // 存储当前用户所属小组的所有成员信息
    stu_id: "",         // 存储当前登录学生的学号或唯一标识符
    password: "",       // 存储当前登录用户的密码
    stuName: "未登录",  // 存储学生姓名，默认值为"未登录"，用于 UI 显示
    meterial: [],       // 存储教学资料数组，从服务器获取的学习资源列表
    groupAssess: [],    // 存储小组考核数据数组，包含小组评估信息
    ddl: "",            // 存储截止日期信息，表示任务提交的最后期限
    assessment: [],     // 存储评估信息数组，包含所有评估任务详情
    status:[],          // 存储答题状态数组，记录每个问题的回答状态
    thoughtList:[],     // 存储思考列表数组，包含用户提交的思考内容
    gis:0,              // 存储 GIS 相关评分，地理信息系统相关任务的得分
    ditu:0,             // 存储地图相关评分，地图制作相关任务的得分
    renwen:0,           // 存储人文相关评分，人文地理相关任务的得分
    nature:0,           // 存储自然相关评分，自然地理相关任务的得分
    reportP:0,          // 存储报告得分百分比，最终报告在总成绩中的权重
    normalP:0           // 存储一般得分百分比，常规任务在总成绩中的权重
  },
  
  // getters: 定义计算属性，用于从 state 派生出一些状态，类似 Vue 的计算属性
  getters: {
    // 获取用户名的计算属性
    // 如果当前登录状态为 false，则尝试从 sessionStorage 获取用户名
    //SessionStorage 是浏览器提供的临时数据存储机制，
    // 作为 Web Storage API 的一部分。它创建的数据仅在当前浏览会话期间有效，
    // 页面刷新时会保留数据，但关闭标签页或浏览器后数据会被自动清除。
    // 在当前项目中，SessionStorage 解决了 Vuex 状态管理的关键痛点：由于 Vuex 的状态在页面刷新后会丢失，
    // 通过在登录时同时将用户数据存入 SessionStorage，并在 getters 中检测登录状态后从 SessionStorage 恢复数据，
    // 实现了页面刷新后用户登录状态的持久化，避免了频繁要求用户重新登录的不良体验。与长期存储的 localStorage 不同，
    // SessionStorage 更适合存储临时会话信息，确保用户数据不会在浏览器关闭后泄露。
    // 这确保了页面刷新后仍能保持用户状态
    userName: state => {
      if (!state.loginState) {
        // 当未登录时，尝试从 sessionStorage 恢复用户名
        state.userName = sessionStorage.getItem("userName")
      }
      return state.userName // 返回最终的用户名，无论是从 state 还是从 sessionStorage 获取的
    },
    
    // 获取班级名称的计算属性
    // 如果当前登录状态为 false，则尝试从 sessionStorage 获取班级名称
    class_name: state => {
      if (!state.loginState) {
        // 当未登录时，尝试从 sessionStorage 恢复班级名称
        state.class_name = sessionStorage.getItem("class_name")
      }
      return state.class_name // 返回最终的班级名称
    },
    
    // 获取小组 ID 的计算属性
    // 如果当前登录状态为 false，则尝试从 sessionStorage 获取小组 ID
    group_id: state => {
      if (!state.loginState) {
        // 当未登录时，尝试从 sessionStorage 恢复小组 ID
        state.group_id = sessionStorage.getItem("group_id")
      }
      return state.group_id // 返回最终的小组 ID
    },
    
    // 获取小组组长的计算属性
    // 如果当前登录状态为 false，则尝试从 sessionStorage 获取小组组长信息
    group_leader: state => {
      if (!state.loginState) {
        // 当未登录时，尝试从 sessionStorage 恢复小组组长信息
        // 注意：这里有一个拼写错误，应该是"group_leader"而不是"groud_leader"
        state.group_leader = sessionStorage.getItem("groud_leader")
      }
      return state.group_leader // 返回最终的小组组长信息
    },
    
    // 获取小组成员的计算属性
    // 如果当前登录状态为 false，则尝试从 sessionStorage 获取小组成员信息
    group_member: state => {
      if (!state.loginState) {
        // 当未登录时，尝试从 sessionStorage 恢复小组成员信息
        state.group_member = sessionStorage.getItem("group_member")
      }
      return state.group_member // 返回最终的小组成员信息
    },
    
    // 获取学生 ID 的计算属性
    // 如果当前登录状态为 false，则尝试从 sessionStorage 获取学生 ID
    stu_id: state => {
      if (!state.loginState) {
        // 当未登录时，尝试从 sessionStorage 恢复学生 ID
        state.stu_id = sessionStorage.getItem("stu_id")
      }
      return state.stu_id // 返回最终的学生 ID
    },
    
    // 获取密码的计算属性
    // 如果当前登录状态为 false，则尝试从 sessionStorage 获取密码
    // 注意：实际项目中应避免这样处理密码，出于安全考虑
    password: state => {
      if (!state.loginState) {
        // 当未登录时，尝试从 sessionStorage 恢复密码
        state.password = sessionStorage.getItem("password")
      }
      return state.password // 返回最终的密码
    },
    
    // 处理评估问题数据，返回格式化后的数组，用于 UI 显示
    Qus_desserts(state) {
      let t = [] // 创建临时数组存储处理后的问题数据
      console.log('ment0',state.assessment); // 调试输出当前评估数据
      for (let i = 0; i < state.assessment.length; i++) {
        // 遍历每个评估项，提取关键信息并格式化
        t.push({
          question: state.assessment[i].title,        // 提取问题标题
          id: state.assessment[i]._id,                // 提取问题唯一标识符
          limit: state.assessment[i].end_time.split(".")[0].replace("T", " "), // 格式化截止时间，移除毫秒部分并替换T为空格
        });
      }
      return t // 返回处理后的问题数组
    },
  },
  
  // mutations: 定义修改状态的同步操作，是更改 Vuex 状态的唯一方法
  mutations: {
    // 更改用户登录状态和相关信息的 mutation
    // 参数 user 为用户信息对象，若为 null 则表示登出操作
    loginIn(state, user) {
      if (user) {
        // 用户登录，根据 user 对象更新 state 中的用户信息
        state.userName = user.name;              // 更新用户名
        state.class_name = user.class_name;      // 更新班级名称
        state.group_id = user.group.group_id;    // 更新小组 ID
        state.group_leader = user.group.leader;  // 更新小组组长
        state.group_member = user.group.members; // 更新小组成员
        // 注意：下面的注释表明需要使用 Stu_id 而不是其他属性名
        state.stu_id = user.Stu_id;              // 更新学生 ID
        state.password = user.Password;          // 更新密码
        state.loginState = true                  // 更新登录状态为已登录
      } else if (user == null) {
        // 用户登出，清空所有用户相关信息
        // 首先清空 sessionStorage 中的用户信息
        sessionStorage.setItem("userName", null);       // 清空用户名
        sessionStorage.setItem("class_name", null);     // 清空班级名称
        sessionStorage.setItem("group_id", null);       // 清空小组 ID
        sessionStorage.setItem("group_leader", null);   // 清空小组组长
        sessionStorage.setItem("group_member", null);   // 清空小组成员
        sessionStorage.setItem("stu_id", null);         // 清空学生 ID
        sessionStorage.setItem("password", null);       // 清空密码
        sessionStorage.setItem("loginState", false);    // 更新登录状态为未登录
        sessionStorage.setItem("is_leader", false);     // 更新组长状态为非组长
        localStorage.removeItem('name');                // 清空本地存储中的用户名（可能用于记住登录功能）
        localStorage.removeItem('pwd');                 // 清空本地存储中的密码（可能用于记住登录功能）
        
        // 然后清空 store 中的用户信息
        state.userName = null;       // 清空用户名
        state.class_name = null;     // 清空班级名称
        state.group_id = null;       // 清空小组 ID
        state.group_leader = null;   // 清空小组组长
        state.group_member = null;   // 清空小组成员
        state.stu_id = null;         // 清空学生 ID
        state.password = null;       // 清空密码
        state.isLogin = false;       // 更新登录状态为未登录（注意：这里应该是 loginState 而不是 isLogin）
      }
    },
    
    // 设置教学资料的 mutation
    // 参数 meterial 为从服务器获取的教学资料数组
    METERIAL(state, meterial) {
      state.meterial = meterial // 更新 state 中的教学资料数组
    },
    
    // 设置评估信息的 mutation
    // 参数 data 为从服务器获取的评估信息数组
    ASSESSMENT(state, data){
      state.assessment = data // 更新 state 中的评估信息数组
      console.log('state.assment', state.assessment); // 调试输出更新后的评估信息
    },
    
    // 设置小组考核数据的 mutation
    // 参数 data 为从服务器获取的小组考核数据
    ASSESS(state, data) {
      state.groupAssess = data // 更新 state 中的小组考核数据
      console.log('state.groupAssess', state.groupAssess); // 调试输出更新后的小组考核数据
    },
    
    /* 已废弃的代码，用于存储所有小组的答案数据
    ALLASSESS(state, { data, id }) {
      state.AllAssess.push({
        data,
        id
      })
      console.log('state', state.AllAssess);
    }, */
    
    // 设置截止日期的 mutation
    // 参数 data 为从服务器获取的截止日期
    DDL(state, data) {
      state.ddl = data // 更新 state 中的截止日期
    },
    
    // 设置答题状态的 mutation
    // 参数 data 为从服务器获取的答题状态数组
    ANSWERSTATUS(state, data){
      state.status = data // 更新 state 中的答题状态数组
    },
    
    // 设置思考列表的 mutation
    // 参数 data 为从服务器获取的思考内容数组
    THOUGHT(state, data){
      state.thoughtList = data // 更新 state 中的思考列表数组
    },
    
    // 设置各项评分配置的 mutation
    // 参数 data 为从服务器获取的配置信息数组
    CONFIG(state, data){
      state.ditu = data[0].value     // 更新地图评分，使用配置数组的第 1 个元素的 value 值
      state.gis = data[2].value      // 更新 GIS 评分，使用配置数组的第 3 个元素的 value 值
      state.nature = data[3].value   // 更新自然评分，使用配置数组的第 4 个元素的 value 值
      state.renwen = data[1].value   // 更新人文评分，使用配置数组的第 2 个元素的 value 值
      state.reportP = data[8].value  // 更新报告得分百分比，使用配置数组的第 9 个元素的 value 值
      state.normalP = data[10].value // 更新一般得分百分比，使用配置数组的第 11 个元素的 value 值
    }
  },
  
  // actions: 定义可包含异步操作的业务逻辑，通过提交 mutation 来修改状态
  actions: {
    // 获取教学资料的 action
    async meterial(context) {
      let res = await reqMeterial() // 调用 API 函数获取教学资料
      if (res.status == 200) // 如果请求成功（HTTP 状态码为 200）
        context.commit('METERIAL', res.data) // 提交 mutation 更新教学资料
    },
    
    // 获取小组考核回答的 action
    // 参数 g_id 为小组 ID
    async getGroupAssess(context, g_id) {
      let res = await reqGetGroupAssess(g_id) // 调用 API 函数获取指定小组的考核回答
      if (res.status == 200) {  // 如果请求成功（HTTP 状态码为 200）
        console.log('data', res.data); // 调试输出获取的数据
        context.commit('ASSESS', res.data) // 提交 mutation 更新小组考核数据
        return 'ok' // 返回成功标志
      } else
        return Promise.reject(new Error('fail')) // 请求失败，返回 Promise.reject
    },
    
    // 获取所有小组答案的 action
    async getAllGroupAnswer(context) {
      /* 以下是旧版本的代码，已被注释掉
      // 旧逻辑：遍历每个小组 ID，分别获取其考核回答
      let PromiseAll=[]
      for (let i = 0; i < num; i++) {
        let res = await reqGetGroupAssess(i)
        if (res.status == 200 && res.data.length != 0) {
          let promise=context.commit('ALLASSESS', { data: res.data, id: i })
          PromiseAll.push(promise)
        }
      }
      return Promise.all(PromiseAll) */
      
      // 新逻辑：一次性获取所有答案
      let res = await reqGetAllAnswer() // 调用 API 函数获取所有答案
      if (res.status == 200) // 如果请求成功（HTTP 状态码为 200）
        context.commit('ANSWERSTATUS', res.data) // 提交 mutation 更新答题状态
    },
    
    // 获取截止日期的 action
    async getDDL(context) {
      let res = await reqGetDDL(); // 调用 API 函数获取截止日期
      if (res.status == 200) { // 如果请求成功（HTTP 状态码为 200）
        context.commit('DDL', res.data) // 提交 mutation 更新截止日期
        return 'ok' // 返回成功标志
      } else
        return Promise.reject(new Error('fail')) // 请求失败，返回 Promise.reject
    },
    
    // 获取所有评估信息的 action
    async getAllAssessment(context) {
      let res = await reqGetAllAssessment() // 调用 API 函数获取所有评估信息
      if (res.status == 200) // 如果请求成功（HTTP 状态码为 200）
        context.commit('ASSESSMENT', res.data) // 提交 mutation 更新评估信息
    },
    
    // 获取所有思考内容的 action
    async getAllThought(context) {
      let res = await reqGetAllThought() // 调用 API 函数获取所有思考内容
      if (res.status == 200) { // 如果请求成功（HTTP 状态码为 200）
        context.commit('THOUGHT', res.data) // 提交 mutation 更新思考列表
        return 'ok' // 返回成功标志
      } else
        return Promise.reject(new Error('fail')) // 请求失败，返回 Promise.reject
    },
    
    // 获取配置信息的 action
    async getConfig(context) {
      let res = await reqGetConfig() // 调用 API 函数获取配置信息
      if (res.status == 200) { // 如果请求成功（HTTP 状态码为 200）
        context.commit('CONFIG', res.data) // 提交 mutation 更新配置信息
        return 'ok' // 返回成功标志
      } else
        return Promise.reject(new Error('fail')) // 请求失败，返回 Promise.reject
    }
  },
})

// 导出 store 实例，供应用中其他组件使用
export default store;