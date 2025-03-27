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
import { ref, reactive, computed, watch, onMounted } from 'vue';

export default {
  name: "Update",

  setup() {
    // 反应式状态
    const rpEndDate = ref(null);
    const dialogKey = ref(0);
    const cancelToken = ref(null);
    const IsSending = ref(false);
    const dele_notice_dia = ref(false);
    const item_time = ref("");
    const modifycontent = ref("");
    const showEditDialog = ref(false);
    const showEditDialog1 = ref(false);
    const model = ref("0");
    const selectedValue = ref([]);
    const items = ref([
      { name: "All", value: "" },
      { name: "自然地理", value: [] },
      { name: "人文与经济地理", value: [] },
      { name: "地理信息系统原理", value: [] },
    ]);
    const dialoggg = ref(false);
    const startDate = ref("");
    const endDate = ref("");
    const text = ref("查看");
    const look = ref(false);
    const search = ref("");
    const dialog = ref(false);
    const dialogDelete = ref(false);
    const childItems = ref([]);
    const num = ref(0);
    const update_items = ref([
      "自然地理",
      "人文与经济地理",
      "实习资料",
      "地理信息系统原理",
      "地图学",
      "其他资料",
    ]);

    const type = ref(""); //类型
    const chapter = ref(""); //章节名
    const name = ref(""); //文件名
    const infodata = ref("");
    const inputfile = ref(""); //文件

    const editedIndex = ref(-1);
    const editedItem = reactive({
      id: "",
      name: "",
      type: "",
      subject: "",
      chapter: "",
      enable: "",
    });
    const defaultItem = reactive({
      id: "",
      name: "",
      type: "",
      subject: "",
      chapter: "",
      enable: "",
    });
    const list = ref([
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
    ]);
    const detail = ref([]); //存放资料列表
    const ques_text = ref("");
    const QuesList = ref([]);
    const past_QuesList = ref([]);
    const NoticeList = ref([]);
    const all = ref([]);
    const natural_checkbox = ref(false);
    const human_checkbox = ref(false);
    const ca_checkbox = ref(false);
    const gis_checkbox = ref(false);
    const edited_qus = reactive({});
    const edited_qus1 = reactive({});
    const del_qus1 = reactive({});
    const del_qus = reactive({});
    const showDeleteDialog1 = ref(false);
    const showDeleteDialog = ref(false);

    // 监听器
    watch(dialog, (val) => {
      val || close();
    });

    watch(dialogDelete, (val) => {
      val || closeDelete();
    });

    // 方法
    const checkrpEndDate = () => {
      if (rpEndDate.value == null || rpEndDate.value == "") {
        alert("还未选择时间");
        return;
      }
      axios({
        url: "https://danxiagis.top:8081/teacher/setFileDDL",
        method: "post",
        params: {
          FileDDL: rpEndDate.value.replace("T", " ") + ":00.000",
        },
      }).then(async (resp) => {
        alert(resp.data);
      });
    };

    const cancelUpload = () => {
      IsSending.value = false;
      if (cancelToken.value) {
        /* error.message为''中的 */
        cancelToken.value.cancel("上传被用户取消。");
      }
      dialogKey.value++;
    };

    const qus_edit = (e) => {
      showEditDialog.value = true;
      Object.assign(edited_qus, {
        id: e.id,
        title: e.title,
        start: e.start,
        end: e.end,
      });
      console.log("tttttttttttttt", e);
    };

    const qus_edit1 = (item) => {
      showEditDialog1.value = true;
      Object.assign(edited_qus1, {
        id: item.id,
        title: item.title,
        start: item.start,
        end: item.end,
        item_time: item.used_time,
      });
    };

    const qus_to_delete1 = (e) => {
      showDeleteDialog1.value = true;
      Object.assign(del_qus1, {
        id: e.id,
        title: e.title,
      });
    };

    const qus_to_delete = (e) => {
      showDeleteDialog.value = true;
      Object.assign(del_qus, {
        id: e.id,
        title: e.title,
      });
    };

    const qus_delete = () => {
      let uuid = del_qus.id;

      axios({
        method: "post",
        url: "https://danxiagis.top:8081/assessment/deleteAssessment",
        params: {
          _id: uuid,
        },
      })
        .then((response) => {
          console.log(response);
          for (let a = 0; a < QuesList.value.length; a++) {
            if (uuid == QuesList.value[a].id) {
              QuesList.value.splice(a, 1);
              break;
            }
          }
          alert("删除成功");
          showDeleteDialog.value = false;
        })
        .catch((err) => {
          alert(err);
        });
    };

    const past_qus_delete = () => {
      let uuid = del_qus1.id;

      axios({
        method: "post",
        url: "https://danxiagis.top:8081/passyearquestion/delete",
        params: {
          _id: uuid,
        },
      })
        .then((response) => {
          console.log(response);
          for (let a = 0; a < past_QuesList.value.length; a++) {
            if (uuid == past_QuesList.value[a].id) {
              past_QuesList.value.splice(a, 1);
              break;
            }
          }
          alert("删除成功");
          showDeleteDialog1.value = false;
        })
        .catch((err) => {
          alert(err);
        });
    };

    const notice_delete = (e) => {
      let uuid = e.id;
      for (let a = 0; a < NoticeList.value.length; a++) {
        if (uuid == NoticeList.value[a].id) {
          NoticeList.value.splice(a, 1);
          break;
        }
      }
      axios({
        method: "post",
        url: "https://danxiagis.top:8081/passyearnotice/delete",
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
    };

    const getDDL = async () => {
      let ddl = await reqGetDDL();
      rpEndDate.value = ddl.data;
      console.log(rpEndDate.value);
    };

    // 添加created生命周期中的方法
    const loadClassList = () => {
      // 实现loadClassList方法
    };

    const load_que = () => {
      // 实现load_que方法
    };

    const load_past_que = () => {
      // 实现load_past_que方法
    };

    const load_notice = () => {
      // 实现load_notice方法
    };

    // 生命周期钩子
    onMounted(() => {
      getDDL();
    });

    // 替代created生命周期
    loadClassList();
    load_que();
    load_past_que();
    load_notice();

    // 返回需要在模板中使用的内容
    return {
      rpEndDate,
      dialogKey,
      cancelToken,
      IsSending,
      dele_notice_dia,
      item_time,
      modifycontent,
      showEditDialog,
      showEditDialog1,
      model,
      selectedValue,
      items,
      dialoggg,
      startDate,
      endDate,
      text,
      look,
      search,
      dialog,
      dialogDelete,
      childItems,
      num,
      update_items,
      type,
      chapter,
      name,
      infodata,
      inputfile,
      editedIndex,
      editedItem,
      defaultItem,
      list,
      detail,
      ques_text,
      QuesList,
      past_QuesList,
      NoticeList,
      all,
      natural_checkbox,
      human_checkbox,
      ca_checkbox,
      gis_checkbox,
      edited_qus,
      edited_qus1,
      del_qus1,
      del_qus,
      showDeleteDialog1,
      showDeleteDialog,
      
      // 方法
      checkrpEndDate,
      cancelUpload,
      qus_edit,
      qus_edit1,
      qus_to_delete1,
      qus_to_delete,
      qus_delete,
      past_qus_delete,
      notice_delete,
      getDDL,
      loadClassList,
      load_que,
      load_past_que,
      load_notice,
    };
  }
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