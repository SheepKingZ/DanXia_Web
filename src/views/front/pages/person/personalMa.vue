<template>
  <v-card tile height="100%">
    <v-tabs vertical>
      <v-tab>
        <!-- 组队的图表account-group -->
        <v-icon left> mdi-account </v-icon>
        查看个人信息
      </v-tab>
      <v-tab>
        <v-icon left> mdi-lock </v-icon>
        个人密码修改
      </v-tab>
      <v-tab>
        <v-icon left> mdi-chat-question-outline </v-icon>
        常见问题答疑
      </v-tab>

      <v-tab-item>
        <v-card flat tile color="green lighten-5" min-height="700px">
          <v-row justify="center" class="pt-8">
            <v-icon size="100px">mdi-account-circle</v-icon>
          </v-row>
          <v-row justify="center">
            <h2 class="font-weight-regular">{{ userName }}</h2>
          </v-row>
          <v-container>
            <v-row class="pa-2">
              <v-icon>mdi-chevron-right</v-icon>
              <h4 class="pl-5">班级：{{ className }}</h4>
            </v-row>
            <v-row class="pa-2">
              <v-icon>mdi-chevron-right</v-icon>
              <h4 class="pl-5">学号：{{ stuId }}</h4>
            </v-row>
            <v-row class="pa-2">
              <v-icon>mdi-chevron-right</v-icon>
              <h4 class="pl-5">组号：{{ groupId }}</h4>
            </v-row>
            <v-row class="pa-2">
              <v-icon>mdi-chevron-right</v-icon>
              <h4 class="pl-5">是否组长：{{ ifCaptain }}</h4>
            </v-row>
            <v-row class="pa-2">
              <v-icon>mdi-chevron-right</v-icon>
              <h4 class="pl-5">分组名单</h4>
            </v-row>
            <v-col cols="5">
              <v-simple-table dense>
                <template v-slot:default>
                  <thead style="background-color: lightgray">
                    <tr>
                      <th class="text-left">学号</th>
                      <th class="text-left">姓名</th>
                      <th class="text-left">班级</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in list" :key="item.id">
                      <td>{{ item.id }}</td>
                      <td>{{ item.name }}</td>
                      <td>{{ item.class }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-container>
          <br /><br />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card tile color="green lighten-5" min-height="700px">
          <br /><br />
          <v-container fluid id="passwordpage">
            <v-row>
              <v-alert
                text
                dense
                color="info"
                icon="mdi-cloud-alert"
                border="left"
                class="pr-6 mb-8"
              >
                新密码要求是6-20位数字或特殊字符
              </v-alert>
            </v-row>
            <v-row>
              <h4 class="mt-5">旧密码</h4>
              <v-col cols="3">
                <v-text-field
                  v-model="old"
                  label="请输入"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required]"
                  :type="show1 ? 'text' : 'password'"
                  name="input-10-1"
                  counter
                  single-line
                  outlined
                  dense
                  @click:append="show1 = !show1"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row
              ><h4 class="mt-5">新密码</h4>
              <v-col cols="3">
                <v-text-field
                v-model="new1"
                  label="请输入"
                  :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.max, rules.min, rules.required]"
                  :type="show2 ? 'text' : 'password'"
                  name="input-10-2"
                  counter
                  single-line
                  outlined
                  dense
                  @click:append="show2 = !show2"
                ></v-text-field
              ></v-col>
            </v-row>
            <v-row
              ><h4 class="mt-5">确认密码</h4>
              <v-col cols="3">
                <v-text-field
                v-model="new2"
                  label="请再次输入"
                  :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.max, rules.min, rules.required]"
                  :type="show3 ? 'text' : 'password'"
                  name="input-10-3"
                  counter
                  single-line
                  outlined
                  dense
                  @click:append="show3 = !show3"
                ></v-text-field
              ></v-col>
            </v-row>
            <v-row>
              <v-btn outlined color="success" width="130px" @click="check()"> 确认修改</v-btn>
            </v-row>
          </v-container>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card tile color="green lighten-5" min-height="700px">
          <br /><br />
         
          <p id="pi" class="ml-5 text-h6 font-weight-bold">常见问题及解答:</p>
          <p class="mx-8 " style="white-space: pre-wrap; " >{{ answer1 }}</p>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from "axios";

