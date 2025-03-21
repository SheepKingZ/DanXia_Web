<template  >
  <v-app class="green lighten-5">
    <v-container fluid>
      <v-row>
        <v-card class="pull-left ml-5 mt-5" height="500px" min-width="11%">
          <v-list>
            <v-list-item-group v-model="model">
              <v-list-item link @click="num = '1'">
                <v-list-item-icon>
                  <v-icon>mdi-form-select</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>学生名单</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item link @click="num = '2'">
                <v-list-item-icon>
                  <v-icon>mdi-account-group</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>组队名单</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item link @click="num = '3'">
                <v-list-item-icon>
                  <v-icon>mdi-clipboard-edit-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>实习报告</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>

        <div id="r">
          <v-card class="mx-auto" min-height="100%" min-width="100%">
            <div class="px-7">
              <!-- 学生名单及信息上传 -->
              <div v-show="num == 1">
                <v-row>
                  <v-btn
                    class="ma-5"
                    dark
                    color="rgb(102,187,106)"
                    min-width="40px"
                  >
                    <v-file-input
                      prepend-icon="mdi-cloud-upload-outline"
                      v-model="lfiles"
                      placeholder="选择文件"
                      accept=".xls,.xlsx"
                    ></v-file-input>
                  </v-btn>

                  <v-btn
                    class="ma-5"
                    dark
                    color="rgb(102,187,106) "
                    @click="input_list()"
                    outlined
                    >确定上传</v-btn
                  >

                  <v-btn
                    class="ma-5"
                    dark
                    color="rgb(102,187,106) "
                    @click="export_list()"
                    outlined
                    >下载模板
                  </v-btn>
                  <v-spacer></v-spacer> <v-spacer></v-spacer>
                  <v-spacer></v-spacer>
                  <v-col cols="3" class="ml-5">
                    <v-text-field
                      v-model="search1"
                      append-icon="mdi-magnify"
                      label="搜索"
                      outlined
                      hide-details
                      dense
                    ></v-text-field
                  ></v-col>
                </v-row>
                <v-data-table
                  :headers="S_headers"
                  :items="S_desserts"
                  :items-per-page="10"
                  :search="search1"
                  class="elevation-1 mx-5"
                >
                </v-data-table>
                <v-dialog v-model="person_dialog" width="600">
                  <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                      {{ item_name }}实习感想
                    </v-card-title>
                    <br />

                    <h4
                      class="px-8"
                      :style="{
                        fontFamily: 'KaiTi, 楷体, serif',
                        fontSize: 'large',
                        textIndent: '2em',
                        lineHeight: '1.5',
                        fontWeight: 'bold',
                      }"
                    >
                      {{ item_text }}
                    </h4>
                    <br />
                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="primary"
                        text
                        @click="person_dialog = false"
                      >
                        取消
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
              <!-- 分组名单 -->
              <div v-show="num == 2">
                <br /><br />

                <v-data-table
                  :headers="G_headers"
                  :items="G_desserts"
                  :items-per-page="10"
                  class="elevation-1 ma-5"
                >
                </v-data-table>
              </div>

              <!-- 实习报告 -->
              <div v-show="num == 3">
                <v-row>
                  <v-col cols="7" md="7" sm="7" lg="7">
                    <v-row>
                      
                    <v-btn
                      class="ma-5"
                      dark
                      color="rgb(102,187,106)"
                      min-width="40px"
                    >
                      <v-file-input
                        prepend-icon="mdi-cloud-upload-outline"
                        v-model="all_files"
                        accept=".xml,.xls,.xlsx"
                        placeholder="导入各个学科成绩Excel"
                      ></v-file-input>
                    </v-btn>

                    <v-btn
                      class="ma-5"
                      dark
                      color="rgb(102,187,106) "
                      @click="input_allexcel()"
                      outlined
                      >确定上传</v-btn
                    >

                    <v-btn
                      class="ma-5"
                      dark
                      color="rgb(102,187,106) "
                      @click="export_allExcel()"
                      outlined
                      >下载小组成绩</v-btn
                    >
                  
                    </v-row>
                  </v-col>
                  <v-col cols="5" md="5" sm="5" lg="5">
                    <v-row>
                      <v-chip class="ma-5">
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
                    </v-row>
                  </v-col>
                  <v-divider></v-divider>
                </v-row>

                <v-data-table
                  :headers="filteredBGHeaders"
                  :items="BG_desserts"
                  :items-per-page="10"
                  :search="search"
                  class="elevation-1 ma-5"
                  :sort-by.sync="bgsortBy"
                  :sort-desc.sync="bgsortDesc"
                  @update:sort-by="bgonSortByUpdated"
                  @update:sort-desc="bgonSortDescUpdated"
                >
                  <template v-slot:item.报告成绩总评="{ item }">
                    <td class="bgcol">{{ item.报告成绩总评 }}</td>
                  </template>

                  <template #item.actions="{ item }">
                    <div class="tooltip-row" style="display: block;">
                      <v-tooltip>
                        <template v-slot:activator="{ on }">
                          <v-icon small @click="edit_bgItem(item)" v-on="on">
                            <!-- v-on="on" 将这些事件信息传递给 v-icon 元素 -->
                            mdi-pencil
                          </v-icon>
                        </template>
                        <span>评阅</span>
                      </v-tooltip>

                      <v-tooltip middle>
                        <template v-slot:activator="{ on }">
                          <v-icon
                            class="ml-2"
                            small
                            @click="look_bgItem(item)"
                            v-on="on"
                            
                          >
                            mdi-eye
                          </v-icon>
                        </template>
                        <span>查看实习报告</span>
                      </v-tooltip>
                    </div>
                  </template>
                </v-data-table>
                <!-- 报告弹窗 -->
                <v-dialog fullscreen v-model="showbg" :retain-focus="false">
                  <v-card>
                    <v-card-title style="font-size: 25px"
                      >第{{ item_id }}组实习报告</v-card-title
                    >
                    <v-row>
                      <v-card-subtitle class="mt-2" style="font-size: 15px"
                        >小组成员：{{ item_mem }}</v-card-subtitle
                      >
                      <v-card-subtitle
                        class="mt-2"
                        style="font-size: 15px; color: rgb(9, 134, 70)"
                      >
                        报告成绩总评：<b>{{ now_total }}</b>
                      </v-card-subtitle>
                    </v-row>
                    <v-row style="height: 800px;">
                      <!-- 左侧列放置 iframe -->
                      <v-col cols="9" md="9" sm="9" lg="9">
                        <iframe
                          :src="pdfSrc"
                          width="100%"
                          height="100%"
                        ></iframe>
                      </v-col>

                      <!-- 右侧列放置其他内容 -->
                      <v-col cols="3" md="3" sm="3" lg="3">
                        
                          <v-row>
                            <v-card-actions>
                              <v-btn
                                color="green darken-1"
                                text
                                @click="pre_group"
                                >上一组</v-btn
                              >
                              <v-btn
                                color="green darken-1"
                                text
                                @click="next_group"
                                >下一组</v-btn
                              >
                              <v-btn color="green darken-1" text @click="close"
                                >关闭</v-btn
                              >
                              <v-btn color="green darken-1" text @click="save"
                                >保存</v-btn
                              >
                              <!--  -->
                            </v-card-actions>
                          </v-row>
                          
                          <div>
                            <v-text-field
                              v-model="edited_bgItem.自然地理"
                              :rules="[rule.max, rule.min]"
                              label="自然地理学评分"
                            ></v-text-field>
                            <v-textarea
                              solo
                              v-model="currentBgItem.ziran_py"
                              v-if="currentBgItem"
                              label="自然地理学评语"
                            ></v-textarea>
                            </div>
                            
                            <div>
                              <v-text-field
                              v-model="edited_bgItem.人文与经济地理"
                              :rules="[rule.max, rule.min]"
                              label="人文与经济地理评分"
                              v-show="majority=='地理信息科学'"
                            ></v-text-field>
                            <v-textarea
                              solo
                              v-model="currentBgItem.renwen_py"
                              label="人文与经济地理评语"
                              v-if="currentBgItem"
                              v-show="majority=='地理信息科学'"
                            ></v-textarea>
                            </div>

                            <div>
                              <v-text-field
                              v-model="edited_bgItem.地图学"
                              :rules="[rule.max, rule.min]"
                              label="地图学评分"
                              v-show="majority=='地理信息科学'"
                            ></v-text-field>
                            <v-textarea
                            solo
                              v-model="currentBgItem.ditu_py"
                              label="地图学评语"
                              v-if="currentBgItem"
                              v-show="majority=='地理信息科学'"
                            ></v-textarea>
                            </div>

                            <div>
                              <v-text-field
                              v-model="edited_bgItem.地理信息系统原理"
                              :rules="[rule.max, rule.min]"
                              label="地理信息系统原理评分"
                              v-show="majority=='地理信息科学'"
                            ></v-text-field>
                            <v-textarea
                            solo
                              v-model="currentBgItem.gis_py"
                              label="地理信息系统原理评语"
                              v-if="currentBgItem"
                              v-show="majority=='地理信息科学'"
                            ></v-textarea>
                            </div>
                        
                        
                      </v-col>
                    </v-row>
                  </v-card>
                </v-dialog>

                <!-- 评阅弹窗 -->
                <v-dialog
                  v-model="showpyue"
                  max-width="500px"
                  :retain-focus="false"
                >
                  <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                      第{{ item_id }}组
                      <span class="ml-2" style="font-size: 20px">
                        报告成绩总评：<b style="color: rgb(9, 137, 70)">{{
                          now_total
                        }}</b></span
                      >
                    </v-card-title>

                    <v-card-text>
                      <v-container>
                        <v-radio-group v-model="selectedItem">
                          <v-row class="mt-1">
                            <v-radio
                              :value="1"
                              @click="
                                isZiran = true;
                                isRenwen = false;
                                isDitu = false;
                                isGis = false;
                              "
                              label="自然地理"
                              class="ml-8"
                            >
                            </v-radio>
                            <v-radio
                              :value="2"
                              @click="
                                isZiran = false;
                                isRenwen = true;
                                isDitu = false;
                                isGis = false;
                              "
                              label="人文与经济地理"
                              class="ml-8"
                            >
                            </v-radio>
                            <v-radio
                              :value="3"
                              @click="
                                isZiran = false;
                                isRenwen = false;
                                isDitu = true;
                                isGis = false;
                              "
                              label="地图学"
                              class="ml-8"
                            >
                            </v-radio>
                            <v-radio
                              :value="4"
                              @click="
                                isZiran = false;
                                isRenwen = false;
                                isDitu = false;
                                isGis = true;
                              "
                              label="地理信息系统原理"
                              class="ml-8"
                            >
                            </v-radio>
                            <!-- 用于解决最后一个凹陷 -->
                            <v-radio v-show="false"> </v-radio>
                          </v-row>
                        </v-radio-group>

                        <v-text-field
                          v-show="isZiran"
                          v-model="edited_bgItem.自然地理"
                          :rules="[rule.max, rule.min]"
                          label="自然地理学评分"
                        ></v-text-field>

                        <v-text-field
                          v-show="isRenwen"
                          :rules="[rule.max, rule.min]"
                          v-model="edited_bgItem.人文与经济地理"
                          label="人文与经济地理评分"
                          
                        ></v-text-field>

                        <v-text-field
                          v-show="isDitu"
                          :rules="[rule.max, rule.min]"
                          v-model="edited_bgItem.地图学"
                          label="地图学评分"
                        ></v-text-field>

                        <v-text-field
                          v-show="isGis"
                          :rules="[rule.max, rule.min]"
                          v-model="edited_bgItem.地理信息系统原理"
                          label="GIS原理评分"
                        ></v-text-field>

                        <v-textarea
                          v-show="isZiran"
                           v-if="currentBgItem"
                          outlined
                          v-model="currentBgItem.ziran_py"
                          label="自然地理学评语"
                        ></v-textarea>
                        <v-textarea
                          v-show="isRenwen"
                          v-if="currentBgItem"
                          outlined
                          v-model="currentBgItem.renwen_py"
                          label="人文与经济地理评语"
                        ></v-textarea>
                        <v-textarea
                          v-show="isDitu"
                          v-if="currentBgItem"
                          outlined
                          v-model="currentBgItem.ditu_py"
                          label="地图学评语"
                        ></v-textarea>
                        <v-textarea
                          v-show="isGis"
                          v-if="currentBgItem"
                          outlined
                          v-model="currentBgItem.gis_py"
                          label="地理信息系统原理评语"
                        ></v-textarea>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" text @click="close1">
                          关闭
                        </v-btn>
                        <v-btn color="green darken-1" text @click="save">
                          保存
                        </v-btn>
                        <v-btn color="green darken-1" text @click="pre_group"
                          >上一组</v-btn
                        >
                        <v-btn color="green darken-1" text @click="next_group"
                          >下一组</v-btn
                        >
                        <!-- <v-btn color="green darken-1" text @click="viewNextItem">
                          下一组
                        </v-btn> -->
                      </v-card-actions>
                    </v-card-actions>
                    <v-divider></v-divider>
                  </v-card>
                </v-dialog>
              </div>
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
import ExportJsonExcel from "js-export-excel";
import * as XLSX from "xlsx";
export default {
  name: "StudentInfo",

  data() {
    return {
      bgsortBy: "defaultColumn", // 默认或当前排序列名
      bgsortDesc: false, // 排序方向，false 表示升序，true 表示降序
      rpEndDat: null,
      now_total: -1,
      all_files: null,
      lfiles: null,
      pdfSrc: "",
      showbg: false,
      ziran_py: [],
      renwen_py: [],
      ditu_py: [],
      gis_py: [],
      isGis: false,
      isDitu: false,
      isZiran: true,
      isRenwen: false,
      selectedItem: 1,
      showpyue: false,
      dialogDelete: false,
      search: "",
      search1: " ",
      model: 0,
      num: 1,
      rule: {
        max: (v) => v <= 100 || "只能小于100",
        min: (v) => 0 <= v || "不能小于0",
      },
      person_dialog: false,
      item_name: "",
      item_text: "",
      item_id: "",
      S_headers: [
        {
          text: "ID",
          align: "start",
          value: "id",
        },
        { text: "班级", value: "班级" },
        { text: "姓名", value: "姓名" },
        { text: "组别", value: "组别" },
        { text: "是否为组长", value: "是否为组长" },
      ],
      S_desserts: [], //实习组员名单
      G_headers: [
        {
          text: "组号",
          align: "start",
          value: "id",
        },
        { text: "组长", value: "leader" },
        { text: "组员", value: "member" },
        { text: "组员人数", value: "g_num" },
      ],
      G_desserts: [], //分组
      BG_headers:[],
      BG_desserts: [], //成绩报告
      edited_bgIndex: -1,
      edited_bgItem: {
        自然地理: 0,
        人文与经济地理: 0,
        地图学: 0,
        地理信息系统原理: 0,
      },
      item_mem: [],
      majority:''
    };
  },
  computed:{
    currentBgItem() {
    if (this.edited_bgIndex >= 0 && this.BG_desserts.length > this.edited_bgIndex) {
      return this.BG_desserts[this.edited_bgIndex];
    }
    return null; // 返回 null 或默认对象
  },
    filteredBGHeaders() {
    if (this.majority === '地理信息科学') {
      // 如果是地理信息科学专业，显示所有头
      return [
        { text: "组号", align: "center", value: "组号", sortable: true, width: "75px" },
        { text: "组员", align: "center", value: "组员", width: "300px" },
        { text: "提交时间", value: "提交时间", width: "75px" },
        { text: "自然地理", value: "自然地理", width: "85px" },
        { text: "人文与经济地理", value: "人文与经济地理", width: "120px" },
        { text: "地图学", value: "地图学", width: "85px" },
        { text: "地理信息系统原理", align: "justify", value: "地理信息系统原理", width: "130px" },
        { text: "报告成绩总评", value: "报告成绩总评", width: "110px" },
        { text: "操作", align: "center", value: "actions", sortable: false }
      ];
    } else {
      // 如果不是地理信息科学专业，移除某些列
      return [
        { text: "组号", align: "center", value: "组号", sortable: true, width: "75px" },
        { text: "组员", align: "center", value: "组员", width: "300px" },
        { text: "提交时间", value: "提交时间", width: "75px" },
        { text: "自然地理", value: "自然地理", width: "85px" },
        { text: "报告成绩总评", value: "报告成绩总评", width: "110px" },
        { text: "操作", align: "center", value: "actions", sortable: false }
      ];
    }
  }
  },
  methods: {
    bgonSortByUpdated(newSortBy) {
      this.bgsortBy = newSortBy;
      this.bgsortItems(); // 自定义的排序函数
    },
    bgonSortDescUpdated(newSortDesc) {
      this.bgsortDesc = newSortDesc;
      this.bgsortItems(); // 自定义的排序函数
    },
    bgsortItems() {
      // 一个简单的排序例子，根据 sortBy 和 sortDesc 对 items 进行排序
      this.BG_desserts.sort((a, b) => {
        if (this.bgsortDesc) {
          return a[this.bgsortBy] < b[this.bgsortBy] ? 1 : -1;
        } else {
          return a[this.bgsortBy] > b[this.bgsortBy] ? 1 : -1;
        }
      });
      console.log('bgde',this.BG_desserts);
      
    },
    async getDDL() {
      let ddl = await reqGetDDL();
      console.log('ddl',ddl);
      this.rpEndDate = ddl.data.split(".")[0];
      console.log(this.rpEndDate);
    },
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
    pre_group() {
      if (this.edited_bgIndex > 0) {
        //评分、评语减一
        this.edited_bgIndex--;

        // 更新下一组的报告数据
        this.loadReport(this.edited_bgIndex);
      } else {
        alert("已经是第一组了");
        // 或者循环到最后一组
        // this.edited_bgIndex = this.BG_desserts.length;
      }
    },
    next_group() {
      if (this.edited_bgIndex < this.BG_desserts.length - 1) {
        this.edited_bgIndex++;

        this.loadReport(this.edited_bgIndex);
      } else {
        alert("已经是最后一组");
        // 或者循环到第一组
        // this.edited_bgIndex = 0;
      }
    },
    loadReport(i) {
      console.log("####", this.showbg, this.showpyue);
      this.edited_bgItem = Object.assign({}, this.BG_desserts[i]);
      // 根据当前项加载报告数据
      this.item_id = this.edited_bgItem.组号;
      this.item_mem = this.edited_bgItem.组员;
      this.pdfSrc = this.edited_bgItem.download;
      
      
      this.now_total = this.edited_bgItem.报告成绩总评;
    },
    export_allExcel() {
      const col_name = [];
      //将列名存到数组里
      for (let i = 0; i < this.filteredBGHeaders.length - 1; i++) {
        col_name.push(this.filteredBGHeaders[i].text);
      }
      col_name.push("自然地理学评语");
      col_name.push("人文与经济地理评语");
      col_name.push("地图学评语");
      col_name.push("地理信息系统原理评语");
      // console.log(col_name)
      let option = {}; //option代表的就是excel文件
      //将每一行的数据作为一个对象存入
      /*let dataTable = [];//dataTable代表excel文件中的数据内容
       for (let i=0;i<this.BG_headers.length-1;i++) {
        dataTable.push(this.BG_desserts[i]);
     } */
      option.filename = "样式表"; //excel文件名
      const integratedData = this.BG_desserts.map((item, index) => {
        return {
          ...item, // 复制原有的报告信息
          自然地理学评语: this.ziran_py[index], // 添加自然地理学评语
          人文与经济地理评语: this.renwen_py[index], // 添加人文与经济地理评语
          地图学评语: this.ditu_py[index], // 添加地图学评语
          地理信息系统原理评语: this.gis_py[index], // 添加地理信息系统原理评语
        };
      });

      //excel文件数据，配置属性
      option.datas = [
        {
          //excel文件的数据源
          sheetData: integratedData,
          //excel文件sheet的表名
          sheetName: "sheet",
          //excel文件表头名
          sheetHeader: col_name,
          //excel文件列名
          sheetFilter: col_name,
        },
      ];
      console.log("options", option.datas);
      //创建ExportJsonExcel实例对象
      let toExcel = new ExportJsonExcel(option);
      console.log("excel", toExcel);
      //调用保存方法
      toExcel.saveExcel();
    },
    input_allexcel() {
      this.BG_desserts = [];
      this.ziran_py = [];
      this.renwen_py = [];
      this.ditu_py = [];
      this.gis_py = [];
      if (this.all_files == null) {
        alert("请选择文件");
        return;
      }
      let formData = new FormData();
      formData.append("file", this.all_files);

      axios({
        method: "post",
        url: "https://danxiagis.top:8081/teacher/uploadStudentsReportPerformance",
        data: formData,
      })
        .then((res) => {
          console.log(res);
          alert(res.data);
          let reader = new FileReader();
          //操作后的结果储存在reader的result属性中，
          //是一个 ArrayBuffer 对象，代表文件的原始二进制数据
          reader.readAsArrayBuffer(this.all_files);
          //
          reader.onload = () => {
            //Uint8Array 对象直接映射ArrayBuffer的内容
            const data = new Uint8Array(reader.result);
            //要解析的数据和一个选项对象,选项对象告诉xlsx库传入的数据是一个数组类型
            const workbook = XLSX.read(data, { type: "array" });
            //读取表格中第一页的名字,sheetnames包含了所有页的名字
            const firstSheetName = workbook.SheetNames[0];
            //获取第一页表格
            const worksheet = workbook.Sheets[firstSheetName];
            //将工作表对象转换为 JSON 格式的数据
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            console.log("jssssssssss", jsonData);

            for (let obj of jsonData) {
              let all_score = {};
              // 检查属性值是否包含“评语”
              for (let key in obj) {
                if (!key.includes("评语")) all_score[key] = obj[key];
              }
              this.BG_desserts.push(all_score);
              this.ziran_py.push(obj.自然地理学评语);
              this.renwen_py.push(obj.人文与经济地理评语);
              this.ditu_py.push(obj.地图学评语);
              this.gis_py.push(obj.地理信息系统原理评语);
            }
            this.reportMark();
          };
        })
        .catch((err) => {
          alert(err.data);
        });
    },
    // 初始化名单
    async loadSlist() {
      axios({
        method: "get",
        url: "https://danxiagis.top:8081/login/smallWeb/getStudentList",
      }).then((response) => {
        let res = response.data;
        // console.log(res)
        let text = res[0].class_name;
        this.majority =  text.match(/\d+([^\d]+)\d+/)[1]; 
        this.S_desserts = [];
        for (var a = 0; a < res.length; a++) {
          let dess = {
            id: res[a].stu_id,
            班级: res[a].class_name,
            姓名: res[a].name,
            组别: res[a].group_id,
            是否为组长: res[a].isleader,
          };
          this.S_desserts.push(dess);
        }
        this.S_desserts.sort((a, b) => a.id - b.id);
      });
      return '1'
    },
    // 分组
    GroupList() {
      axios({
        method: "get",
        url: "https://danxiagis.top:8081/login/smallWeb/getStudentList",
      }).then((response) => {
        let res = response.data;
        let sub_group = [];
        //找队长
        for (var b = 0; b < res.length; b++) {
          if (res[b].isleader == "是") {
            sub_group.push({
              id: res[b].group_id,
              leader: res[b].name,
              member: "",
              g_num: "",
            });
          }
        }
        //每一组进行处理
        for (var c = 0; c < sub_group.length; c++) {
          let m = [];
          let peo = 0;
          //对所有的信息进行处理，挑出每一组的每一个人
          for (var d = 0; d < res.length; d++) {
            if (res[d].group_id == sub_group[c].id && res[d].isleader != "是") {
              m.push(res[d].name);
              peo++;
            }
            sub_group[c].member = m;
            sub_group[c].g_num = peo;
          }
        }
        this.G_desserts = sub_group;
      });
    },

    // 实习报告
    reportMark() {
      axios({
        method: "get",
        url: "https://danxiagis.top:8081/assessment/getReport", //http://danxiagis.top:3000/ui/teacher/getReport
      }).then((response) => {
        let res = response.data;
        
        this.BG_desserts = [];
        for (var e = 0; e < res.length; e++) {
          let dess = {
            组号: res[e].group_num,
            组员: res[e].members,
            提交时间: res[e].dateChange,
            自然地理: res[e].natural,
            人文与经济地理: res[e].humanities,
            地图学: res[e].cartography,
            地理信息系统原理: res[e].gis,
            报告成绩总评: res[e].reportScore,
            download: res[e].report_url,
            ditu_py:res[e].cartographyEvaluate,
            ziran_py:res[e].naturalEvaluate,
            renwen_py:res[e].humanitiesEvaluate,
            gis_py:res[e].gisevaluate
          };
          this.BG_desserts.push(dess);
          //用于导出表格的
          this.ditu_py[e]=res[e].cartographyEvaluate,
          this.ziran_py[e]=res[e].naturalEvaluate,
          this.renwen_py[e]=res[e].humanitiesEvaluate,
          this.gis_py[e]=res[e].gisevaluate
          console.log('bg',this.BG_desserts);
        }
        this.now_total = this.BG_desserts[this.edited_bgIndex].报告成绩总评;
      });
    },
    input_list() {
      /* let stu_info=[] */
      let stu_headers = [];
      for (let i = 0; i < this.S_headers.length ; i++) {
        stu_headers.push(this.S_headers[i].value);
      }
     
      if (this.lfiles == null) {
        alert("请选择文件");
        return;
      }
      let formData = new FormData();
      formData.append("file", this.lfiles);
      axios({
        method: "post",
        url: "https://danxiagis.top:8081/teacher/uploadStudents",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data", // 确保设置正确的Content-Type
        },
        //
      })
        .then((res) => {
          /* this.S_desserts=[]
      alert(res.data)
      // 获取数据 
      this.excel_items=[]
      //let jsonData = {}
      let reader = new FileReader()
      //操作后的结果储存在reader的result属性中，
      //是一个 ArrayBuffer 对象，代表文件的原始二进制数据
      reader.readAsArrayBuffer(this.lfiles) */
          /* reader.onload =  function () {
        //Uint8Array 对象直接映射ArrayBuffer的内容
          const data = new Uint8Array(reader.result);
          //要解析的数据和一个选项对象,选项对象告诉xlsx库传入的数据是一个数组类型
          const workbook = XLSX.read(data, { type: 'array' });
          //读取表格中第一页的名字,sheetnames包含了所有页的名字
          const firstSheetName = workbook.SheetNames[0];
          //获取第一页表格
          const worksheet = workbook.Sheets[firstSheetName];
          //将工作表对象转换为 JSON 格式的数据
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          for(let m of jsonData){
            stu_info.push(m)
            
          }
        } */
          /* this.S_desserts = stu_info   */
          alert(res.data);
          this.loadSlist();
          this.GroupList();
        })
        .catch((err) => {
          console.log(err);
          alert("上传失败");
        });
    },

    export_list() {
      const col_name = [];
      for (let a = 0; a < this.S_headers.length; a++) {
        col_name.push(this.S_headers[a].text);
      }
      console.log('header',this.S_headers,col_name);
      // console.log(col_name)
      let option = {}; //   option代表的就是excel文件

      option.filename = "final"; //excel文件名

      //excel文件数据
      option.datas = [
        {
          //   excel文件的数据源
          sheetData: [],
          //   excel文件sheet的表名
          sheetName: "sheet",
          //   excel文件表头名
          sheetHeader: col_name,
          //   excel文件列名
          sheetFilter: col_name,
        },
      ];
      console.log('data',option.datas);
      //   创建ExportJsonExcel实例对象
      let toExcel = new ExportJsonExcel(option);
      //   调用保存方法

      toExcel.saveExcel();
    },
    edit_bgItem(item) {
    console.log('item',item);
    
      /* 得到当前item的索引 */
      this.edited_bgIndex = this.BG_desserts.indexOf(item);
      console.log('edited',this.edited_bgIndex);
      
      this.edited_bgItem = Object.assign({}, item);
      this.now_total = this.edited_bgItem.报告成绩总评;
      this.showpyue = true;
      this.item_id = item.组号;
    },

    close() {
      this.showbg = false;
      this.showpyue = false;
      this.$nextTick(() => {
        this.edited_bgItem = Object.assign({}, this.defaultItem);
        this.edited_bgIndex = -1;
      });
    },
    close1() {
      this.showbg = false;
      this.showpyue = false;
      this.$nextTick(() => {
        this.edited_bgItem = Object.assign({}, this.defaultItem);
        this.edited_bgIndex = -1;
      });
    },
    save() {
      //edited_bgItem是当前点击到的要编辑的，index就是他的index
      if (this.edited_bgIndex > -1) {
        Object.assign(
          this.BG_desserts[this.edited_bgIndex],
          this.edited_bgItem
        );
      } else {
        this.BG_desserts.push(this.edited_bgItem);
      }
      if (this.gis_py[this.edited_bgIndex] == null) {
        this.gis_py[this.edited_bgIndex] = "无";
      }
      if (this.ditu_py[this.edited_bgIndex] == null) {
        this.ditu_py[this.edited_bgIndex] = "无";
      }
      if (this.ziran_py[this.edited_bgIndex] == null) {
        this.ziran_py[this.edited_bgIndex] = "无";
      }
      if (this.renwen_py[this.edited_bgIndex] == null) {
        this.renwen_py[this.edited_bgIndex] = "无";
      }
      let para = {
        group_num: this.edited_bgItem.组号,
        natural: this.edited_bgItem.自然地理,
        Humanities: this.edited_bgItem.人文与经济地理,
        Cartography: this.edited_bgItem.地图学,
        GIS: this.edited_bgItem.地理信息系统原理,
        naturalEvaluate: this.ziran_py[this.edited_bgIndex],
        HumanitiesEvaluate: this.renwen_py[this.edited_bgIndex],
        CartographyEvaluate: this.ditu_py[this.edited_bgIndex],
        GISEvaluate: this.gis_py[this.edited_bgIndex],
      };

      axios({
        method: "post",
        url: "https://danxiagis.top:8081/assessment/teacher/scoreReport",
        params: para,
      }).then((res) => {
        console.log(res);
        this.reportMark();
        console.log("55555555", this.BG_desserts);
      });

      alert("评阅成功");
    },
    // 打开相应报告
    look_bgItem(item) {
      console.log("item", item);
      this.item_id = item.组号;
      this.item_mem = item.组员;
      this.edited_bgIndex = this.BG_desserts.indexOf(item);
      this.edited_bgItem = Object.assign({}, item);
      this.pdfSrc = item.download;
      this.now_total = item.报告成绩总评;
      this.showbg = true;
      
    },
  },
  mounted() {
    this.getDDL();
  },
  async created() {
    await this.loadSlist();
    this.GroupList();
    this.reportMark();
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
thead {
  background-color: rgb(229, 229, 229);
}
.tooltip-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.v-tooltip {
  /* 可以根据需要调整 */
  margin-right: 10px;
}
.bgcol {
  color: rgb(159, 22, 4); /* 文字颜色 */
  font-weight: 700;
}
</style>