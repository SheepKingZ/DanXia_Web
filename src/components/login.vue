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

    // 方法
    const GetMaterial = () => {
      axios({
        method: "get",
        url: "https://danxiagis.top:8081/uploadData/get",
      }).then((response) => {
        let res = response.data;
        localStorage.setItem("meterial", JSON.stringify(res));
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
      loading.value = true;
      // 第一个数字判断是不是老师，3是老师
      let f = name.value.substring(0, 1);
      //  教师和学生端判断
      if (f != 3) {
        sessionStorage.setItem("isteacher", "false");
        axios({
          method: "post",
          url: "https://danxiagis.top:8081/login/Web/student",
          params: {
            Stu_id: name.value,
            Password: pwd.value,
          },
          withCredentials: true,
          rejectUnauthorized: false
        })
          .then((response) => {
            console.log(response);
            let dataObj = response.data;
            console.log("@@@", dataObj);
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
              alert(response.data.message);
            }
          })
          .catch((error) => {
            loading.value = false; 
            console.log('error.data', error);
            alert(err_msg.value); // 错误弹窗
          });
          
        // 将用户名和密码存在LocalStorage中
        localStorage.setItem("name", name.value);
        localStorage.setItem("pwd", pwd.value);
      }
      // 教师端登录
      else if (f == 3) {
        sessionStorage.setItem("isteacher", "true");
        axios({
          url: 'https://danxiagis.top:8081/login/smallWeb/teacher',
          method: 'post',
          params: {
            teacher_id: name.value,
            Password: pwd.value
          }
        }).then(response => {
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
            alert(response.data.message);
          }
        }).catch(error => {
          loading.value = false;
          console.log(error);
          alert("请求出错了"); // 错误弹窗
        });
        
        // 将用户名和密码存在LocalStorage中
        localStorage.setItem("name", name.value);
        localStorage.setItem("pwd", pwd.value);
      }
    };

    onMounted(() => {
      // Add any onMounted logic here if needed
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