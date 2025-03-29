<template>
  <v-img
    id="bg_img"
    src="../assets/登录背景.png"
    :aspect-ratio="16 / 9"
    height="100%"
    width="100%"
    gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
  >
    <!--  -->
    <div class="flex-container">
      <v-card id="draw-border"  auto flat v-show="loginshow">
        <v-row class="ml-12">
          <v-col cols="6">
            <v-icon size="200px" color="green darken-4"> mdi-terrain</v-icon>

            <h1 style="color: rgb(27, 93, 32); display: flex;width: 190px;justify-content: center;">虚拟丹霞</h1>
          </v-col>
          
        </v-row>
        
        <v-row class="ml-14">
          <v-col cols="6" v-show="!show" >
            <button @click="visiter()">
              <v-icon right  size="50px"> mdi-account-cowboy-hat-outline</v-icon>
              <span>游客模式</span>
            </button>
            <button @click="enterlogin()" style="margin-bottom: 60px;margin-top: 20px;">
              <v-icon right size="50px"> mdi-face-man-shimmer-outline</v-icon>
              <span>账号登录</span>
            </button>
          </v-col>
          
          <v-col cols="12" v-show="show">
            <div style="display: flex">
              <h2 class="text-h4 black--text font-weight-bold">账号登录</h2>
            </div>

            <div style="display: flex; margin-top: 20px">
              <v-row>
                <v-col cols="12" md="10">
                  <v-text-field
                    label="学号"
                    solo
                    flat
                    outlined
                    prepend-inner-icon="mdi-account-outline"
                    hide-details
                    v-model="name"
                  ></v-text-field>

                  <v-text-field
                    label="密码"
                    solo
                    flat
                    outlined
                    prepend-inner-icon="mdi-lock-open"
                    hide-details
                    type="password"
                    class="mt-6"
                    v-model="pwd"
                    @keyup.enter="keydown"
                  ></v-text-field>

                  <div style="display: inline-flex;">
                    <v-btn
                      width="100px"
                      class="mr-1"
                      color="primary"
                      @click="login"
                      :loading="loading"
                      :disabled="loading"
                    >登录</v-btn>
                    <v-btn
                      width="100px"
                      class="ml-1"
                      color="primary"
                      @click="back"
                    >返回</v-btn>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </div>
  </v-img>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from "axios";

