<template>
  <v-card tile height="100%">
    <v-tabs vertical>
      <v-tab>
        <!-- 组队的图表account-group -->
        <v-icon left> mdi-eye </v-icon>
        查看实习报告
      </v-tab>
      <v-tab>
        <v-icon left> mdi-arrow-up-bold </v-icon>
        提交实习报告
      </v-tab>
      <v-tab>
        <v-icon left> mdi-file-upload-outline </v-icon>
        提交考核问题
      </v-tab>
      <v-tab-item>
        <v-card tile color="green lighten-5" min-height="700px">
          <v-chip
            class="ma-5 pa-5"
            style="font-size: large"
            color="success"
            outlined
            v-show="show_report"
          >
            <v-icon left> mdi-server-plus </v-icon>
            感谢您的提交，您上次的提交时间是<span
              style="color: green; font-weight: 700"
              >{{ input_time }}</span
            >,截止时间为：
            <span style="color: red; font-weight: 700">{{ ddl }}</span>
          </v-chip>
          <v-chip
            class="ma-5 pa-5"
            style="font-size: large"
            color="success"
            outlined
            v-show="unshow_report"
          >
            <v-icon left> mdi-server-plus </v-icon>
            您还未提交，截止时间为：<span
              style="color: red; font-weight: 700"
              >{{ ddl }}</span
            >
          </v-chip>
          <!-- <v-btn
          class="mx-8" width="120px" outlined color="success" 
          >下载实习报告</v-btn> -->

          <v-card height="750" width="90%" class="mx-5" v-show="show_report">
            <iframe :src="reportsrc" width="100%" height="100%"></iframe>
          </v-card>
          <br /><br />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card title flat color="green lighten-5" min-height="700px">
          <v-dialog
            v-model="IsSending"
            persistent
            max-width="200"
            class="sending"
            :key="dialogKey"
          >
            <!-- 加个x，关闭弹窗，超过100mb不给上传， -->
            <v-card color="ivory">
              <v-card-title>
                <marquee scrollamount="10">正在上传中...</marquee>
              </v-card-title>
              <v-btn color="green darken-1" text @click="cancelUpload"
                >取消
              </v-btn>
            </v-card>
          </v-dialog>
          <v-chip
            class="ma-5 pa-5"
            style="font-size: large"
            color="success"
            outlined
            v-show="show_report"
          >
            <v-icon left> mdi-server-plus </v-icon>
            感谢您的提交，您上次的提交时间是<span
              style="color: green; font-weight: 700"
              >{{ input_time }}</span
            >
          </v-chip>
          <v-chip
            class="ma-5 pa-5"
            style="font-size: large"
            color="success"
            outlined
            v-show="unshow_report"
          >
            <v-icon left> mdi-server-plus </v-icon>
            您还未提交，截止时间为：<span
              style="color: red; font-weight: 700"
              >{{ ddl }}</span
            >
          </v-chip>
          <div style="margin-left: 20px">
            <v-btn>
              <v-file-input
                prepend-icon="mdi-cloud-upload-outline"
                v-model="report_text"
                accept=".pdf"
                style="width: 400px"
                @change="change_size"
              ></v-file-input>
            </v-btn>
            <span style="margin-left: 20px"> 当前文件大小为 </span>
            <span
              :class="{ highlight: FileSize > 100, normal: FileSize <= 100 }"
              style="font-weight: 700"
            >
              {{ FileSize }}
            </span>
            <span> MB </span>
            <div style="margin: 10px; font-weight: 700">
              <span style="color: red">
                (注意：实习报告文件不得超过100MB)
              </span>
            </div>
          </div>
          <v-row class="mt-5">
            <v-btn
              dark
              class="mx-8"
              width="120px"
              outlined
              color="success"
              @click="dialog = true"
              :class="{'disable-events': isTimeout}"
              
            ><!--  -->
              {{ text }}
            </v-btn>
            <v-btn
              class="mx-5"
              width="120px"
              outlined
              color="success"
              @click="report_text = null"
            >
              清空
            </v-btn>
          </v-row>

          <v-row>
            <v-col cols="4" class="mt-1 ml-1">
              <v-simple-table dense v-if="isLeader">
                <thead style="background-color: rgb(97, 191, 127)">
                  <tr>
                    <th class="text-left">学号</th>
                    <th class="text-left">姓名</th>
                    <th class="text-left">评分</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in list" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>
                      <template
                        ><v-text-field
                          :rules="[rule.max, rule.min]"
                          v-model="item.leader_mark"
                          single-line
                          dense
                          style="max-width: 30px; font-weight: bold"
                        ></v-text-field
                      ></template>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-col>
          </v-row>
          <v-btn
            dark
            class="mt-4 ml-5"
            width="120px"
            outlined
            color="success"
            @click="send_point"
            v-if="isLeader"
          >
            确定评分
          </v-btn>

          <v-row>
            <v-dialog v-model="dialog" width="500">
              <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                  是否确认提交
                </v-card-title>
                <v-card-text> </v-card-text>
                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    text
                    @click="send_rtext(), (dialog = false)"
                  >
                    确认
                  </v-btn>
                  <v-btn color="primary" text @click="dialog = false">
                    取消
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card tile color="green lighten-5" min-height="700px">
          <!-- 问题列表 -->
          <v-col cols="8">
            <v-data-table
              :headers="Qus_headers"
              :items="Qus_desserts"
              hide-default-footer
            >
              <!-- 
                { on }: 是 activator 插槽的作用域变量。它是一个对象，
                包含了一组事件监听器，这些监听器是为了触发 <v-tooltip> 的显示。
                  在Vuetify内部，它可能包括像 mouseenter、focus 和其他相关事件的监听器，
                  当这些事件发生时，<v-tooltip> 将会显示。
              -->
              <template v-slot:item.answerStatus="{ item }">
                <span
                  :style="
                    item.answerStatus === true ? 'color: greenyellow' : 'color: red'
                  "
                >
                  <span style="font-size: 20px">●</span>
                </span>
              </template>
              <template #item.answer="{ item }">
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      small
                      class="mr-2"
                      @click="edit_quesItem(item)"
                      v-on="on"
                      ><!-- 想试一下，直接禁用，设置一个disabled的变量 :disabled="isBlock"-->
                      mdi-pencil
                    </v-icon>
                  </template>
                  <span>点击回答</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-col>
          <v-dialog v-model="qusdialog" width="500">
            <v-card>
              <v-card-title class="text-h5 grey lighten-2">
                {{ current_ques }}
              </v-card-title>

              <br />
              <v-textarea
                outlined
                name="input-7-4"
                v-model="current_ans"
                style="padding-left: 20px; padding-right: 20px"
              ></v-textarea>
              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="startInput"> 确认提交 </v-btn>
                <v-btn color="primary" text @click="qusdialog = false">
                  关闭
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <br /><br />
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import axios from "axios";
import debounce from "lodash/debounce";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { ref, reactive, computed, onMounted, onBeforeUpdate } from 'vue';
import { useStore } from 'vuex';

