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
                  ></v-text-field>

                  <div style="display: inline-flex;">
                    <v-btn
                      width="100px"
                      class="mr-1"
                      color="primary"
                      @click.stop="login()"
                      @keyup.enter="keydown(e)"
                      :loading="loading"
                      :disabled="loading"
                      >登录</v-btn
                    >
                    <v-btn
                      width="100px"
                      class="ml-1"
                      color="primary"
                      @click.stop="back()"
                      >返回</v-btn
                    >
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
import axios from "axios";
export default {
  name: "Login",
  data() {
    return {
      loginshow: true,
      show: false,
      name: "",
      pwd: "",
      checkbox: true,
      loading: false,
      isteacher: "",
      tname: "",
      err_msg:''
    };
  },
  methods: {
    GetMaterial() {
      axios({
        method: "get",
        url: "https://danxiagis.top:8081/uploadData/get",
      }).then((response) => {
        let res = response.data;
        localStorage.setItem("meterial", JSON.stringify(res));
      });
    },
    enterlogin() {
      this.show = true;
      //this.loginshow = false;
    },
    back() {
      this.show = false;
      this.loginshow = true;
    },
    login() {
      this.loading = true;
      // console.log(this.name);
      // console.log(this.pwd);
      // console.log(this.$router);
      //第一个数字判断是不是老师，3是老师
      let f = this.name.substring(0, 1);
      //  教师和学生端判断
      if (f != 3) {
        sessionStorage.setItem("isteacher", false);
        axios({
          method: "post",
          url: "https://danxiagis.top:8081/login/Web/student", //https://danxiagis.top:3005/login/Web/student
          //data: `Stu_id=${this.name}&Password=${this.pwd}`,
          params: {
            Stu_id: this.name,
            Password: this.pwd,
          },
          withCredentials: true,
          rejectUnauthorized: false
        })
          .then((response) => {
            // console.log(response.data);
            // console.log(response.data.Name);
            console.log(response);
            let dataObj = response.data;
            console.log("@@@", dataObj);
            this.err_msg=dataObj.message
            //返回的学号无错误，即开始处理(后端进行了判断处理)
            if (dataObj.name != null) {
              // console.log(this.$store)
              //将用户的信息写道sessionStorage中，方便后续需要展示信息时取来用
              sessionStorage.setItem("isvisiter", false);
              sessionStorage.setItem("isteacher", false);
              sessionStorage.setItem("userName", dataObj.name);
              sessionStorage.setItem("class_name", dataObj.class_name);
              sessionStorage.setItem("group_id", dataObj.group.group_id);
              sessionStorage.setItem("group_leader", dataObj.group.leader);
              sessionStorage.setItem("group_member", dataObj.group.members);
              sessionStorage.setItem("stu_id", dataObj.Stu_id);
              sessionStorage.setItem("password", dataObj.Password);
              sessionStorage.setItem("loginState", true);
              if (dataObj.Stu_id == dataObj.group.leader)
                sessionStorage.setItem("is_leader", true);

              // console.log(sessionStorage);
              this.$store.state.stuName = dataObj.name;
              //将用户信息繁缛vuex
              this.$store.commit("loginIn", dataObj);
              // console.log(this.$store.state.loginState);
              // console.log(this.$store.state.currentUser);
              //去除加载效果
              this.loading = false;
              //跳转导航页面
              this.$router.push("/front");
            } else {
              this.loading = false;
              this.alert(response.data.message);
            }
          })
          .catch((error) => {
            this.loading = false; 
            console.log('error.data',error);
            alert(this.err_msg); //错误弹窗
          });
        //将用户名和密码存在LocalStorage中
        localStorage.setItem("name", this.name);
        localStorage.setItem("pwd", this.pwd);
      }
      // 教师端登录
      else if (f==3) {
        axios({
          url:'https://danxiagis.top:8081/login/smallWeb/teacher',
          method:'post',
          params:{
            Tea_id:this.name,
            Password:this.pwd
          },
          withCredentials: true,
        }).then(resp=>{
          let res=resp.data
          console.log('ressss',res);
          if (res.name != null)
          {
            this.tname=res.name+'老师'
          
            sessionStorage.setItem("isteacher", true);
            sessionStorage.setItem("isvisiter", false);
            sessionStorage.setItem("userName", this.tname);//教师名字
            sessionStorage.setItem("id", this.name);//工号
            sessionStorage.setItem("loginState", true);
            sessionStorage.setItem("teacheruuid",res._id)
            localStorage.setItem("name", this.name);//工号
            localStorage.setItem("pwd", this.pwd);

            this.$store.state.stuName = this.tname;
            this.loading = false;
            this.$router.push("/front"); //跳转导航页面
          }else {
              this.loading = false;
              
              alert(res.message);
            }
        }).catch((error) => {
            this.loading = false; 
            console.log('error.data',error);
            alert(this.err_msg); //错误弹窗
          });
      } else {
        alert("登录异常，请检查登录账户"); //错误弹窗
      }
    },
    keyDown(e) {
      // 回车则执行登录方法 enter键的ASCII是13
      if (e.key == "Enter") {
        this.login(); // 定义的登录方法
        e.preventDefault(); // 去掉默认的换行
      }
    },

    visiter() {
      this.loading = true;
      let vname = "游客";
      sessionStorage.setItem("loginState", true);
      sessionStorage.setItem("isvisiter", true);
      sessionStorage.setItem("userName", vname);
      this.$router.replace("/front");
    },

    created() {
      for (var i = localStorage.length - 1; i >= 0; i--) {
        if (localStorage.key(i) == "name") {
          this.name = localStorage.getItem(localStorage.key(i));
        } else if (localStorage.key(i) == "pwd") {
          this.pwd = localStorage.getItem(localStorage.key(i));
        }
      }
    },
  },

  /* 不用存到仓库里，主要是数据处理 */
  mounted() {
    this.GetMaterial();
    // 绑定监听事件
    window.addEventListener("keydown", this.keyDown);
  },
  destroyed() {
    // 销毁事件
    window.removeEventListener("keydown", this.keyDown, false);
  },
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