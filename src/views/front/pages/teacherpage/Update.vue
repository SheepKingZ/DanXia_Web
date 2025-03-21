<template  >
  <v-app class="green lighten-5">
    <v-container fluid>
      <v-row>
        <!-- 左边的导航栏 -->
        <v-card class="pull-left ml-5 mt-5" height="500px" min-width="11%">
          <v-list>
            <v-list-item-group v-model="model">
              <v-list-item link @click="num = '0'">
                <v-list-item-icon>
                  <v-icon>mdi-file-plus</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>资料上传</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item link @click="num = '1'">
                <v-list-item-icon>
                  <v-icon>mdi-window-close</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>资料管理</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item link @click="num = '2'">
                <v-list-item-icon>
                  <v-icon>mdi-file-arrow-up-down</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>发布考核问题</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <!-- <v-list-item link @click="num = '5'">
                <v-list-item-icon>
                  <v-icon>mdi-file-clock</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>设置实习报告截止时间</v-list-item-title>
                </v-list-item-content>
              </v-list-item> -->
              <v-list-item link @click="num = '3'">
                <v-list-item-icon>
                  <v-icon>mdi-file-cabinet</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>考核题库</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item link @click="num = '4'">
                <v-list-item-icon>
                  <v-icon>mdi-bell-badge-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>历史通知</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>

        <div id="r">
          <v-card class="mx-auto" min-height="100%" min-width="100%">
            <div class="px-7">
              <!-- 资料上传 -->
              <div v-show="num == 0">
                <v-dialog
                  v-model="IsSending"
                  persistent
                  max-width="200"
                  class="sending"
                  :key="dialogKey"
                  ><!-- 加:key强制刷新，使得滚动条重新渲染（真实dom和虚拟dom的复用） -->
                  <v-card color="ivory">
                    <v-card-title>
                      <marquee scrollamount="10">正在上传中...</marquee>
                    </v-card-title>
                    <v-btn color="green darken-1" text @click="cancelUpload"
                      >取消
                    </v-btn>
                  </v-card>
                </v-dialog>
                <br /><br />
                <v-card flat class="ml-10">
                  <v-row>
                    <v-subheader>资料类型选择</v-subheader>
                    <v-col cols="2 ">
                      <div style="width: 250px">
                        <v-select
                          v-model="type"
                          outlined
                          dense
                          :items="update_items"
                          class="mt-n3"
                        ></v-select>
                      </div>
                    </v-col>
                    <v-col cols="5"></v-col>
                  </v-row>
                  <v-row>
                    <v-subheader
                      >章&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;节&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</v-subheader
                    >
                    <v-col cols="4" class="mt-n2">
                      <v-text-field
                        auto
                        v-model="chapter"
                        label="非必填"
                        single-line
                        outlined
                        dense
                      ></v-text-field>
                    </v-col>
                    <v-col cols="3"></v-col>
                  </v-row>
                  <v-row>
                    <v-subheader
                      >资&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;料&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</v-subheader
                    >
                    <v-col cols="4" class="mt-n2">
                      <v-text-field
                        auto
                        v-model="name"
                        label="请输入"
                        single-line
                        outlined
                        dense
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-subheader
                      >选&nbsp;&nbsp;&nbsp;择&nbsp;&nbsp;&nbsp;文&nbsp;&nbsp;&nbsp;件</v-subheader
                    >
                    <v-col cols="3">
                      <v-btn depressed color="green lighten-2" min-width="150px"
                        ><!-- @click="getFileName" -->
                        <v-file-input
                          color="white"
                          accept=".pdf,.docx,doc,.pptx,.ppt,.mp4"
                          v-model="inputfile"
                          @change="getFileName"
                        ></v-file-input>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row class="mt-5">
                    <v-col cols="4">
                      <v-btn
                        depressed
                        color="green "
                        width="150px"
                        outlined
                        @click="checkfile"
                        >确认上传</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-card>
              </div>

              <!-- 资料管理 -->
              <div v-show="num == 1">
                <br />
                <v-card flat class="mx-8">
                  <!--  <v-card-title>资料展示</v-card-title>
                  <v-row class="px-5">
                    
                      <v-checkbox
                        class="px-3"
                        v-model="natural_checkbox"
                        label="自然地理"
                        @click="subj_filter"
                      ></v-checkbox>
                      <v-checkbox
                      class="px-3"
                        v-model="human_checkbox"
                        label="人文与经济地理"
                        @click="subj_filter"
                      ></v-checkbox>
                      <v-checkbox
                      class="px-3"
                        v-model="ca_checkbox"
                        label="地图学"
                        @click="subj_filter"
                      ></v-checkbox>
                      <v-checkbox
                        class="px-3"
                        v-model="gis_checkbox"
                        label="地理信息系统原理"
                        @click="subj_filter"
                      ></v-checkbox>
                  </v-row>  -->
                  <!-- <template>
                    <div>
                      <select v-model="selectedCategory">
                        <option
                          v-for="category in categories"
                          :value="category.id"
                          :key="category.id"
                        >
                          {{ category.name }}
                        </option>
                      </select>
                      <ul>
                        <li v-for="item in filteredItems" :key="item.id">
                          {{ item.name }}
                        </li>
                      </ul>
                    </div>
                  </template> -->
                  <v-card-title>资料表单</v-card-title>
                  <v-row>
                    <v-spacer></v-spacer> <v-spacer></v-spacer>
                    <v-spacer></v-spacer>

                    <v-text-field
                      v-model="search"
                      append-icon="mdi-magnify"
                      label="检索"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-row>
                  <br />
                  <v-data-table
                    :headers="list"
                    :items="detail"
                    :items-per-page="15"
                    sort-by="time"
                    sort-desc
                    :search="search"
                  >
                    <template v-slot:item.name="{ item }">
                      <!-- 这里使用a标签包裹item.name，通过动态绑定href来指定链接地址 -->
                      <a :href="item.pdf" target="_blank" id="superlink">
                        {{ item.name }}
                      </a>
                    </template>
                    <template v-slot:item.action="{ item }">
                      <v-icon small @click="deleteItem(item)" title="删除资料">
                        mdi-delete
                      </v-icon>
                    </template>
                  </v-data-table>
                  <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                      <v-card-title class="text-h5">
                        是否确认删除该文件</v-card-title
                      >
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="closeDelete"
                          >取消</v-btn
                        >
                        <v-btn
                          color="green darken-1"
                          text
                          @click="deleteItemConfirm"
                          >确定</v-btn
                        >
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-card>
              </div>

              <!-- 发布考核问题 -->
              <div v-show="num == 2">
                <br />
                <div>
                  <v-card-title>考核问题发布</v-card-title>
                  <v-row class="mx-8">
                    <v-col cols="10">
                      <v-textarea
                        outlined
                        name="input-7-4"
                        v-model="ques_text"
                      ></v-textarea>
                      <v-container
                        ><div>
                          <label>开始日期时间：</label>
                          <input type="datetime-local" v-model="startDate" />
                        </div>
                        <br />
                        <div>
                          <label>结束日期时间：</label>
                          <input
                            type="datetime-local"
                            v-model="endDate"
                          /></div></v-container
                    ></v-col>
                    <v-btn class="mx-8 my-5" outlined @click="QusSent()"
                      >确认发布</v-btn
                    >
                  </v-row>
                </div>
                <v-divider class="pt-10"></v-divider>
                <v-list
                  v-for="(item, index) in QuesList"
                  :key="index"
                  class="px-10"
                >
                  <v-list-item>
                    <v-row>
                      <v-col cols="10">
                        <v-list-item-content>
                          <v-list-item-title
                            ><b
                              ><p
                                style="
                                  white-space: normal;
                                  word-wrap: break-word;
                                "
                              >
                                {{ item.title }}
                              </p></b
                            ></v-list-item-title
                          >
                          <span> 发布时间：{{ item.start.split('.')[0].replace('T'," ") }} </span>
                          <v-btn
                            class="ma-16"
                            outlined
                            color="green lighten-1"
                            absolute
                            right
                            @click="qus_edit(item)"
                            title="编辑问题"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>

                          <v-dialog
                            v-model="showEditDialog"
                            max-width="500"
                            :retain-focus="false"
                          >
                            <v-card>
                              <v-card-title class="headline"
                                >编辑问题</v-card-title
                              >
                              <v-card-text
                                ><!--  -->
                                <div style="border: solid">
                                  <textarea
                                    style="
                                      width: 100%;
                                      height: 100%;
                                      font-size: 20px;
                                    "
                                    v-model="edited_qus.title"
                                  ></textarea>
                                </div>
                                <div>
                                  <label>开始日期时间：</label>
                                  <input
                                    type="datetime-local"
                                    v-model="edited_qus.start"
                                  />
                                  <br />
                                  <label>结束日期时间：</label>
                                  <input
                                    type="datetime-local"
                                    v-model="edited_qus.end"
                                  />
                                </div>
                              </v-card-text>
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                  color="green darken-1"
                                  text
                                  @click="closeChanges"
                                  >关闭</v-btn
                                >
                                <v-btn
                                  color="green darken-1"
                                  text
                                  @click="saveChanges"
                                  >保存</v-btn
                                >
                              </v-card-actions>
                            </v-card>
                          </v-dialog>

                          <v-btn
                            class="ma-0 text-end"
                            outlined
                            color="green lighten-1"
                            absolute
                            right
                            @click="qus_to_delete(item)"
                            title="删除问题"
                          >
                            <v-icon>mdi-trash-can</v-icon>
                          </v-btn>
                        </v-list-item-content>
                      </v-col>
                    </v-row>
                  </v-list-item>
                  <v-divider class="mt-3"></v-divider>
                </v-list>
                <v-dialog
                  v-model="showDeleteDialog"
                  max-width="500"
                  :retain-focus="false"
                >
                  <v-card>
                    <v-card-title class="headline"
                      >是否确认删除问题</v-card-title
                    >
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="green darken-1"
                        text
                        @click="showDeleteDialog = false"
                        >取消</v-btn
                      >
                      <v-btn color="green darken-1" text @click="qus_delete()"
                        >确认</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
              <!-- 往年题库 -->
            </div>
            <div v-show="num == 3">
              <br />
              <div></div>
              <v-divider class="pt-10"></v-divider>
              <v-list
                v-for="(item, index) in past_QuesList"
                :key="index"
                class="px-10"
              >
                <v-list-item>
                  <v-row>
                    <v-col cols="10">
                      <v-list-item-content>
                        <v-list-item-title>
                          <b
                            ><p
                              style="white-space: normal; word-wrap: break-word"
                            >
                              {{ item.title }}
                            </p></b
                          >
                          <v-spacer></v-spacer>
                          近期使用时间：{{ item.used_date }}
                          <v-spacer></v-spacer>
                          使用次数：{{ item.used_time }}
                          <v-spacer></v-spacer>
                          使用年份：{{ item.used_years }}
                        </v-list-item-title>

                        <v-btn
                          class="ma-16"
                          outlined
                          color="green lighten-1"
                          absolute
                          right
                          @click="qus_edit1(item)"
                          title="编辑问题"
                        >
                          <v-icon>mdi-pencil-outline</v-icon>
                        </v-btn>

                        <v-btn
                          class="ma-0 text-end"
                          outlined
                          color="green lighten-1"
                          absolute
                          right
                          @click="qus_to_delete1(item)"
                          title="删除问题"
                        >
                          <v-icon>mdi-trash-can-outline</v-icon>
                        </v-btn>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-divider class="mt-3"></v-divider>
              </v-list>
              <v-dialog
                v-model="showEditDialog1"
                max-width="500"
                :retain-focus="false"
              >
                <v-card>
                  <v-card-title class="headline">编辑问题</v-card-title>
                  <v-card-text>
                    <div style="border: solid">
                      <textarea
                        style="width: 100%; height: 100%; font-size: 20px"
                        v-model="edited_qus1.title"
                      ></textarea>
                    </div>
                    
                    <label>开始日期时间：</label>
                    <input type="datetime-local" v-model="edited_qus1.start" />
                    <br />
                    <label>结束日期时间：</label>
                    <input type="datetime-local" v-model="edited_qus1.end" />
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="closeChanges1"
                      >关闭</v-btn
                    >
                    <v-btn color="green darken-1" text @click="saveChanges1"
                      >重新发布</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-dialog
                v-model="showDeleteDialog1"
                max-width="500"
                :retain-focus="false"
              >
                <v-card>
                  <v-card-title class="headline">是否确认删除问题</v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                      color="green darken-1"
                      text
                      @click="past_qus_delete()"
                      >确认</v-btn
                    >
                    <v-btn
                      color="green darken-1"
                      text
                      @click="showDeleteDialog1 = false"
                      >取消</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
            <!-- 历史通知 -->
            <div v-show="num == 4">
              <br />
              <div>
                <v-dialog
                  max-width="400"
                  :retain-focus="false"
                  v-model="dele_notice_dia"
                  style="max-width: 100px"
                >
                  <v-card>
                    <v-card-title class="headline">是否确认删除</v-card-title>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="green darken-1"
                        text
                        @click="notice_delete(item)"
                        >确认</v-btn
                      >
                      <v-btn
                        color="green darken-1"
                        text
                        @click="dele_notice_dia = false"
                        >取消</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
              <v-divider class="pt-10"></v-divider>
              <v-list
                v-for="(item, index) in NoticeList"
                :key="index"
                class="px-10"
                ><!-- 需要一个新的接口获取问题 -->
                <v-list-item>
                  <v-row>
                    <v-col cols="10">
                      <v-list-item-content>
                        <v-list-item-title>
                          <b
                            ><p
                              style="white-space: normal; word-wrap: break-word"
                            >
                              {{ item.title }}
                            </p></b
                          >
                          <v-spacer></v-spacer>
                          近期使用时间：{{ item.used_date }}
                          <v-spacer></v-spacer>
                          使用次数：{{ item.used_time }}
                          <v-spacer></v-spacer>
                          使用年份：{{ item.used_years }}
                        </v-list-item-title>
                        <v-btn
                          class="ma-0 text-end"
                          outlined
                          color="green lighten-1"
                          absolute
                          right
                          @click="dele_notice_dia = true"
                          title="删除通知"
                        >
                          <v-icon>mdi-trash-can-outline</v-icon>
                        </v-btn>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-divider class="mt-3"></v-divider>
              </v-list>
            </div>
            <div v-show="num == 5">
              <v-chip class="ml-3">
                <div>
                  <label>报告提交截止时间：</label>
                  <input type="datetime-local" v-model="rpEndDate" />
                </div>
              </v-chip>
              <v-btn
                class="ma-5"
                dark
                color="rgb(102,187,106) "
                outlined
                @click="checkrpEndDate"
                >确定</v-btn
              >
            </div>
          </v-card>
        </div>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { reqGetDDL } from "../../../../api";