export default {
  name: "groupReport",
  setup() {
    // 初始化 store
    const store = useStore();
    
    // 响应式状态
    const isTimeout = ref(false);
    const dialogKey = ref(0);
    const FileSize = ref(0);
    const text = ref("提交");
    const IsSending = ref(false);
    /* 将从sesstionstorage中传来的is_leader字符串改为boolean */
    const isLeader = ref(Boolean(sessionStorage.is_leader === "true"));
    const list = ref([]);
    const isBlock = ref(false);
    const dialog = ref(false);
    const report_text = ref("");
    const show_report = ref(true);
    const unshow_report = ref(false);
    const reportsrc = ref(""); // 实习报告链接
    const group_id = ref("");
    const class_name = ref("");
    const input_time = ref(""); // 提交时间
    const input_content = ref(
      "这次地理综合实习是一个全新的体验。以往我们上地理课都是仅限于书本，视频还有图片。在这次综合实习我们到了实地进行考察，全方面的观察了各种地理现象，通过老师的讲解以及现场观察，我们对知识的了解比以往更加深刻。通过这种教学形式，我们不仅能够加深专业知识的理解，还能结合实地内容举一反三。这次的综合实习收获颇多，希望能够多多开展类似学科活动。"
    );
    
    const Qus_headers = ref([
      {
        text: "问题",
        align: "start",
        value: "question",
        sortable: false,
      },
      {
        text: "回答",
        align: "start",
        value: "answer",
        sortable: false,
      },
      {
        text: "截止时间",
        value: "limit",
        sortable: true,
        width: '200px'
      },
      {
        text: "作答状态",
        value: "answerStatus",
        width: '100px'
      },
    ]);
    
    const qusdialog = ref(false);
    const current_ans = ref(""); // 绑定问题答案
    const current_ques = ref(""); // 绑定点击问题
    const que_id = ref("");
    
    const rule = reactive({
      max: (v) => v <= 100 || "只能小于100",
      min: (v) => 0 <= v || "不能小于0",
      len: (v) => v.length > 0 || "不能为空",
    });
    
    let cancelToken = null;

    // 计算属性
    const Qus_desserts = computed(() => store.getters.Qus_desserts);
    const groupAssess = computed(() => store.state.groupAssess);
    const ddl = computed(() => store.state.ddl);

    // 方法
    // 计算文件大小
    const change_size = () => {
      if (report_text.value == "" || report_text.value == null) FileSize.value = 0;
      else FileSize.value = (report_text.value.size / (1024 * 1024)).toFixed(3);
    };

    // 获取组员评分信息
    const get_group_menmark = () => {
      let mem = sessionStorage.group_member;
      mem = mem.slice(1, -1);
      mem = mem.split(",");
      
      axios({
        method: "get",
        url: "https://danxiagis.top:8081/teacher/getPerformance", //http://danxiagis.top:3000/ui/teacher/studentList
      }).then((response) => {
        let res = response.data;
        //存储组员的信息
        let arry = [];

        //外层，进入每个人对象
        for (let i = 0; i < mem.length; i++) {
          //获取每个人的对象的属性
          for (let j = 0; j < res.length; j++) {
            if (res[j].stu_id == mem[i]) {
              let Arry = {
                id: res[j].stu_id,
                class: res[j].class_name,
                name: res[j].name,
                leader_mark: res[j].leaderScoring,
              };
              arry.push(Arry);
              console.log(mem[i]);
            }
          }
        }
        arry.sort((a, b) => a.id - b.id);
        list.value = arry;
      });
    };

    // 提交组长评分
    const send_point = () => {
      let mem_info = [];
      for (let i of list.value) {
        mem_info.push({
          stu_id: Number(i.id),
          score: Number(i.leader_mark),
        });
      }
      
      axios({
        method: "post",
        url: "https://danxiagis.top:8081/assessment/leaderMark",
        data: {
          groupId: Number(sessionStorage.group_id),
          scores: mem_info, // 假设 mem_info 已经是一个对象数组
        },
      })
        .then((response) => {
          console.log(response.data);
          alert("评分成功");
          /* let res=JSON.parse(response.config.data)
          
          let arr =  res.scores.map(item => {
            return { stu_id: item.stu_id, score: item.score };
          }); */
          //
          get_leadermark();
        })
        .catch((err) => {
          console.log(err);
          alert(err);
        });
    };

    // 获取组长评分
    const get_leadermark = () => {
      axios({
        method: "get",
        url: "https://danxiagis.top:8081/teacher/getPerformance",
      }).then((response) => {
        let res = response.data;
        for (let i = 0; i < list.value.length; i++) {
          for (let j = 0; j < res.length; j++) {
            if (list.value[i].id == res[j].stu_id) {
              list.value[i].leader_mark = res[j].leaderScoring;
            }
          }
        }
      });
    };

    // 上传报告
    const send_rtext = () => {
      dialogKey.value++;
      if (report_text.value == "") {
        alert("请选择上传文件");
        dialog.value = false;
        return;
      }
      if (FileSize.value > 100) {
        alert("文件大于100MB，上传失败");
        return;
      }
      
      cancelToken = axios.CancelToken.source();
      IsSending.value = true;
      dialogKey.value++;
      console.log("dia", dialogKey.value);
      
      /* this.report_text.size */
      class_name.value = sessionStorage.class_name.substring(0, 2);
      group_id.value = sessionStorage.group_id;
      let param = new FormData();
      param.append("class_name", class_name.value);
      param.append("group_id", group_id.value);
      param.append("file", report_text.value);
      
      axios({
        method: "post",
        url: "https://danxiagis.top:8081/assessment/sumbitReport",
        data: param,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        cancelToken: cancelToken.token,
      })
        .then((res) => {
          dialogKey.value++;
          IsSending.value = false;
          setTimeout(function () {
            alert(res.data);
          }, 500);

          Getreport();
        })
        .catch((err) => {
          IsSending.value = false;
          if (axios.isCancel(err)) alert(err.message);
          else alert("上传出错", err);
        });

      // console.log(param)
    };

    // 取消上传
    const cancelUpload = () => {
      dialogKey.value++;
      IsSending.value = false;
      if (cancelToken) {
        /* error.message为''中的 */
        cancelToken.cancel("上传被用户取消。");
      }
    };

    // 获取报告
    const Getreport = () => {
      let id = sessionStorage.group_id;
      axios({
        method: "get",
        url: "https://danxiagis.top:8081/assessment/getReport",
      }).then((response) => {
        console.log("res", response);
        let res = response.data;
        for (let a = 0; a < res.length; a++) {
          //是这个组的报告
          if (res[a].group_num == id) {
            reportsrc.value = res[a].report_url + "?rand=" + Math.random();
            input_time.value = res[a].dateChange;
          }
        }
        if (reportsrc.value == "") {
          unshow_report.value = true;
          show_report.value = false;
        } else {
          show_report.value = true;
          unshow_report.value = false;
          text.value = "再次提交";
        }
        //console.log(this.reportsrc);
      });
    };

    // 输入答案弹窗的索引
    const edit_quesItem = (e) => {
      current_ques.value = e.question;
      que_id.value = e.id;
      // 创建一个新的 Date 对象，它表示当前的日期和时间
      let now = new Date().getTime();
      let limit = e.limit;
      limit = e.limit.replace(" ", "T");
      let str = Date.parse(limit);
      console.log('e', e.answerStatus);
      /* 如果这一条的状态是未回答且超时，则不允许查看 */
      
      if (now > str && e.answerStatus == undefined) {
        alert("已超时，无法作答");
        return;
      }
      
      qusdialog.value = true;

      let res = groupAssess.value;
      if (!res) current_ans.value = "";

      for (let i = 0; i < Qus_desserts.value.length; i++) {
        if (res[i].a_id == que_id.value) {
          current_ans.value = res[i].answer;
          break;
        } else current_ans.value = "";
      }
    };

    // 开始输入答案
    const startInput = () => {
      NProgress.start();
      qusinput();
    };

    // 考核问题提交
    const qusinput = debounce(() => {
      let id = sessionStorage.group_id;
      if (current_ans.value.trim().length === 0) {
        alert("还未输入答案");
        return;
      }
      let params = {
        group_id: id,
        answer: current_ans.value,
        assess_id: que_id.value,
      };
        
      axios({
        method: "post",
        url: "https://danxiagis.top:8081/assessment/sumbitAssessment",
        data: params
      }).then((response) => {
        console.log(response);
        NProgress.done();
        alert("提交成功");
        store.dispatch("getGroupAssess", sessionStorage.getItem("group_id"));
        qusdialog.value = false;
      });
    }, 3000);
    
    // 检查截止时间
    const isPassTime = () => {
      console.log('ddl', ddl.value);
      let limit = ddl.value;
      let now = new Date().getTime();
      
      limit = ddl.value.replace(" ", "T");
      let str = Date.parse(limit);
      if (now > str) isTimeout.value = true;
    };

    // 获取答案状态
    const getAssessStatus = () => {
      console.log('asssessssss', groupAssess.value, Qus_desserts.value);
      for (let i = 0; i < Qus_desserts.value.length; i++) {
        for (let j = 0; j < groupAssess.value.length; j++) {
          if (Qus_desserts.value[i].id == groupAssess.value[j].a_id) {
            Qus_desserts.value[i].answerStatus = true;
            break;
          }
        }
      }
      console.log("ss", Qus_desserts.value);
    };

    // 生命周期钩子
    onMounted(() => {
      store.dispatch('getAllAssessment');
      Getreport();
      get_group_menmark();
      get_leadermark();
      store.dispatch("getDDL");
    });

    onBeforeUpdate(async () => {
      await store.dispatch("getGroupAssess", sessionStorage.getItem("group_id"));
      getAssessStatus();
      console.log('ass', Qus_desserts.value);
      isPassTime();
    });

    // 返回响应式状态和方法
    return {
      isTimeout,
      dialogKey,
      FileSize,
      text,
      IsSending,
      isLeader,
      list,
      isBlock,
      dialog,
      report_text,
      show_report,
      unshow_report,
      reportsrc,
      group_id,
      class_name,
      input_time,
      input_content,
      Qus_headers,
      qusdialog,
      current_ans,
      current_ques,
      que_id,
      rule,
      Qus_desserts,
      groupAssess,
      ddl,
      change_size,
      get_group_menmark,
      send_point,
      get_leadermark,
      send_rtext,
      cancelUpload,
      Getreport,
      edit_quesItem,
      startInput,
      qusinput,
      isPassTime,
      getAssessStatus
    };
  }
};
</script>
<style>
#passwordpage {
  position: relative;
  left: 20%;
}
.sending {
  transform: translate(-50%, -50%);
}
.highlight {
  color: red;
}
.normal {
  color: rgb(94, 144, 18);
}
.disable-events {
  pointer-events: none
}
</style>