export default {
  name: "Home",
  setup() {
    const store = useStore();
    
    const answer1 = ref('（一）账号为学号，初始密码：12345678，修改密码后若遗忘请联系管理员重置密码。\n（二）使用"视点分析"功能时，距离设置会影响分析时间。\n（三）提交考核问题请注意截止时间，超时将无法提交。\n（四）组长在完成实习报告提交后，请为小组成员进行评分。\n（五）使用"剖面线工具"，在自定义绘制后双击鼠标即可生成剖面图。\n（六）若在使用过程中出现长时间卡顿或加载失败，可以尝试刷新或更换网络重新登录。');
    const old = ref('');
    const new1 = ref('');
    const new2 = ref('');
    const ifCaptain = ref(sessionStorage.is_leader === 'true' ? '是' : '否'); // 判断是否是队长
    const list = ref([]);
    const show1 = ref(false);
    const show2 = ref(false);
    const show3 = ref(false);
    
    const rules = reactive({
      required: (value) => !!value || "请输入",
      min: (v) => v.length >= 6 || "最少输入六位",
      max: (v) => v.length <= 20 || "最多输入20位",
    });
    
    const header = ref([
      {
        text: "学号",
        align: "start",
        value: "id",
      },
      { text: "班级", value: "class" },
      { text: "姓名", value: "name" },
    ]);
    
    const member = () => {
      let mem = sessionStorage.group_member;
      console.log('111', mem);
      mem = mem.slice(1, -1);
      // 从，分割变数组
      mem = mem.split(',');
      console.log('222', mem);

      axios({
        method: "get",
        url: "https://danxiagis.top:8081/login/smallWeb/getStudentList",
      }).then((response) => {
        let res = response.data;
        // 存储组员的信息
        let arry = [];
        
        // 外层，进入每个人对象
        for (let i = 0; i < mem.length; i++) {
          // 获取每个人的对象的属性
          for (let j = 0; j < res.length; j++) {
            if (res[j].stu_id == mem[i]) {
              let Arry = {
                id: res[j].stu_id,
                class: res[j].class_name,
                name: res[j].name,
              };
              arry.push(Arry);
              console.log(mem[i]);
            }
          }
        }
        list.value = arry;
      });
    };
    
    const check = () => {
      var o = sessionStorage.password;
      
      if (old.value != o) {
        alert('旧密码错误');
      }
      if (new1.value == '' || new2.value == '' || old.value == '') {
        alert('不能为空');
      }
      else if (new1.value != new2.value) {
        alert('两次输入不一致');
      } else if (new2.value == old.value) {
        alert('两次密码不能为一样的');
        return;
      }
      
      axios({
        method: "post",
        url: "https://danxiagis.top:8081/login/smallWeb/changePassword",
        params: {
          Stu_id: stuId.value,
          Password: new2.value
        },
        withCredentials: true
      }).then((response) => {
        let res = response;
        if (res.status >= 200 && res.status < 300) {
          alert("密码修改成功!");
          console.log("测试用例更新成功");
        }
      }).catch(function(error) {
        console.log(error);
        alert("修改密码失败" + error);
      });
    };
    
    // 计算属性
    const className = computed(() => store.getters.class_name);
    const stuId = computed(() => store.getters.stu_id);
    const userName = computed(() => store.getters.userName);
    const groupId = computed(() => store.getters.group_id);
    const groupMember = computed(() => store.getters.group_member);
    
    onMounted(() => {
      member();
    });
    
    return {
      answer1,
      old,
      new1,
      new2,
      ifCaptain,
      header,
      list,
      show1,
      show2,
      show3,
      rules,
      member,
      check,
      className,
      stuId,
      userName,
      groupId,
      groupMember
    };
  }
};
</script>

<style>
#passwordpage{
  position: relative;
  left: 20%;
}
</style>

