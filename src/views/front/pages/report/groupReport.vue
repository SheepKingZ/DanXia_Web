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
import { mapGetters, mapState } from "vuex";
import debounce from "lodash/debounce"
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
export default {
  name: "groupReport",
  data() {
    return {
      isTimeout: false,
      dialogKey: 0,
      FileSize: 0,
      text: "提交",
      IsSending: false,
      /* 将从sesstionstorage中传来的is_leader字符串改为boolean */
      isLeader: Boolean(sessionStorage.is_leader === "true"),
      list: [],

      isBlock: false,
      dialog: false,
      report_text: "",
      show_report: true,
      unshow_report: false,
      reportsrc: "", //实习报告链接
      group_id: "",
      class_name: "",
      input_time: "", //提交时间
      input_content:
        "这次地理综合实习是一个全新的体验。以往我们上地理课都是仅限于书本，视频还有图片。在这次综合实习我们到了实地进行考察，全方面的观察了各种地理现象，通过老师的讲解以及现场观察，我们对知识的了解比以往更加深刻。通过这种教学形式，我们不仅能够加深专业知识的理解，还能结合实地内容举一反三。这次的综合实习收获颇多，希望能够多多开展类似学科活动。",
      Qus_headers: [
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
          width:'200px'
        },
        {
          text: "作答状态",
          value: "answerStatus",
          width:'100px'
        },
      ],
      
      qusdialog: false,
      current_ans: "", //绑定问题答案
      current_ques: "", //绑定点击问题
      que_id: "",
      rule: {
        max: (v) => v <= 100 || "只能小于100",
        min: (v) => 0 <= v || "不能小于0",
        len: (v) => v.length > 0 || "不能为空",
      },
      cancelToken: null,
    };
  },
  methods: {
    change_size() {
      if (this.report_text == "" || this.report_text == null) this.FileSize = 0;
      else this.FileSize = (this.report_text.size / (1024 * 1024)).toFixed(3);
    },
    get_group_menmark() {
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
        this.list = arry;
      });
    },
    /*  */
    send_point() {
      let mem_info = [];
      for (let i of this.list) {
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
          this.get_leadermark();
        })
        .catch((err) => {
          console.log(err);
          alert(err);
        });
    },
    get_leadermark() {
      axios({
        method: "get",
        url: "https://danxiagis.top:8081/teacher/getPerformance",
      }).then((response) => {
        let res = response.data;
        for (let i = 0; i < this.list.length; i++) {
          for (let j = 0; j < res.length; j++) {
            if (this.list[i].id == res[j].stu_id) {
              this.list[i].leader_mark = res[j].leaderScoring;
              
            }
          }
        }
      });
    },
    //上传报告
    send_rtext() {
      this.dialogKey++;
      if (this.report_text == "") {
        alert("请选择上传文件");
        this.dialog = false;
        return;
      }
      if (this.FileSize > 100) {
        alert("文件大于100MB，上传失败");
        return;
      }
      this.cancelToken = axios.CancelToken.source();
      this.IsSending = true;
      this.dialogKey++;
      console.log("dia", this.dialogKey);
      /* this.report_text.size */
      this.class_name = sessionStorage.class_name.substring(0, 2);
      this.group_id = sessionStorage.group_id;
      let param = new FormData();
      param.append("class_name", this.class_name);
      param.append("group_id", this.group_id);
      param.append("file", this.report_text);
      
      axios({
        method: "post",
        url: "https://danxiagis.top:8081/assessment/sumbitReport",
        data: param,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        cancelToken: this.cancelToken.token,
      })
        .then((res) => {
          this.dialogKey++;
          this.IsSending = false;
          setTimeout(function () {
            alert(res.data);
          }, 500);

          this.Getreport();
        })
        .catch((err) => {
          this.IsSending = false;
          if (axios.isCancel(err)) alert(err.message);
          else alert("上传出错", err);
        });

      // console.log(param)
    },
    cancelUpload() {
      this.dialogKey++;
      this.IsSending = false;
      if (this.cancelToken) {
        /* error.message为''中的 */
        this.cancelToken.cancel("上传被用户取消。");
      }
    },
    Getreport() {
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
            this.reportsrc = res[a].report_url + "?rand=" + Math.random();
            this.input_time = res[a].dateChange;
          }
        }
        if (this.reportsrc == "") {
          this.unshow_report = true;
          this.show_report = false;
        } else {
          this.show_report = true;
          this.unshow_report = false;
          this.text = "再次提交";
        }
        //console.log(this.reportsrc);
      });
    },
    //输入答案弹窗的索引
    edit_quesItem(e) {
      this.current_ques = e.question;
      this.que_id = e.id;
      // 创建一个新的 Date 对象，它表示当前的日期和时间
      let now = new Date().getTime();
      let limit = e.limit;
      limit = e.limit.replace(" ", "T");
      let str = Date.parse(limit);
      console.log('e',e.answerStatus);
      /* 如果这一条的状态是未回答且超时，则不允许查看 */
      
      if (now > str&&e.answerStatus==undefined) {
      
        alert("已超时，无法作答");
        return;
      }
        
      
      
      this.qusdialog = true;

      let res = this.groupAssess;
      if (!res) this.current_ans = "";

      for (let i = 0; i < this.Qus_desserts.length; i++) {
        if (res[i].a_id == this.que_id) {
          this.current_ans = res[i].answer;
          break;
        } else this.current_ans = "";
      }
    },
    startInput(){
      NProgress.start()
      this.qusinput()
    },
    //考核问题提交
    qusinput:debounce(function(){
      let id = sessionStorage.group_id;
      if (this.current_ans.trim().length === 0) {
        alert("还未输入答案");
        return;
      }
      let params={
          group_id: id,
          answer: this.current_ans,
          assess_id: this.que_id,
        }
        
      axios({
        method: "post",
        url: "https://danxiagis.top:8081/assessment/sumbitAssessment",
        data:params
      }).then((response) => {
        console.log(response);
        NProgress.done()
        alert("提交成功");
        this.$store.dispatch("getGroupAssess", sessionStorage.getItem("group_id"));
        this.qusdialog = false;
      });
    },3000),
    
    //********获取问题要写一个接口
    /* get_que() {
      for (let i = 0; i < this.response.length; i++) {
        this.Qus_desserts.push({
          question: this.response[i].title,
          id: this.response[i]._id,
          limit: this.response[i].end_time.split(".")[0].replace("T", " "),
        });
      }
    }, */
    isPassTime() {
      console.log('ddl',this.ddl);
      let limit = this.ddl;
      let now = new Date().getTime();
      
      limit = this.ddl.replace(" ", "T");
      let str = Date.parse(limit);
      if (now > str) this.isTimeout = true;
    },
    getAssessStatus() {/* this.Qus_desserts有时候是[]，顺序有问题了 */
      console.log('asssessssss',this.groupAssess,this.Qus_desserts);
      for(let i=0;i<this.Qus_desserts.length;i++)
      {
        for(let j=0;j<this.groupAssess.length;j++)
        {
          if(this.Qus_desserts[i].id==this.groupAssess[j].a_id)
          {
            this.Qus_desserts[i].answerStatus = true;
            break;
          }
        }
      }
      console.log("ss", this.Qus_desserts);
    },
  },
  computed: {
    /* ...mapState({ response: (state) => state.assessment }), */
    ...mapGetters(['Qus_desserts']),
    ...mapState({ groupAssess: (state) => state.groupAssess }),
    ...mapState({ ddl: (state) => state.ddl }),
  },
  created() {
    this.$store.dispatch('getAllAssessment')
    this.Getreport();
    this.get_group_menmark();
    this.get_leadermark();
    this.$store.dispatch("getDDL");
  },
   mounted() {
    /* this.get_que(); */
    
    
    
  },
  async beforeUpdate(){
    await this.$store.dispatch("getGroupAssess", sessionStorage.getItem("group_id"));
    this.getAssessStatus()
    console.log('ass',this.Qus_desserts);
    this.isPassTime();
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