import axios from "axios";
export default {
  name: "Update",

  data() {
    return {
      rpEndDat: null,
      dialogKey: 0,
      cancelToken: null,
      IsSending: false,
      dele_notice_dia: false,
      item_time: "",
      modifycontent: "",
      showEditDialog: false,
      showEditDialog1: false,
      model: "0",
      selectedValue: [],
      items: [
        { name: "All", value: "" },
        { name: "自然地理", value: [] },
        { name: "人文与经济地理", value: [] },
        { name: "地理信息系统原理", value: [] },
      ],
      dialoggg: false,
      startDate: "",
      endDate: "",
      text: "查看",
      look: false,
      search: "",
      dialog: false,
      dialogDelete: false,
      childItems: [],
      num: 0,
      update_items: [
        "自然地理",
        "人文与经济地理",
        "实习资料",
        "地理信息系统原理",
        "地图学",
        "其他资料",
      ],

      type: "", //类型
      chapter: "", //章节名
      name: "", //文件名
      infodata: "",
      inputfile: "", //文件

      editedIndex: -1,
      editedItem: {
        id: "",
        name: "",
        type: "",
        subject: "",
        chapter: "",
        enable: "",
      },
      defaultItem: {
        id: "",
        name: "",
        type: "",
        subject: "",
        chapter: "",
        enable: "",
      },
      list: [
        { text: "名称", align: "start", value: "name" },
        {
          text: "类型",
          align: "start",
          value: "type",
        },
        {
          text: "科目",
          align: "start",
          value: "subject",
        },
        {
          text: "章节",
          align: "start",
          value: "chapter",
        },
        {
          text: "发布时间",
          align: "start",
          value: "time",
        },
        {
          text: "",
          value: "action",
          sortable: false,
        },
      ],
      detail: [], //存放资料列表
      ques_text: "",
      QuesList: [],
      past_QuesList: [],
      NoticeList: [],
      all: [],
      natural_checkbox: false,
      human_checkbox: false,
      ca_checkbox: false,
      gis_checkbox: false,
      edited_qus: {},
      edited_qus1: {},
      del_qus1: {},
      del_qus: {},
      showDeleteDialog1: false,
      showDeleteDialog: false,
    };
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  computed: {},
  components: {},
  created() {
    this.loadClassList(),
      this.load_que(),
      this.load_past_que(),
      this.load_notice();
  },
  methods: {
    checkrpEndDate() {
      if (this.rpEndDate == null || this.rpEndDate == "") {
        alert("还未选择时间");
        return;
      }
      axios({
        url: "https://danxiagis.top:8081/teacher/setFileDDL",
        method: "post",
        params: {
          FileDDL: this.rpEndDate.replace("T", " ") + ":00.000",
        },
      }).then(async (resp) => {
        alert(resp.data);
      });
    },
    cancelUpload() {
      this.IsSending = false;
      if (this.cancelToken) {
        /* error.message为''中的 */
        this.cancelToken.cancel("上传被用户取消。");
      }
      this.dialogKey++;
    },
    /* subj_filter() {
      //******************写了一点**************************
      if (this.natural_checkbox) {
        for (let i = 0; i < this.detail.length; i++) {
          console.log(this.detail[i].subject);
          if (this.detail[i].subject == "自然地理")
            this.detail = this.detail.filter(
              (item) => (item.subject = "自然地理")
            );
        }
      }
    }, */
    qus_edit(e) {
      this.showEditDialog = true;
      this.edited_qus = {
        id: e.id,
        title: e.title,
        start: e.start,
        end: e.end,
      };
      console.log("tttttttttttttt", e);
    },
    qus_edit1(item) {
      this.showEditDialog1 = true;
      this.edited_qus1 = {
        id: item.id,

        title: item.title,
        start: item.start,
        end: item.end,
        item_time: item.used_time,
      };
    },
    qus_to_delete1(e) {
      this.showDeleteDialog1 = true;
      this.del_qus1 = {
        id: e.id,
        title: e.title,
      };
    },
    qus_to_delete(e) {
      this.showDeleteDialog = true;
      this.del_qus = {
        id: e.id,
        title: e.title,
      };
    },
    closeChanges() {
      console.log("@@@@", this.edited_qus);
      this.showEditDialog = false;
    },
    closeChanges1() {
      this.showEditDialog1 = false;
    },
    saveChanges() {
      let uuid = this.edited_qus.id;
      //展示处修改
      for (let a = 0; a < this.QuesList.length; a++) {
        if (uuid == this.QuesList[a].id) {
          this.QuesList[a] = {
            title: this.edited_qus.title,
            id: uuid,
            start: this.edited_qus.start.split("+")[0],
            end: this.edited_qus.end.split("+")[0],
          };
          break;
        }
      }

      let st = this.edited_qus.start.replace("T", " ")
      let et = this.edited_qus.end.replace("T", " ")
      console.log('split',et.split(":")[2]);
      if(st.split(":")[2]!='00')
        st+=':00.000'
        if(et.split(":")[2]!='00')
        et+=':00.000'
      axios({
        method: "post",
        url: "https://danxiagis.top:8081/assessment/teacher/changeAssessment",
        params: {
          teacher: sessionStorage.getItem("teacheruuid"),
          assess_id: uuid,
          title: this.edited_qus.title,
          content: this.edited_qus.title,
          start_date: st,
          end_time: et,
        },
      })
        .then((response) => {
          console.log(response);
          // 保存后关闭弹窗

          this.showEditDialog = false;
          alert("修改成功");
        })
        .catch((err) => {
          alert(err);
        });
    },
    saveChanges1() {
      let uuid = this.edited_qus1.id;
      //展示处修改
      for (let a = 0; a < this.past_QuesList.length; a++) {
        if (uuid == this.past_QuesList[a].id) {
          this.past_QuesList[a] = {
            title: this.edited_qus1.title,
            id: uuid,
            start: this.edited_qus1.start.split("+")[0],
            end: this.edited_qus1.end.split("+")[0],
          };
          break;
        }
      }
      axios({
        method: "post",
        url: "https://danxiagis.top:8081/assessment/upAssessment",
        params: {
          content: this.edited_qus1.title,
          start_date: this.edited_qus1.start.replace("T", " ") + ":00.000",
          end_time: this.edited_qus1.end.replace("T", " ") + ":00.000",
          teacher: sessionStorage.getItem("teacheruuid"),
          title: this.edited_qus1.title,
        },
      })
        .then((response) => {
          console.log(response);
          // 保存后关闭弹窗
          this.load_past_que();
          this.load_que();
          this.showEditDialog1 = false;
          alert("发布成功");
        })
        .catch((err) => {
          alert(err);
        });
    },
    load_que() {
      axios({
        method: "get",
        url: "https://danxiagis.top:8081/assessment/getAllAssessment",
      })
        .then((response) => {
          let res = response.data;
          this.QuesList = [];
          for (let i = 0; i < res.length; i++) {
            this.QuesList.push({
              title: res[i].title,
              id: res[i]._id,
              start: res[i].start_date.split("+")[0],
              end: res[i].end_time.split("+")[0],
            });
          }
        })
        .catch((err) => {
          alert(err);
        });
    },
    load_past_que() {
      axios({
        method: "get",
        url: "https://danxiagis.top:8081/passyearquestion/all/get", //passyearquestion/all/get
      })
        .then((response) => {
          /* used_date:res[i].used_date.split(".")[0].replace("T", " ")||"" */

          let res = response.data;
          console.log("date", res);
          this.past_QuesList = [];
          for (let i = 0; i < res.length; i++) {
            //找到数字
            let str_year = res[i].used_years.match(/\d+/g);
            //set去重，map将字符串变number
            let year = [...new Set(str_year.map(Number))];
            if (res[i].used_date != null)
              res[i].used_date = res[i].used_date
                .split(".")[0]
                .replace("T", " ");
            this.past_QuesList.push({
              title: res[i].content,
              id: res[i]._id,
              used_time: res[i].used_time,
              used_years: year,
              used_date: res[i].used_date,
            });
          }
        })
        .catch((err) => {
          alert(err);
        });
    },
    load_notice() {
      axios({
        method: "get",
        url: "https://danxiagis.top:8081/passyearnotice/all/get", //passyearquestion/all/get
      })
        .then((response) => {
          let res = response.data;
          for (let i = 0; i < res.length; i++) {
            //找到数字
            let str_year = res[i].used_years.match(/\d+/g);
            //set去重，map将字符串变number
            let year = [...new Set(str_year.map(Number))];
            if (res[i].used_date != null)
              res[i].used_date = res[i].used_date
                .split(".")[0]
                .replace("T", " ");
            this.NoticeList.push({
              title: res[i].content,
              id: res[i]._id,
              used_time: res[i].used_time,
              used_years: year,
              used_date: res[i].used_date,
            });
          }
        })
        .catch((err) => {
          alert(err);
        });
    },
    get_et() {
      if (this.startDate > this.endDate && this.startDate && this.endDate) {
        alert("开始时间不能比结束时间晚");
        return;
      }
    },
    deleteItem(item) {
      //获取点击处的索引
      this.editedIndex = this.detail.indexOf(item);
      //拷贝过来
      this.editedItem = Object.assign({}, item);
      //弹删除窗
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      //http://localhost:8088/uploadData/deleteProfile
      //删除掉被删除的那个item

      //onsole.log(this.detail[this.editedIndex]);
      let edited = this.detail[this.editedIndex];
      //console.log('pdfffffffffff',typeof(edited.pdf));
      axios({
        method: "post",
        url: "https://danxiagis.top:8081/uploadData/deleteProfile",
        params: {
          subject: edited.subject,
          topic: edited.name,
          chapter: edited.subject + "—" + edited.chapter,
          filename: edited.pdf.split("/").pop(),
          //
        },
      }).then((resp) => {
        this.updateMaterial();
        console.log(resp);
        alert("删除成功");
        this.detail.splice(this.editedIndex, 1);
        this.closeDelete();
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    alt() {
      this.look = true;
    },
    loadClassList() {
      axios({
        method: "get",
        url: "https://danxiagis.top:8081/uploadData/get",
      }).then((resp) => {
        // console.log(response.data);
        const res = resp.data;
        console.log("ressss", res);
        //console.log('allllll',this.all);
        //获取所有的资料的名称、章节、类型、科目、enable？？
        for (let i = 0; i < res.length; i++) {
          const resInfo = res[i].info;
          //判断类型
          for (let j = 0; j < resInfo.length; j++) {
            let ty = "";
            if (
              resInfo[j].pdf.includes(".docx") &&
              resInfo[j].pdf.includes(".doc")
            ) {
              ty = "Word";
            } else if (
              resInfo[j].pdf.includes(".ppt") &&
              resInfo[j].pdf.includes(".pptx")
            ) {
              ty = "PPT";
            } else if (resInfo[j].pdf.includes(".mp4")) {
              ty = "MP4";
            } else if (resInfo[j].pdf != "") {
              ty = "PDF";
            } else if (resInfo[j].video != "") {
              ty = "视频";
            }
            //存
            let send_time = resInfo[j].uploadTime
              .split(".")[0]
              .replace("T", " ");
            const childItem = {
              name: resInfo[j].topic,
              type: ty,
              chapter: resInfo[j].chapter,
              enable: resInfo[j].enable,
              subject: resInfo[j].subject,
              pdf: resInfo[j].pdf,
              time: send_time,
            };
            /* if (resInfo[j].subject == "自然地理")
              this.items[1].value.push(childItem);
            else if (resInfo[j].subject == "人文与经济地理")
              this.items[2].value.push(childItem); */

            this.childItems.push(childItem);
          }
          // 去除前缀 例：地图学—第一章，前面三个字和斜杠删掉
          for (let i = 0; i < this.childItems.length; i++) {
            let del_t = this.childItems[i].subject + "—";
            let it_title = this.childItems[i].chapter.replace(del_t, "");
            this.childItems[i].chapter = it_title;
          }
        }
        this.detail = this.childItems;
      });
    },
    checkinfo() {
      if (this.type == "" || this.name == "" || this.chapter == "") {
        alert("请检查是否有遗漏");
        return;
      } else if (this.type && this.name && this.chapter) {
        alert("可以上传");
      }
      /*this.infodata =''
      this.infodata = {
        subject:this.type,
        topic:this.name,
        chapter:this.chapter,
      }
       axios({
        method:'post',
        url: "",
        data:this.infodata,
      }).then((response) => {
      console.log(response)
      },(error)=>{
        console.log(this.infodata)
        console.log(error)
      }) */
    },
    getFileName(e) {
      if (e != null) {
        let t = e.name.indexOf(".");
        this.name = e.name.substring(0, t);
      } else this.name = "";
    },
    checkfile() {
      if (this.type == "实习资料" && this.chapter == "") {
        this.chapter = "实习资料";
      }
      if (
        this.inputfile == "" ||
        this.name == "" ||
        this.chapter == "" ||
        this.type == ""
      ) {
        alert("信息不完整，请再次检查");
      } else {
        //console.log('eeeeeeeeee',this.type);
        this.cancelToken = axios.CancelToken.source();
        this.IsSending = true;
        let data = new FormData();
        data.append("subject", this.type);
        data.append("topic", this.name);
        data.append("chapter", this.type + "—" + this.chapter);
        data.append("file", this.inputfile);
        axios({
          method: "post",
          url: "https://danxiagis.top:8081/uploadData/postProfile",
          data: data,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          cancelToken: this.cancelToken.token,
        })
          .then((response) => {
            this.updateMaterial();
            this.childItems = [];
            /* 在JavaScript中，异步操作（如网络请求、定时器等）
            不会阻塞代码的进一步执行。这意味着，虽然updateMaterial先开始执行，
            但其内的异步请求需要时间来获得响应，而在这个等待时间内，
            JavaScript不会停下来等待，而是继续执行下一个函数loadClassList */
            this.loadClassList();
            this.IsSending = false;
            setTimeout(function () {
              alert(response.data);
            }, 500);
            this.dialogKey++;
          })
          .catch((err) => {
            this.IsSending = false;

            if (axios.isCancel(err)) alert(err.message);
            else alert("上传出错", err);
          });
      }
    },
    updateMaterial() {
      axios({
        method: "get",
        url: "https://danxiagis.top:8081/uploadData/get",
      }).then((response) => {
        let res = response.data;
        localStorage.setItem("meterial", JSON.stringify(res));
        console.log("update", JSON.parse(localStorage.getItem("meterial")));
      });
    },
    // 发布考核问题
    QusSent() {
      if (this.ques_text == "") {
        alert("请输入问题");
        return;
      }
      if (this.startDate == "") {
        alert("请选择开始时间");
        return;
      }
      if (this.endDate == "") {
        alert("请选择结束时间");
        return;
      }
      axios({
        method: "post",
        url: "https://danxiagis.top:8081/assessment/upAssessment", //https://danxiagis.top:8081/assessment/upAssessment
        params: {
          content: this.ques_text,
          //title:
          start_date: this.startDate.replace("T", " ") + ":00.000",
          end_time: this.endDate.replace("T", " ") + ":00.000",
          teacher: sessionStorage.getItem("teacheruuid"),
          title: this.ques_text,
        },
      })
        .then((response) => {
          if (response.status >= 200 && response.status < 300) {
            
            this.QuesList.push({
              title: this.ques_text,
              id: response.data._id,
              start: this.startDate,
              end: this.endDate,
            });
            console.log('queList',this.QuesList);
            alert("发布成功");

            this.load_que();
            this.load_past_que();
          }
        })
        .catch((error) => {
          alert(error);
        });
    },

    //
    qus_delete() {
      let uuid = this.del_qus.id;

      axios({
        method: "post",
        url: "https://danxiagis.top:8081/assessment/deleteAssessment",
        params: {
          _id: uuid,
        },
      })
        .then((response) => {
          console.log(response);
          for (let a = 0; a < this.QuesList.length; a++) {
            if (uuid == this.QuesList[a].id) {
              this.QuesList.splice(a, 1);
              break;
            }
          }
          alert("删除成功");
          this.showDeleteDialog = false;
        })
        .catch((err) => {
          alert(err);
        });

      // console.log(this.QuesList)
      //https://danxiagis.top:8081/assessment/teacher/deleteAssessment
    },
    past_qus_delete() {
      let uuid = this.del_qus1.id;
      //console.log('nameeeeee',name);

      axios({
        method: "post",
        url: "https://danxiagis.top:8081/passyearquestion/delete", //passyearquestion/all/get
        params: {
          _id: uuid,
        },
      })
        .then((response) => {
          console.log(response);
          for (let a = 0; a < this.past_QuesList.length; a++) {
            if (uuid == this.past_QuesList[a].id) {
              this.past_QuesList.splice(a, 1);
              break;
            }
          }
          alert("删除成功");
          this.showDeleteDialog1 = false;
        })
        .catch((err) => {
          alert(err);
        });

      // console.log(this.QuesList)
      //https://danxiagis.top:8081/assessment/teacher/deleteAssessment
    },
    notice_delete(e) {
      let uuid = e.id;
      //console.log('nameeeeee',name);
      for (let a = 0; a < this.NoticeList.length; a++) {
        if (uuid == this.NoticeList[a].id) {
          this.NoticeList.splice(a, 1);
          break;
        }
      }
      axios({
        method: "post",
        url: "https://danxiagis.top:8081/passyearnotice/delete", //passyearquestion/all/get
        params: {
          _id: uuid,
        },
      })
        .then((response) => {
          console.log(response);
          alert("删除成功");
        })
        .catch((err) => {
          alert(err);
        });

      // console.log(this.QuesList)
      //https://danxiagis.top:8081/assessment/teacher/deleteAssessment
    },
    async getDDL() {
      let ddl = await reqGetDDL();
      this.rpEndDate = ddl.data;
      console.log(this.rpEndDate);
    },
  },
  mounted() {
    this.getDDL();
  },
};
</script>

<style>
#r {
  min-height: 900px;
  min-width: 80%;
  position: relative;
  box-shadow: 0px 0px 3px rgb(160, 157, 157);
  left: 20px;
  top: 20px;
  margin-bottom: 40px;
  border-radius: 3%;
}
#selectcom {
  width: 300px;
}
#superlink {
  text-decoration: none;
  color: rgba(0, 0, 0);
}
div a#superlink:active {
  color: brown;
}
a#superlink:hover {
  color: rgb(42, 165, 56);
}
/* a.superlink:link{
  
} */
</style>