export default {
  name: "Login",
  setup() {
    const router = useRouter();
    const store = useStore();

    // 响应式状态
    const loginshow = ref(true);
    const show = ref(false);
    const name = ref("");
    const pwd = ref("");
    const checkbox = ref(true);
    const loading = ref(false);
    const isteacher = ref("");
    const tname = ref("");
    const err_msg = ref('');
    
    // API服务器配置 - 可以添加备用服务器
    const API_BASE_URL = ref('https://danxiagis.top:8081');
    const API_FALLBACK_URL = ref('http://danxiagis.top:8081'); // 备用不使用HTTPS的URL

    // 配置axios默认设置
    axios.defaults.timeout = 15000; // 请求超时时间
    axios.defaults.withCredentials = true; // 允许跨域携带cookie
    
    // 尝试使用备用URL发送请求
    const tryWithFallbackUrl = (url, config) => {
      // 将原URL替换为备用URL
      const fallbackUrl = url.replace(API_BASE_URL.value, API_FALLBACK_URL.value);
      config.url = fallbackUrl;
      
      console.log("尝试使用备用URL:", fallbackUrl);
      return axios(config);
    };

    // 方法
    const GetMaterial = () => {
      axios({
        method: "get",
        url: `${API_BASE_URL.value}/uploadData/get`,
      }).then((response) => {
        let res = response.data;
        localStorage.setItem("meterial", JSON.stringify(res));
      }).catch(error => {
        console.error("获取材料失败:", error);
      });
    };

    const enterlogin = () => {
      show.value = true;
    };

    const back = () => {
      show.value = false;
      loginshow.value = true;
    };

    const visiter = () => {
      sessionStorage.setItem("isvisiter", true);
      sessionStorage.setItem("userName", "游客");
      sessionStorage.setItem("loginState", true);
      router.push("/front");
    };

    const keydown = (e) => {
      if (e.keyCode === 13) {
        login();
      }
    };

    const login = () => {
      if (!name.value || !pwd.value) {
        alert("请输入学号和密码");
        return;
      }
      
      // 添加学生账号本地验证
      if (name.value === "student" && pwd.value === "123456") {
        loading.value = true;
        
        // 创建模拟学生数据
        const studentData = {
          name: "学生测试账号",
          Stu_id: "student",
          Password: "123456",
          class_name: "2023级测试班",
          group: {
            group_id: "test_group",
            leader: "student",
            members: ["学生测试账号", "组员1", "组员2"]
          }
        };
        
        // 设置所有必要的会话数据
        sessionStorage.setItem("isvisiter", "false");
        sessionStorage.setItem("isteacher", "false");
        sessionStorage.setItem("userName", studentData.name);
        sessionStorage.setItem("class_name", studentData.class_name);
        sessionStorage.setItem("group_id", studentData.group.group_id);
        sessionStorage.setItem("group_leader", studentData.group.leader);
        sessionStorage.setItem("group_member", JSON.stringify(studentData.group.members));
        sessionStorage.setItem("stu_id", studentData.Stu_id);
        sessionStorage.setItem("password", studentData.Password);
        sessionStorage.setItem("loginState", "true");
        sessionStorage.setItem("is_leader", "true");
        
        // 存储到vuex
        store.state.stuName = studentData.name;
        store.commit("loginIn", studentData);
        
        console.log("使用学生测试账号登录成功");
        
        // 确保数据已保存后再跳转
        setTimeout(() => {
          // 去除加载效果
          loading.value = false;
          // 跳转到前端页面
          router.push("/front");
        }, 500);
        
        return;
      }
      
      // 添加一个本地验证的固定账号，服务器不可用时也能登录
      // 本地管理员账号: 3admin 密码: admin123
      if (name.value === "3admin" && pwd.value === "admin123") {
        loading.value = true;
        
        // 创建模拟管理员数据，确保包含所有需要的字段
        const adminData = {
          name: "管理员账号",
          teacher_id: "3admin",
          Password: "admin123",
          // 添加可能缺少的必要字段
          class_name: "管理员班级",
          group: {
            group_id: "admin_group",
            leader: "3admin",
            members: ["管理员账号"]
          },
          // 兼容学生和教师数据结构
          Stu_id: "3admin"
        };
        
        // 设置所有必要的会话数据
        sessionStorage.setItem("isvisiter", "false");
        sessionStorage.setItem("isteacher", "true");
        sessionStorage.setItem("userName", adminData.name);
        sessionStorage.setItem("class_name", adminData.class_name);
        sessionStorage.setItem("group_id", adminData.group.group_id);
        sessionStorage.setItem("group_leader", adminData.group.leader);
        sessionStorage.setItem("group_member", JSON.stringify(adminData.group.members));
        sessionStorage.setItem("stu_id", adminData.teacher_id);
        sessionStorage.setItem("password", adminData.Password);
        sessionStorage.setItem("loginState", "true");
        sessionStorage.setItem("is_leader", "true");
        
        // 存储到vuex
        store.state.stuName = adminData.name;
        store.commit("loginIn", adminData);
        
        console.log("使用管理员账号登录成功");
        
        // 确保数据已保存后再跳转
        setTimeout(() => {
          // 去除加载效果
          loading.value = false;
          // 跳转到前端页面
          router.push("/front");
        }, 500);
        
        return;
      }
      
      loading.value = true;
      // 第一个数字判断是不是老师，3是老师
      let f = name.value.substring(0, 1);
      //  教师和学生端判断
      if (f != 3) {
        sessionStorage.setItem("isteacher", "false");
        
        // 创建axios请求配置
        const axiosConfig = {
          method: "post",
          url: `${API_BASE_URL.value}/login/Web/student`,
          params: {
            Stu_id: name.value,
            Password: pwd.value,
          },
          withCredentials: true,
          timeout: 15000, // 增加超时时间
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        };
        
        axios(axiosConfig)
          .then((response) => {
            console.log(response);
            let dataObj = response.data;
            err_msg.value = dataObj.message;
            
            // 返回的学号无错误，即开始处理(后端进行了判断处理)
            if (dataObj.name != null) {
              // 将用户的信息写入sessionStorage中，方便后续需要展示信息时取来用
              sessionStorage.setItem("isvisiter", "false");
              sessionStorage.setItem("isteacher", "false");
              sessionStorage.setItem("userName", dataObj.name);
              sessionStorage.setItem("class_name", dataObj.class_name);
              sessionStorage.setItem("group_id", dataObj.group.group_id);
              sessionStorage.setItem("group_leader", dataObj.group.leader);
              sessionStorage.setItem("group_member", dataObj.group.members);
              sessionStorage.setItem("stu_id", dataObj.Stu_id);
              sessionStorage.setItem("password", dataObj.Password);
              sessionStorage.setItem("loginState", "true");
              if (dataObj.Stu_id == dataObj.group.leader)
                sessionStorage.setItem("is_leader", "true");
              
              store.state.stuName = dataObj.name;
              // 将用户信息放入vuex
              store.commit("loginIn", dataObj);
              
              // 去除加载效果
              loading.value = false;
              // 跳转导航页面
              router.push("/front");
            } else {
              loading.value = false;
              alert(response.data.message || "登录失败，请检查用户名和密码");
            }
          })
          .catch((error) => {
            console.error('登录请求错误:', error);
            
            // 尝试使用备用URL
            tryWithFallbackUrl(axiosConfig.url, axiosConfig)
              .then(response => {
                console.log("备用URL响应:", response);
                let dataObj = response.data;
                
                if (dataObj.name != null) {
                  // 将用户的信息写入sessionStorage中，方便后续需要展示信息时取来用
                  sessionStorage.setItem("isvisiter", "false");
                  sessionStorage.setItem("isteacher", "false");
                  sessionStorage.setItem("userName", dataObj.name);
                  sessionStorage.setItem("class_name", dataObj.class_name);
                  sessionStorage.setItem("group_id", dataObj.group.group_id);
                  sessionStorage.setItem("group_leader", dataObj.group.leader);
                  sessionStorage.setItem("group_member", dataObj.group.members);
                  sessionStorage.setItem("stu_id", dataObj.Stu_id);
                  sessionStorage.setItem("password", dataObj.Password);
                  sessionStorage.setItem("loginState", "true");
                  if (dataObj.Stu_id == dataObj.group.leader)
                    sessionStorage.setItem("is_leader", "true");
                  
                  store.state.stuName = dataObj.name;
                  // 将用户信息放入vuex
                  store.commit("loginIn", dataObj);
                  
                  // 去除加载效果
                  loading.value = false;
                  // 跳转导航页面
                  router.push("/front");
                } else {
                  loading.value = false;
                  alert(response.data.message || "登录失败，请检查用户名和密码");
                }
              })
              .catch(fallbackError => {
                loading.value = false;
                
                // 分析错误类型并给出相应提示
                if (error.response) {
                  // 服务器返回了错误状态码
                  alert(`登录失败: ${error.response.data.message || '服务器返回错误 ' + error.response.status}`);
                } else if (error.request) {
                  // 请求已发送但没有收到响应
                  alert("无法连接到服务器，请检查网络连接或稍后再试。您也可以尝试使用游客模式访问。");
                } else {
                  // 请求设置时出现问题
                  alert("登录请求出错: " + error.message);
                }
              });
          });
          
        // 将用户名和密码存在LocalStorage中
        localStorage.setItem("name", name.value);
        localStorage.setItem("pwd", pwd.value);
      }
      // 教师端登录
      else if (f == 3) {
        sessionStorage.setItem("isteacher", "true");
        
        // 创建axios请求配置
        const axiosConfig = {
          method: "post",
          url: `${API_BASE_URL.value}/login/smallWeb/teacher`,
          params: {
            teacher_id: name.value,
            Password: pwd.value
          },
          withCredentials: true,
          timeout: 15000, // 增加超时时间
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        };
        
        axios(axiosConfig)
          .then(response => {
            console.log(response);
            let dataObj = response.data;
            if (dataObj.name != null) {
              // 将用户的信息写入sessionStorage中，方便后续需要展示信息时取来用
              sessionStorage.setItem("isvisiter", "false");
              sessionStorage.setItem("userName", dataObj.name);
              sessionStorage.setItem("stu_id", dataObj.teacher_id);
              sessionStorage.setItem("password", dataObj.Password);
              sessionStorage.setItem("loginState", "true");
              
              store.state.stuName = dataObj.name;
              store.commit("loginIn", dataObj);
              
              // 去除加载效果
              loading.value = false;
              // 跳转导航页面
              router.push("/front");
            } else {
              loading.value = false;
              alert(response.data.message || "登录失败，请检查用户名和密码");
            }
          })
          .catch(error => {
            console.error('教师登录请求错误:', error);
            
            // 尝试使用备用URL
            tryWithFallbackUrl(axiosConfig.url, axiosConfig)
              .then(response => {
                console.log("备用URL响应:", response);
                let dataObj = response.data;
                
                if (dataObj.name != null) {
                  // 将用户的信息写入sessionStorage中，方便后续需要展示信息时取来用
                  sessionStorage.setItem("isvisiter", "false");
                  sessionStorage.setItem("userName", dataObj.name);
                  sessionStorage.setItem("stu_id", dataObj.teacher_id);
                  sessionStorage.setItem("password", dataObj.Password);
                  sessionStorage.setItem("loginState", "true");
                  
                  store.state.stuName = dataObj.name;
                  store.commit("loginIn", dataObj);
                  
                  // 去除加载效果
                  loading.value = false;
                  // 跳转导航页面
                  router.push("/front");
                } else {
                  loading.value = false;
                  alert(response.data.message || "登录失败，请检查用户名和密码");
                }
              })
              .catch(fallbackError => {
                loading.value = false;
                
                // 分析错误类型并给出相应提示
                if (error.response) {
                  // 服务器返回了错误状态码
                  alert(`登录失败: ${error.response.data.message || '服务器返回错误 ' + error.response.status}`);
                } else if (error.request) {
                  // 请求已发送但没有收到响应
                  alert("无法连接到服务器，请检查网络连接或稍后再试。您也可以尝试使用游客模式访问。");
                } else {
                  // 请求设置时出现问题
                  alert("登录请求出错: " + error.message);
                }
              });
          });
        
        // 将用户名和密码存在LocalStorage中
        localStorage.setItem("name", name.value);
        localStorage.setItem("pwd", pwd.value);
      }
    };

    // 刷新API地址（从HTTP尝试HTTPS）
    const refreshApiUrl = () => {
      if (API_BASE_URL.value.startsWith('https')) {
        API_BASE_URL.value = 'http://danxiagis.top:8081';
      } else {
        API_BASE_URL.value = 'https://danxiagis.top:8081';
      }
    };

    onMounted(() => {
      // 检测服务器连接状况
      axios.get(`${API_BASE_URL.value}/login/Web/health`, { timeout: 5000 })
        .catch(error => {
          console.log("主服务器不可访问，切换到备用URL");
          refreshApiUrl();
        });
        
      // 从URL获取重定向信息
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect');
      
      // 清除任何可能存在的错误会话状态
      if (sessionStorage.getItem("loginState") === "false") {
        sessionStorage.removeItem("loginState");
      }
      
      // 从localStorage获取存储的凭据自动填充
      const savedName = localStorage.getItem("name");
      const savedPwd = localStorage.getItem("pwd");
      if (savedName && savedPwd) {
        name.value = savedName;
        pwd.value = savedPwd;
      }
    });

    return {
      loginshow,
      show,
      name,
      pwd,
      checkbox,
      loading,
      isteacher,
      tname,
      err_msg,
      GetMaterial,
      enterlogin,
      back,
      login,
      visiter,
      keydown
    };
  }
};
</script>

<style scoped>

#bg_img {
  position: absolute;
}

#draw-border {
 
  background-color: rgba(255, 255, 255, 0.85);
  display: flex;
  max-width: 600px;
  margin: auto;
}
.flex-container {
  
  position: relative;
  top: 25%;
  justify-content: center;
  align-items: center;
}
button {
  width: 200px;
  margin-top: 50px;
  margin-bottom: 20px;
  border: 0;
  background: none;
  text-transform: uppercase;
  color: #808781;
  font-weight: bold;
  position: relative;
  outline: none;
  padding: 10px 20px;
  box-sizing: border-box;
}

button::before,
button::after {
  box-sizing: inherit;
  position: absolute;
  content: "";
  border: 2px solid transparent;
  width: 0;
  height: 0;
}

button::after {
  bottom: 0;
  right: 0;
}

button::before {
  top: 0;
  left: 0;
}

button:hover::before,
button:hover::after {
  width: 100%;
  height: 100%;
}

button:hover::before {
  border-top-color: #808781;
  border-right-color: #808781;
  transition: width 0.3s ease-out, height 0.3s ease-out 0.3s;
}

button:hover::after {
  border-bottom-color: #808781;
  border-left-color: #808781;
  transition: border-color 0s ease-out 0.6s, width 0.3s ease-out 0.6s,
    height 0.3s ease-out 1s;
}
</style>