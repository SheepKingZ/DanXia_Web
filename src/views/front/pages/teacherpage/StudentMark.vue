<template  >
  <v-app class="green lighten-5">
    <v-container fluid>
      <v-row>
        <v-card
          class="pull-left ml-5 mt-5"
          height="100%"
          style="max-width: 200px"
        >
          <v-expansion-panels multiple v-model="panels">
            <v-expansion-panel>
              <v-expansion-panel-header>成绩评阅</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-list-item-group
                  v-model="MarkSelected"
                  active-class="highlighted"
                >
                  <v-list>
                    <div @click="handleClick('MarkSelected')">
                      <!-- 平时成绩 -->
                      <v-list-item
                        link
                        @click="
                          num = '1';
                          commonMark();
                        "
                      >
                        <v-list-item-icon>
                          <v-icon>mdi-marker-check</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>平时成绩</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <!--从数据库获取一次 
                    考核问题-->
                      <v-list-item
                        link
                        @click="
                          num = '5'
                          /*  KHList(); */
                        "
                      >
                        <v-list-item-icon>
                          <v-icon>mdi-format-annotation-plus</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>问题考核</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <!-- 实习感想 -->
                      <v-list-item link @click="num = '6'">
                        <v-list-item-icon>
                          <v-icon>mdi-thought-bubble</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>实习感想</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <!-- 实习报告 -->
                    </div>
                  </v-list>
                </v-list-item-group>
              </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-header>成绩设置</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-list-item-group
                  v-model="ManageSelected"
                  active-class="highlighted"
                >
                  <v-list>
                    <!--  -->
                    <!-- 用div包裹，进行事件冒泡
                      由于高亮是由v-model绑定的值确定的，所以当换类的时候，应该处理一下
                      让上一个类的高亮消失，即初始化上一个类的v-model
                  -->
                    <div @click="handleClick('ManageSelected')">
                      <!-- 成绩组成 -->
                      <v-list-item
                        link
                        @click="
                          num = '2';
                        "
                      >
                        <v-list-item-icon>
                          <v-icon>mdi-view-dashboard-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>成绩组成</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <!-- 成绩汇总 -->
                      <v-list-item
                        link
                        @click="
                          num = '3';
                          finalMark();
                        "
                      >
                        <v-list-item-icon>
                          <v-icon>mdi-file-sign</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>成绩汇总</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <!-- 往届成绩 -->
                      <v-list-item
                        link
                        @click="
                          num = '4';
                          finalMark();
                        "
                      >
                        <v-list-item-icon>
                          <v-icon>mdi-folder-eye-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>往届成绩</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </div>
                  </v-list>
                </v-list-item-group>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>

        <div id="r">
          <v-card class="mx-auto" min-height="100%" min-width="100%">
            <div class="px-7">
              <!-- 学生名单及信息上传 -->

              <div v-show="num == 6">
                <v-row>
                  <!-- <v-spacer></v-spacer> <v-spacer></v-spacer>
                  <v-spacer></v-spacer> -->
                  <v-col cols="3" class="ml-5">
                    <v-text-field
                      v-model="ThoughSearch"
                      append-icon="mdi-magnify"
                      label="搜索学生"
                      outlined
                      hide-details
                      dense
                    ></v-text-field
                  ></v-col>
                  <v-col>
                    已有<span style="color: green; font-weight: 700">{{
                      gxansweredNum
                    }}</span
                    >位学生已提交感想<br />
                    还有<span style="color: red; font-weight: 700">{{
                      stu_sum - gxansweredNum
                    }}</span
                    >位学生未提交感想
                  </v-col> </v-row
                ><br />
                <v-data-table
                  :headers="S_headers"
                  :items="S_desserts"
                  :items-per-page="10"
                  :item-class="gxmarkLeader"
                  :search="ThoughSearch"
                  class="elevation-1 mx-5"
                  :sort-by.sync="gxsortBy"
                  :sort-desc.sync="gxsortDesc"
                  @update:sort-by="gxonSortByUpdated"
                  @update:sort-desc="gxonSortDescUpdated"
                >
                  <template v-slot:item.查看实习感想="{ item }">
                    <v-icon small class="mr-2" @click="check_thought(item)">
                      mdi-eye
                    </v-icon>
                  </template>
                  <template v-slot:item.answerStatus="{ item }">
                    <span
                      style="font-size: 20px"
                      :style="{
                        color: item.answerStatus == 1 ? 'greenyellow' : 'red',
                      }"
                      @mousemove="logggg"
                      >●</span
                    >
                  </template>
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

                      <v-btn color="green darken-1" text @click="gxpre_group">
                        上一位
                      </v-btn>
                      <v-btn color="green darken-1" text @click="gxnext_group">
                        下一位
                      </v-btn>
                      <v-btn
                        color="primary"
                        text
                        @click="person_dialog = false"
                      >
                        关闭
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
              <!-- 平时成绩导入 -->
              <div v-show="num == 1">
                <br />
                <v-row class="ma-5">
                  <v-col cols="8">
                    <v-btn dark color="rgb(102,187,106)" min-width="40px">
                      <v-file-input
                        prepend-icon="mdi-cloud-upload-outline"
                        v-model="psfiles"
                        accept=".xml,.xls,.xlsx"
                        placeholder="导入平时成绩Excel"
                      ></v-file-input>
                    </v-btn>

                    <v-btn
                      class="ma-1"
                      dark
                      color="rgb(102,187,106) "
                      @click="input_psexcel()"
                      >确定上传</v-btn
                    >
                    <v-btn
                      class="ma-1"
                      dark
                      color="rgb(102,187,106) "
                      @click="exportExcel()"
                      >下载表格</v-btn
                    >

                    <!-- 修改占比 -->
                    <v-dialog v-model="dialog_1" width="500" @input="isOpen">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="green lighten-2"
                          dark
                          outlined
                          v-bind="attrs"
                          v-on="on"
                          class="ma-1"
                        >
                          修改评分项占比
                        </v-btn>
                      </template>

                      <v-card>
                        <v-card-title class="text-h5 grey lighten-2">
                          当前评分项
                        </v-card-title>

                        <v-list>
                          <v-list-item v-for="(item, i) in excel_mark" :key="i">
                            <v-list-item-content>
                              <v-list-item-title class="mt-n3">
                                {{ item.text }}
                              </v-list-item-title>

                              <v-text-field
                                :rules="[
                                  rule.new_point_max,
                                  rule.new_point_min,
                                ]"
                                v-model="item.vnum"
                                label="占比"
                                @change="dele_point(item)"
                              ></v-text-field>
                            </v-list-item-content>
                            <!-- <v-col cols="3"><v-text-field
                            v-model="item.vnum"
                            class="mt-0 pt-0"
                            dense
                            outlined
                            type="number"
                            
                          ></v-text-field></v-col> -->

                            <!-- 
                          打分项能否删除的逻辑，就是那个x能不能显示  
                        <v-list-item-icon>
                          <v-tooltip bottom>
                            <template v-slot:activator="{ on, attrs }">
                              
                              <v-icon
                                v-bind="attrs"
                                v-on="on"
                                link
                                v-show="nesseccry_item(i)"
                                @click="dele_point(i)"
                              >
                              mdi-close
                              </v-icon>
                            </template>
                            <span>点击删除</span>
                          </v-tooltip>
                        </v-list-item-icon> -->
                          </v-list-item>
                          <v-row>
                            <span style="margin-left: 30px; margin-top: 10px"
                              >当前比例之和为</span
                            >
                            <v-text-field
                              :value="sum"
                              type="number"
                              :rules="[Is100]"
                              dense
                              readonly
                              class="ml-2"
                              style="max-width: 60px"
                            ></v-text-field>
                          </v-row>
                        </v-list>
                        <v-divider></v-divider>

                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="primary"
                              text
                              @click="cancel_each_part"
                            >
                              取消
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="primary"
                              text
                              @click="confirm_each_part"
                            >
                              确认修改
                            </v-btn>
                          </v-card-actions>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-col>
                  <v-spacer></v-spacer> <v-spacer></v-spacer>
                  <v-spacer></v-spacer>
                  <v-col cols="3" class="ml-5">
                    <v-text-field
                      v-model="psScoreSearch"
                      append-icon="mdi-magnify"
                      label="搜索学生"
                      outlined
                      hide-details
                      dense
                    ></v-text-field
                  ></v-col>
                </v-row>
                <!-- 命名视图-->
                <v-data-table
                  :headers="excel_headers"
                  :items="excel_items"
                  :items-per-page="15"
                  :item-class="psmarkLeader"
                  :search="psScoreSearch"
                >
                  <template v-slot:item.平时成绩="{ item }">
                    <td class="pscol">{{ item.平时成绩 }}</td>
                  </template>

                  <template v-slot:item.打卡点得分="{ item }">
                    <v-text-field
                      style="max-width: 30px"
                      v-model="item.打卡点得分"
                      label="打卡点得分"
                      single-line
                      dense
                      @change="up_psscore(item)"
                      class="custom-size"
                    ></v-text-field>
                  </template>
                  <template v-slot:item.学习时长得分="{ item }">
                    <v-text-field
                      style="max-width: 30px"
                      v-model="item.学习时长得分"
                      label="学习时长得分"
                      single-line
                      dense
                      @change="up_psscore(item)"
                      class="no-underline"
                    ></v-text-field>
                  </template>
                  <template v-slot:item.回答问题="{ item }">
                    <v-text-field
                      style="max-width: 30px"
                      v-model="item.回答问题"
                      label="回答问题"
                      single-line
                      dense
                      @change="up_psscore(item)"
                    ></v-text-field>
                  </template>
                  <template v-slot:item.公共事务="{ item }">
                    <v-text-field
                      style="max-width: 30px"
                      v-model="item.公共事务"
                      label="公共事务"
                      single-line
                      dense
                      @change="up_psscore(item)"
                    ></v-text-field>
                  </template>
                  <template v-slot:item.小组考核="{ item }">
                    <v-text-field
                      style="max-width: 30px"
                      v-model="item.小组考核"
                      label="小组考核"
                      single-line
                      dense
                      @change="up_psscore(item)"
                    ></v-text-field>
                  </template>
                </v-data-table>
              </div>
              <!-- 成绩组成滑块 -->
              <div v-show="num == 2">
                <br /><br />
                <v-card
                  flat
                  color="transparent"
                  class="mx-auto"
                  max-width="90%"
                >
                  <v-subheader class="font-weight-black"
                    >平时成绩与报告成绩占比</v-subheader
                  >

                  <v-card-text>
                    <v-row>
                      <v-col cols="9" class="pr-50">
                        <v-slider
                          v-model="ex2.slider"
                          class="align-center"
                          :max="ex2.max"
                          :min="ex2.min"
                          hide-details
                          step="5"
                          ticks
                        >
                        </v-slider>
                        <v-container>
                          <v-row>
                            平时成绩占比：
                            <span
                              v-text="ex2.slider"
                              style="font-weight: 700"
                            ></span>
                            %
                          </v-row>
                          <v-row>
                            报告成绩占比：
                            <span
                              v-text="100 - ex2.slider"
                              style="font-weight: 700"
                            ></span>
                            %
                          </v-row>
                        </v-container>
                      </v-col>

                      <v-col>
                        <v-btn color="green lighten-2" @click="confirm_bg_ps"
                          >确认修改</v-btn
                        >
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
                <v-card
                  flat
                  color="transparent"
                  class="mx-auto"
                  max-width="90%"
                >
                </v-card>
                <br /><v-divider></v-divider><br />

                <v-card
                  flat
                  class="mx-auto mb-8"
                  max-width="90%"
                  color="transparent"
                >
                  <h3 class="font-weight-black">请选择实习的专业</h3>
                  <v-radio-group v-model="selectedItem">
                    <v-row class="mt-1">
                      <v-radio
                        @click="dixin_mark"
                        :value="1"
                        label="地理信息科学"
                        class="ml-8"
                      >
                      </v-radio>

                      <v-radio
                        :value="2"
                        @click="
                          shengtai_mark
                        "
                        label="生态学"
                        class="ml-8"
                        checked
                      >
                      </v-radio>

                      <v-radio
                        :value="3"
                        @click="
                          cehui_mark
                         
                        "
                        label="测绘工程"
                        class="ml-8"
                      >
                      </v-radio>

                      <!-- 用于解决最后一个凹陷 -->
                      <v-radio v-show="false"> </v-radio>
                    </v-row>
                  </v-radio-group>
                </v-card>
                <v-card
                  v-show="dixin"
                  flat
                  class="mx-auto mb-8"
                  max-width="90%"
                  color="transparent"
                >
                  <!-- sliderbar -->
                  <v-row>
                    <v-col cols="10" class="mr-15">
                      <h3
                        class="font-weight-black"
                        style="font-size: 24px; margin-bottom: 20px"
                      >
                        报告成绩占比调节
                      </h3>
                      <v-row>
                        <v-col
                          cols="2"
                          class="text-right slider-labels"
                          style="color: grey"
                          >自然地理</v-col
                        >
                        <!-- 自然地理 -->
                        <v-col cols="10">
                          <v-card-text class="pt-0">
                            <v-slider
                              @change="initEcharts"
                              max="100"
                              min="0"
                              v-model="ex1.v1"
                              thumb-label="always"
                              ticks
                              tick-size="4"
                              class="align-start"
                            >
                              <template v-slot:append>
                                <v-text-field
                                  max="100"
                                  min="0"
                                  :rules="[
                                    rule.new_point_max,
                                    rule.new_point_min,
                                  ]"
                                  v-model="ex1.v1"
                                  class="mt-0 pt-0"
                                  hide-details
                                  single-line
                                  type="number"
                                  style="width: 60px"
                                  @change="initEcharts"
                                ></v-text-field>
                              </template>
                            </v-slider>
                          </v-card-text>
                        </v-col>
                      </v-row>
                      <!-- 人文地理 -->
                      <v-row>
                        <v-col
                          cols="2"
                          class="text-right slider-labels"
                          style="color: grey"
                          >人文与经济地理</v-col
                        >
                        <v-col cols="10">
                          <v-card-text class="pt-0">
                            <v-slider
                              @change="initEcharts"
                              max="100"
                              min="0"
                              v-model="ex1.v2"
                              thumb-label="always"
                              ticks
                              class="align-start"
                            >
                              <template v-slot:append>
                                <v-text-field
                                  max="100"
                                  min="0"
                                  :rules="[
                                    rule.new_point_max,
                                    rule.new_point_min,
                                  ]"
                                  v-model="ex1.v2"
                                  class="mt-0 pt-0"
                                  hide-details
                                  single-line
                                  type="number"
                                  style="width: 60px"
                                  @change="initEcharts"
                                ></v-text-field> </template
                            ></v-slider>
                          </v-card-text>
                        </v-col>
                      </v-row>
                      <!-- 地图学 -->
                      <v-row>
                        <v-col
                          cols="2"
                          class="text-right slider-labels"
                          style="color: grey"
                          >地图学</v-col
                        >
                        <v-col cols="10">
                          <v-card-text class="pt-0">
                            <v-slider
                              @change="initEcharts"
                              max="100"
                              min="0"
                              v-model="ex1.v3"
                              :rules="[rule.new_point_max, rule.new_point_min]"
                              thumb-label="always"
                              ticks
                            >
                              <template v-slot:append>
                                <v-text-field
                                  max="100"
                                  min="0"
                                  :rules="[
                                    rule.new_point_max,
                                    rule.new_point_min,
                                  ]"
                                  v-model="ex1.v3"
                                  class="mt-0 pt-0"
                                  hide-details
                                  single-line
                                  type="number"
                                  style="width: 60px"
                                  @change="initEcharts"
                                ></v-text-field>
                              </template>
                            </v-slider>
                          </v-card-text>
                        </v-col>
                      </v-row>
                      <!-- gis -->
                      <v-row>
                        <v-col
                          cols="2"
                          class="text-right slider-labels"
                          style="color: grey"
                          >地理信息系统原理</v-col
                        >
                        <v-col cols="10">
                          <v-card-text class="pt-0">
                            <v-slider
                              @change="initEcharts"
                              max="100"
                              min="0"
                              :rules="[rule.new_point_max, rule.new_point_min]"
                              v-model="ex1.v4"
                              thumb-label="always"
                              ticks
                            >
                              <template v-slot:append>
                                <v-text-field
                                  max="100"
                                  min="0"
                                  :rules="[
                                    rule.new_point_max,
                                    rule.new_point_min,
                                  ]"
                                  v-model="ex1.v4"
                                  class="mt-0 pt-0"
                                  hide-details
                                  single-line
                                  type="number"
                                  style="width: 60px"
                                  @change="initEcharts"
                                ></v-text-field> </template
                            ></v-slider>
                          </v-card-text>
                        </v-col>
                      </v-row>

                      <span
                        style="font-size: 24px; font-weight: bold; color: grey"
                        >当前比例总和<span
                          :style="{ color: exSum > 100 ? 'red' : (exSum < 100 ? 'orange' : 'green') }"
                          >{{ exSum }}</span
                        ></span
                      >
                    </v-col>
                  </v-row>
                  <!-- 确认修改按钮 -->
                  <v-row>
                    <v-btn color="green lighten-2 mx-5" @click="checkEx"
                      >确认修改</v-btn
                    >
                  </v-row>

                  <template>
                    <div
                      class="echart"
                      id="mychart"
                      :style="myChartStyle"
                      v-show="isDx"
                    ></div>
                  </template>
                </v-card>

                <!-- 确认各科占比的弹窗 -->
                <v-dialog v-model="dialog_2" max-width="500px">
                  <v-card>
                    <v-card-text>
                      <v-card-title> 请您确认最终成绩比例 </v-card-title>

                      <h4 class="grey--text">
                        自然地理占比：{{ this.ex1.v1 }}%
                      </h4>
                      <h4 class="grey--text">
                        人文与经济地理占比：{{ this.ex1.v2 }}%
                      </h4>
                      <h4 class="grey--text">地图学占比：{{ this.ex1.v3 }}%</h4>
                      <h4 class="grey--text">
                        地理信息系统原理占比：{{ this.ex1.v4 }}%
                      </h4>
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>

                      <v-btn
                        text
                        color="primary"
                        @click="
                          confirm_each_subj();
                          dialog_2 = false;
                        "
                      >
                        确认
                      </v-btn>
                      <v-btn text color="primary" @click="dialog_2 = false">
                        取消
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-card-subtitle
                  v-show="ex1v"
                  class="font-weight-black"
                  style="color: crimson"
                >
                  请您重新计算比例</v-card-subtitle
                >

                <!--为echarts准备一个容器dom-->

                <!-- 生态 -->
                <v-card
                  flat
                  class="mx-auto mb-8"
                  max-width="90%"
                  color="transparent"
                  v-show="shengtai"
                >
                  <h3 class="font-weight-black">报告成绩占比</h3>
                  <v-card-title>自然地理学：100%</v-card-title>
                </v-card>
                <!-- 测绘 -->
                <v-card
                  flat
                  class="mx-auto mb-8"
                  max-width="90%"
                  color="transparent"
                  v-show="cehui"
                >
                  <h3 class="font-weight-black">报告成绩占比</h3>
                  <v-card-title>地球科学概论：100%</v-card-title>
                </v-card>
              </div>

              <!-- 小组考核 -->
              <div v-show="num == 5">
                <!-- <v-spacer></v-spacer> <v-spacer></v-spacer>
                <v-spacer></v-spacer> -->
                <v-row>
                  <v-col cols="3" class="ml-5">
                    <v-text-field
                      v-model="AssessSearch"
                      append-icon="mdi-magnify"
                      label="搜索组长"
                      outlined
                      hide-details
                      dense
                    ></v-text-field
                  ></v-col>
                  <v-col>
                    <v-col>
                      已有<span style="color: green; font-weight: 700">{{
                        khansweredNum
                      }}</span
                      >组已回答问题<br />
                      还有<span style="color: red; font-weight: 700">{{
                        group_sum - khansweredNum
                      }}</span
                      >组未回答问题
                    </v-col>
                  </v-col>
                </v-row>
                <v-data-table
                  :headers="KH_headers"
                  :items="KH_desserts"
                  :items-per-page="10"
                  class="elevation-1 mx-5"
                  :search="AssessSearch"
                  :sort-by.sync="khsortBy"
                  :sort-desc.sync="khsortDesc"
                  @update:sort-by="khonSortByUpdated"
                  @update:sort-desc="khonSortDescUpdated"
                >
                  <!-- item 代表当前行的数据对象，它是 KH_desserts 数组中的指定的位置一个元素，是KH_desserts中的一个 -->
                  <!-- <template v-slot:item.actions="{ item }">,使得可以放各种自定义的icon-->
                  <template v-slot:item.actions="{ item }">
                    <v-icon small class="mr-2" @click="edit_khItem(item)">
                      mdi-pencil
                    </v-icon>
                  </template>
                  <template v-slot:item.answerStatus="{ item }">
                    <span
                      v-if="item.answerStatus == 0"
                      style="font-size: 20px; color: red"
                      >●</span
                    >
                    <span
                      v-if="item.answerStatus == 2"
                      style="font-size: 20px; color: greenyellow"
                      >●</span
                    >
                    <span
                      v-if="item.answerStatus == 1"
                      style="font-size: 18px; color: goldenrod"
                      >◖</span
                    >
                  </template>
                </v-data-table>

                <!-- 打分的弹窗 组成：
                  v-dialog>v-card>v-toolbar、v-card-text>v-container>v-row>v-col-->
                <v-dialog
                  v-model="kh_dialog"
                  fullscreen
                  hide-overlay
                  transition="dialog-bottom-transition"
                >
                  <v-card>
                    <div class="fixed-box">
                      <v-toolbar dark color="green">
                        <v-btn
                          icon
                          dark
                          @click="
                            kh_dialog = false
                            /* KHList(); */
                          "
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-toolbar-title
                          >第{{ g_id }}小组考核答案
                          <span
                            style="
                              margin-left: 20px;
                              color: rgb(255, 255, 255);
                              font-weight: 700;
                            "
                            >组长:{{ edited_khItem.leader }}</span
                          >
                        </v-toolbar-title>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                      <v-row justify="center">
                        <v-col cols="6" style="margin-right: -200px">
                          <v-card-text>
                            <!-- 一个容器 -->
                            <v-container>
                              <!-- 一行两列 -->
                              <v-text-field
                                v-model="edited_khItem.mark"
                                label="打分"
                                :rules="[
                                  rule.new_point_max,
                                  rule.new_point_min,
                                ]"
                                style="width: 200px; font-size: 25px"
                              ></v-text-field>
                            </v-container>
                          </v-card-text>
                        </v-col>

                        <v-col
                          cols="6"
                          class="mt-6"
                          style="margin-left: -400px"
                        >
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-card-actions
                              ><!--  -->
                              <v-spacer></v-spacer>
                              <div class="btn">
                                <v-btn
                                  color="green darken-1"
                                  text
                                  @click="khpre_group"
                                >
                                  上一组
                                </v-btn>
                                <v-btn
                                  color="green darken-1"
                                  text
                                  @click="khnext_group"
                                >
                                  下一组
                                </v-btn>
                                <v-btn
                                  color="green darken-1"
                                  text
                                  @click="kh_close"
                                >
                                  取消
                                </v-btn>
                                <v-btn
                                  color="green darken-1"
                                  text
                                  @click="kh_save"
                                >
                                  保存
                                </v-btn>
                              </div>
                            </v-card-actions>
                          </v-card-actions>
                        </v-col>
                      </v-row>
                    </div>

                    <v-container>
                      <!-- 答案们 -->
                      <!-- 将答案在dialog里面v-for展示 -->
                      <v-list :key="index" v-for="(item, index) in KH_ans">
                        <h3>{{ item.title }}</h3>
                        <span>*提交时间：</span
                        ><span style="color: green">{{ item.time }}</span
                        ><span>*</span>

                        <v-card-text class="text--secondary">
                          {{ item.answer }}
                        </v-card-text>

                        <v-divider :key="index" inset class="py-3"></v-divider>
                      </v-list>
                    </v-container>
                  </v-card>
                </v-dialog>
              </div>

              <!-- 成绩汇总 -->
              <div v-show="num == 3">
                <div style="height: 40px"></div>
                <v-toolbar dense flat>
                  <v-btn-toggle
                    v-model="toggle_exclusive1"
                    color="primary"
                    rounded
                    mandatory
                    group
                    @change="majority_change"
                  >
                    <v-btn value="giss"> 地理信息科学 </v-btn>
                    <v-btn value="ecologyy"> 生态学 </v-btn>
                    <v-btn value="cehuii"> 测绘工程 </v-btn>
                  </v-btn-toggle>
                  <v-row>
                    <v-btn
                      class="ma-5"
                      dark
                      color="rgb(102,187,106) "
                      @click="export_mark()"
                      >导出成绩
                    </v-btn>

                    <v-spacer></v-spacer> <v-spacer></v-spacer>
                    <v-spacer></v-spacer>

                    <v-col cols="3" class="ml-5">
                      <v-text-field
                        v-model="FinalScoreSearch"
                        append-icon="mdi-magnify"
                        label="搜索学生"
                        outlined
                        hide-details
                        dense
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-toolbar>
                <v-data-table
                  :headers="Mark_headers"
                  :items="Mark_desserts_3"
                  :items-per-page="10"
                  class="elevation-1 ma-5"
                  :search="FinalScoreSearch"
                >
                </v-data-table>
              </div>

              <!-- 往届成绩 -->
              <div v-show="num == 4">
                <div style="height: 40px"></div>

                <v-toolbar dense flat>
                  <v-btn-toggle
                    v-model="toggle_exclusive"
                    color="primary"
                    rounded
                    mandatory
                    group
                    @change="majority_change"
                  >
                    <v-btn value="gis"> 地理信息科学 </v-btn>
                    <v-btn value="ecology"> 生态学 </v-btn>
                    <v-btn value="cehui"> 测绘工程 </v-btn>
                  </v-btn-toggle>

                  <v-spacer></v-spacer>
                  <v-select
                    v-model="selected_season"
                    :items="ex_items"
                    label="选择年级"
                    @change="season_change"
                    dense
                    outlined
                    class="mt-7"
                    style="max-width: 200px"
                  ></v-select>
                </v-toolbar>

                <br /><br />
                <v-data-table
                  :headers="Mark_headers"
                  :items="Mark_desserts"
                  :items-per-page="10"
                  class="elevation-1 mx-5"
                ></v-data-table>
              </div>

              <!--  -->
            </div>
          </v-card>
        </div>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import ExportJsonExcel from "js-export-excel";
import * as XLSX from "xlsx";
import axios from "axios";
import * as echarts from "echarts";
import { mapState } from "vuex";
import fly2Vue from "../fly/fly2.vue";

export default {
  name: "StudentMark",
  data() {
    return {
      panels: [0, 1],
      /* 默认选择那个平时成绩item */
      MarkSelected: 0,
      ManageSelected: null,
      assessmentMap: null,
      psfiles: null,
      FinalScoreSearch: "",
      ThoughSearch: "",
      psScoreSearch: "",
      AssessSearch: "",

      selectedItem: "",
      model: 0,
      num: 1,
      dialog_1: false,
      dialog_2: false,
      selected_season: "2022年",
      //往届成绩的
      toggle_exclusive: '',
      //成绩汇总的
      toggle_exclusive1: '',
      new_name: "",
      new_point: "",
      mfiles: null,
      rule: {
        new_point_max: (v) => v <= 100 || "只能小于100",
        new_point_min: (v) => 0 <= v || "不能小于0",
        len: (v) => v.length > 0 || "不能为空",
      },
      Is100: (v) => v == 100 || "值必须是100",
      /* 数据说明：excel_headers和excel_items（表格的每一行）是一对儿 
          通过getPerformance获得数据*/
      excel_headers: [
        { text: "学号", value: "学号", vnum: "", width: "60px" },
        { text: "姓名", value: "姓名", vnum: "", width: "75px" },
        { text: "组号", value: "组号", vnum: "", width: "75px" },
        { text: "平时成绩", value: "平时成绩", vnum: "", width: "100px" },
        { text: "打卡点数量", value: "打卡点数量", vnum: "", width: "110px" },
        {
          text: "打卡点得分",
          value: "打卡点得分",
          vnum: "10",
          prenum: "",
          width: "110px",
        },
        { text: "学习时长", value: "学习时长", vnum: "", width: "100px" },
        {
          text: "学习时长得分",
          value: "学习时长得分",
          vnum: "10",
          prenum: "",
          width: "125px",
        },
        {
          text: "回答问题",
          value: "回答问题",
          vnum: "30",
          prenum: "",
          width: "100px",
        },
        {
          text: "公共事务",
          value: "公共事务",
          vnum: "20",
          prenum: "",
          width: "100px",
        },
        {
          text: "小组考核",
          value: "小组考核",
          vnum: "30",
          prenum: "",
          width: "100px",
        },
        { text: "组长评分", value: "组长评分", vnum: "", width: "100px" },
      ],
      excel_mark: [],
      t_mark: [],
      excel_items: [],
      ex2: { min: 0, max: 100, slider: this.normalP },

      ex1v: false,
      //下面那个echarts是否展示
      isDx: false,
      //展示哪个card
      dixin: false,
      shengtai: false,
      cehui: false,

      ex1: {},
      myChart: {},
      pieData: [
        {
          value: 25,
          name: "自然地理",
        },
        {
          value: 25,
          name: "人文与经济地理",
        },
        {
          value: 30,
          name: "地图学",
        },
        {
          value: 20,
          name: "地理信息系统原理",
        },
      ],
      pieName: [],
      myChartStyle: { width: "1000px", height: "350px" }, //图表样式
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

        { text: "查看实习感想", value: "查看实习感想", sortable: false },
        { text: "提交状态", value: "answerStatus" },
        { text: "提交时间", value: "submitDate" },
      ],
      S_desserts: [], //实习组员名单
      snack: false,
      snackColor: "",
      snackText: "",
      // max5chars: (v) => v.length <= 4 || "输入有误",
      pagination: {},
      Mark_headers: [
        { text: "学号", value: "id" },
        { text: "姓名", value: "name" },
        { text: "班级", value: "class" },
        { text: "组号", value: "group" },
        {
          text: "报告成绩",
          align: "start",
          sortable: true,
          value: "bg_mark",
        },
        {
          text: "平时成绩",
          align: "start",
          sortable: true,
          value: "ps_mark",
        },
        {
          text: "最终成绩",
          align: "start",
          sortable: true,
          value: "fina_mark",
        },
      ],
      Mark_desserts: [],
      Mark_desserts_3: [],
      ex_items: ["2022年", "2021年", "2020年"],
      enabled: [],
      oldscore: "",
      newscore: "",
      enabledv1: false,
      enabledv2: false,
      enabledv3: false,
      enabledv4: false,
      // 小组考核
      kh_dialog: false,
      edited_khIndex: -1,
      //text是列名，value是对应的items中该键的值
      KH_headers: [
        {
          text: "组号",
          //左对齐
          align: "start",
          value: "id",
        },
        { text: "组长", value: "leader" },
        { text: "作答成绩", value: "mark" },
        //actions表示他是个交互的按钮
        { text: "查看并打分", value: "actions", sortable: false },
        { text: "作答状态", value: "answerStatus" },
      ],
      g_id: "",
      KH_desserts: [], //考核问题
      khsortBy: "defaultColumn", // 默认或当前排序列名
      khsortDesc: false, // 排序方向，false 表示升序，true 表示降序
      gxsortBy: "defaultColumn", // 默认或当前排序列名
      gxsortDesc: false, // 排序方向，false 表示升序，true 表示降序
      KH_ans: [],
      edited_khItem: {
        id: 1,
        mark: 10,
        leader: "",
      },
      //往届成绩，请求当前专业的学生成绩
      current_marjority: "gis",
      //成绩汇总，请求当前专业的学生名单
      current_marjority_1: "giss",
      current_season: "22",
      thought_index: -1,
      gxansweredNum: 0,
      stu_sum: 0,
      group_sum: 0,
      khansweredNum: 0,
      stuGrade: null,
      majority: "",
    };
  },
  components: {},
  mounted() {
    this.getPercentage();

    this.initDate(); //数据初始化
    this.initEcharts();
    this.em();
    this.isThought();
  },

  computed: {
    sum() {
      let total = 0;
      for (let i = 0; i < this.excel_mark.length; i++) {
        total += this.excel_mark[i].vnum * 1;
      }
      return total;
    },
    exSum() {
      return this.ex1.v1 + this.ex1.v2 + this.ex1.v3 + this.ex1.v4;
    },
    ...mapState([
      "status",
      "thoughtList",
      "ditu",
      "renwen",
      "gis",
      "nature",
      "reportP",
      "normalP",
    ]),
  },
  watch: {
    /* ex1: {
      handler(newVal) {
        console.log(newVal);
        if (this.ex1.v1 + this.ex1.v2 + this.ex1.v3 + this.ex1.v4 > 100)
          this.ex1v = true;
        else this.ex1v = false;

        this.initEcharts();
      },
      deep: true,
      immediate: true,
    },
    "ex1.v1"(n, o) {
      this.oldscore = o;
      this.newscore = n;
      let sc = Math.round((this.newscore - this.oldscore) / 3);
      this.ex1.v2 = this.ex1.v2 - sc;
      this.ex1.v3 = this.ex1.v3 - sc;
      this.ex1.v4 = 100 - this.ex1.v1 - this.ex1.v2 - this.ex1.v3;
      if (this.ex1.v1 == 100) {
        this.ex1.v2 = 0;
        this.ex1.v3 = 0;
        this.ex1.v4 = 0;
        // alert('请问您确认将单个科目比例调节至100%吗？')
      }
    },
    "ex1.v2"(n, o) {
      this.oldscore = o;
      this.newscore = n;
      let sc = Math.round((this.newscore - this.oldscore) / 2);

      if (this.ex1.v3 == 0 && this.ex1.v4 == 0) {
        this.ex1.v1 = this.ex1.v1 - sc;
      } else {
        this.ex1.v3 = this.ex1.v3 - sc;
        this.ex1.v4 = 100 - this.ex1.v1 - this.ex1.v2 - this.ex1.v3;
      }
      if (this.ex1.v2 == 100) {
        this.ex1.v1 = 0;
        this.ex1.v3 = 0;
        this.ex1.v4 = 0;
        // alert('请问您确认将单个科目比例调节至100%吗？')
      }
    },
    "ex1.v3"(n, o) {
      this.oldscore = o;
      this.newscore = n;
      if (this.ex1.v4 != 0) {
        this.ex1.v4 = 100 - this.ex1.v1 - this.ex1.v2 - this.ex1.v3;
      } else if (this.ex1.v2 != 0) {
        this.ex1.v2 = 100 - this.ex1.v1 - this.ex1.v4 - this.ex1.v3;
      } else if (this.ex1.v1 != 0) {
        this.ex1.v1 = 100 - this.ex1.v2 - this.ex1.v4 - this.ex1.v3;
      }
      if (this.ex1.v3 == 100) {
        this.ex1.v2 = 0;
        this.ex1.v1 = 0;
        this.ex1.v4 = 0;
        // alert('请问您确认将单个科目比例调节至100%吗？')
      }
    },
    "ex1.v4"(n, o) {
      this.oldscore = o;
      this.newscore = n;
      if (this.ex1.v3 != 0)
        this.ex1.v3 = 100 - this.ex1.v1 - this.ex1.v2 - this.ex1.v4;
      else if (this.ex1.v2 != 0)
        this.ex1.v2 = 100 - this.ex1.v1 - this.ex1.v4 - this.ex1.v3;
      else if (this.ex1.v1 != 0)
        this.ex1.v1 = 100 - this.ex1.v2 - this.ex1.v4 - this.ex1.v3;

      if (this.ex1.v4 == 100) {
        this.ex1.v2 = 0;
        this.ex1.v3 = 0;
        this.ex1.v1 = 0;
        // alert('请问您确认将单个科目比例调节至100%吗？')
      }
    }, */
  },
  async created() {
    this.loadSlist();
    await this.commonMark();

    await this.KHList();
    this.isAnswer();
  },
  methods: {
    async getPercentage() {
      await this.$store.dispatch("getConfig");
      this.ex1 = {
        v1: this.nature,
        v2: this.renwen,
        v3: this.ditu,
        v4: this.gis,
      };
      this.ex2.slider = this.normalP;
      console.log('normal',this.ex2.slider);
      
      console.log(this.ditu, this.gis, this.nature, this.reportP, this.ex1);
    },
    khonSortByUpdated(newSortBy) {
      console.log("new", newSortBy);
      this.khsortBy = newSortBy;
      this.khsortItems(); // 自定义的排序函数
    },
    khonSortDescUpdated(newSortDesc) {
      this.khsortDesc = newSortDesc;
      this.khsortItems(); // 自定义的排序函数
    },
    gxonSortByUpdated(newSortBy) {
      this.gxsortBy = newSortBy;
      this.gxsortItems(); // 自定义的排序函数
    },
    gxonSortDescUpdated(newSortDesc) {
      this.gxsortDesc = newSortDesc;
      this.gxsortItems(); // 自定义的排序函数
    },
    khsortItems() {
      console.log("调kh");
      // 一个简单的排序例子，根据 sortBy 和 sortDesc 对 items 进行排序
      this.KH_desserts.sort((a, b) => {
        if (this.khsortDesc) {
          return a[this.khsortBy] < b[this.khsortBy] ? 1 : -1;
        } else {
          return a[this.khsortBy] > b[this.khsortBy] ? 1 : -1;
        }
      });
    },
    gxsortItems() {
      console.log("gx", this.gxsortDesc);
      // 一个简单的排序例子，根据 sortBy 和 sortDesc 对 items 进行排序
      this.S_desserts.sort((a, b) => {
        if (this.gxsortDesc) {
          return a[this.gxsortBy] < b[this.gxsortBy] ? 1 : -1;
        } else {
          return a[this.gxsortBy] > b[this.gxsortBy] ? 1 : -1;
        }
      });
      console.log("调gx", this.S_desserts);
    },
    async isThought() {
      await this.$store.dispatch("getAllThought");
      this.S_desserts.forEach((item) => {
        for (let i = 0; i < this.thoughtList.length; i++) {
          if (item.id == this.thoughtList[i].stu_id) {
            item.answerStatus = 1;
            item.submitDate = this.thoughtList[i].date
              .split(".")[0]
              .replace("T", " ");
            this.gxansweredNum++;
            break;
          }
          item.answerStatus = 0;
          this.gxnoAnswer++;
        }
      });
    },
    handleClick(category) {
      if (category == "MarkSelected") this.ManageSelected = null;
      else if (category == "ManageSelected") this.MarkSelected = null;
    },
    async isAnswer() {
      await this.$store.dispatch("getAllGroupAnswer");
      console.log("status", this.status);
      /* 
        连续派发的处理，已废
        this.AllAssess.forEach((item) => {
        this.KH_desserts[item.id].answerStatus = true;
        console.log("id", item.id, this.KH_desserts);
      }); */
      /* KH_desserts的id跟索引一致，status的group_id是乱序 */
      this.status.forEach((item) => {
        this.KH_desserts[item.group_id].answerStatus = item.assessment_status;
        if (item.assessment_status == 2 || item.assessment_status == 1)
          this.khansweredNum++;
        /* if(item.assessment_status!=0)
        {
          this.KH_desserts[item.group_id].submitDate=item.date.split(".")[0].replace("T", " ");
        } */
      });
    },
    season_change(e) {
      let t = e.replace("年");
      this.current_season = t.substring(2, 4);
      this.finalMark();
    },
    majority_change(e) {
      if (this.num == 4) this.current_marjority = e;
      else if (this.num == 3) {
        this.current_marjority_1 = e;
        console.log('toggle_exclusive',this.toggle_exclusive);
        
      }
      this.finalMark();
    },
    /* 考虑合并，将isLeader和是否为组长传过去，item[string] */
    psmarkLeader(item) {
      return item.isLeader == "是" ? "leader-row" : "";
    },
    gxmarkLeader(item) {
      return item.是否为组长 == "是" ? "leader-row" : "";
    },
    /* 考虑合并，写成更通用的函数
      传入index和数组，并且loadReport也要修改，在loadReport内部获取当前元素在数组中的索引
      findIndex
    */
    khpre_group() {
      if (this.edited_khIndex > 0) {
        //评分、评语减一
        this.edited_khIndex--;
        // 更新下一组的报告数据
        this.loadReport(this.edited_khIndex);
      } else {
        alert("已经是第一组了");
        // 或者循环到最后一组
        // this.edited_bgIndex = this.BG_desserts.length;
      }
    },
    gxpre_group() {
      if (this.thought_index > 0) {
        this.thought_index--;
        this.check_thought(this.S_desserts[this.thought_index]);
      } else alert("已经是第一组了");
    },
    khnext_group() {
      if (this.edited_khIndex < this.KH_desserts.length - 1) {
        this.edited_khIndex++;
        this.loadReport(this.edited_khIndex);
      } else {
        alert("已经是最后一组");
        // 或者循环到第一组
        // this.edited_bgIndex = 0;
      }
    },
    gxnext_group() {
      if (this.thought_index < this.S_desserts.length - 1) {
        this.thought_index++;
        this.check_thought(this.S_desserts[this.thought_index]);
      } else {
        alert("已经是最后一组");
        // 或者循环到第一组
        // this.edited_bgIndex = 0;
      }
    },
    loadReport(i) {
      this.edit_khItem(this.KH_desserts[i]);
    },

    up_psscore(e) {
      axios({
        method: "post",
        url: "https://danxiagis.top:8081/teacher/changeOneStudentRegularScoreCriteria",
        params: {
          stu_id: e.学号,
          CheckPointScore: e.打卡点得分,
          StudyTimeScore: e.学习时长得分,
          Publicaffairs: e.公共事务,
          Answerquestion: e.回答问题,

          assessmentNumber: e.小组考核,

          group_id: e.组号,
        },
      }).then((res) => {
        console.log(res);
        this.commonMark();
        this.finalMark();
      });
    },
    isOpen(val) {
      if (val) {
        /* 将修改前的值存储下来 */
        for (let i = 0; i < this.excel_mark.length; i++) {
          this.excel_mark[i].prenum = this.excel_mark[i].vnum;
        }
      }
    },
    cancel_each_part() {
      this.dialog_1 = false;
      for (let i = 0; i < this.excel_mark.length; i++) {
        this.excel_mark[i].vnum = this.excel_mark[i].prenum;
      }
    },
    confirm_each_part() {
      if (this.sum != 100) {
        alert("请检查您的比例");
        return;
      }

      axios({
        method: "post",
        url: "https://danxiagis.top:8081/teacher/updateConfig2",
        params: {
          PublicAffairs: this.excel_mark[3].vnum,
          AnswerQuestion: this.excel_mark[2].vnum,
          CheckPointNum: this.excel_mark[0].vnum,
          Assessment: this.excel_mark[4].vnum,
          Studytime: this.excel_mark[1].vnum,
        },
      }).then((res) => {
        this.dialog_1 = false;
        alert("比例修改成功!");
        console.log(res);
      });
    },
    confirm_bg_ps() {
      axios({
        method: "post",
        url: "https://danxiagis.top:8081/teacher/updateConfig3", //
        params: {
          NormalPerformance: this.ex2.slider,
          ReportPerformance: 100 - this.ex2.slider,
        },
      }).then((res) => {
        console.log(res);
        this.finalMark();

        alert("修改占比成功");
      });
    },
    confirm_each_subj() {
      let natural = 0;
      let Cartography = 0;
      let Humanities = 0;
      let GIS = 0;
      console.log("sele", this.selectedItem);
      if (this.selectedItem == 2) {
        this.ex1.v2=0
        this.ex1.v3=0
        this.ex1.v4=0
        this.ex1.v1=100
        natural = 100;
      } else if (this.selectedItem == 1) {
        natural = this.ex1.v1;
        Cartography = this.ex1.v3;
        Humanities = this.ex1.v2;
        GIS = this.ex1.v4;
      } else if (this.selectedItem == 3) {
        this.ex1.v2=0
        this.ex1.v3=0
        this.ex1.v4=0
        this.ex1.v1=100
        natural = 100;
      }
      axios({
        method: "post",
        url: "https://danxiagis.top:8081/teacher/updateConfig1",
        params: {
          natural,
          Cartography,
          Humanities,
          GIS,
        },
      }).then((res) => {
        this.initEcharts();
        alert("修改成功");
        this.finalMark();
      });
    },
    checkEx() {
      if (this.exSum > 100) {
        alert("占比总和超过100，请重新选择");
      } else if (this.exSum < 100) {
        alert("占比总和不足100，请重新选择");
      } else {
        this.dialog_2 = true;
      }
    },
    dixin_mark() {
      axios({
        method: "get",
        url: "https://danxiagis.top:8081/teacher/getConfiguration", //http://danxiagis.top:3000/ui/teacher/getConfiguration
      })
        .then((response) => {
          let res = response.data;
          // let Arry = []
          console.log(res);
          res.forEach((data) => {
            if (data.key == "Cartography") this.ex1.v3 = data.value;
            else if (data.key == "Humanities") this.ex1.v2 = data.value;
            else if (data.key == "GIS") this.ex1.v4 = data.value;
            else if (data.key == "natural") this.ex1.v1 = data.value;
          });
          this.isDx = true;
          this.cehui = false;
          this.dixin = true;
          this.shengtai = false;
          this.initEcharts();
        })
        .catch((error) => {
          console.log(error);
          // alert("请求出错了");
        });
    },
    cehui_mark() {
      this.selectedItem = 3;
      this.confirm_each_subj();
      this.cehui = true;
      this.dixin = false;
      this.shengtai = false;
      this.isDx = false;
    },
    shengtai_mark() {
      this.selectedItem = 2;
      this.confirm_each_subj();
      this.shengtai = true;
      this.isDx = false;
      this.dixin = false;
      this.cehui = false;
    },
    // 取最大值
    max(obj) {
      let arr = Object.values(obj);
      let max = arr[0];
      arr.forEach((item) => (max = item > max ? item : max));
      for (let i in obj) {
        if (obj[i] == max) {
          return i;
        }
      }
    },
    ifLeader() {
      //从studentInfo中用兄弟间组件通信传过来更好，但是我忘记怎么用了，所以再调一次studentList
      axios({
        method: "get",
        url: "https://danxiagis.top:8081/login/smallWeb/getStudentList",
      }).then((response) => {
        let res = response.data;
        console.log("???ssss", res);
        for (let i = 0; i < res.length; i++) {
          for (let j = 0; j < this.excel_items.length; j++) {
            if (this.excel_items[j].学号 == res[i].stu_id)
              this.excel_items[j].isLeader = res[i].isleader;
          }
        }
      });
    },
    loadSlist() {
      axios({
        method: "get",
        url: "https://danxiagis.top:8081/login/smallWeb/getStudentList",
      }).then((response) => {
        let res = response.data;
        this.stu_sum = res.length;
        // console.log(res)
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

        this.stuGrade = this.S_desserts[res.length - 1].班级.substring(0, 2);
        let text = res[0].class_name;

        this.majority = text.match(/\d+([^\d]+)\d+/)[1];
        console.log("text", this.majority);
        if (this.majority == "生态") {
          this.selectedItem = 2;
          this.shengtai = true;
          this.current_marjority_1='ecologyy'
          this.current_marjority='ecology'
          //往届成绩的toggle
          this.toggle_exclusive='ecology'
          //成绩汇总的toggle
         this.toggle_exclusive1='ecologyy'
        } else if (this.majority == "地理信息科学") {
          this.selectedItem = 1;
          this.isDx = true;
          this.dixin = true;
          this.current_marjority_1='giss'
          this.current_marjority='gis'
        } else if (this.majority == "测绘工程") {
          this.selectedItem = 3;
          this.cehui = true;
          this.current_marjority_1='cehuii'
          this.current_marjority='cehui'
        }
        console.log("ths", this.selectedItem);
      });
    },
    check_thought(item) {
      //this.person_index = item;
      this.person_dialog = true;
      this.item_name = item.姓名;
      this.thought_index = this.S_desserts.findIndex(
        (dessert) => dessert === item
      );

      //个人实习感想
      axios({
        method: "get",
        url: "https://danxiagis.top:8081/assessment/getOneGroupThought", //http://danxiagis.top:3000/ui/teacher/GetOneGroupThought
        params: {
          group_id: item.组别,
        },
      })
        .then((response) => {
          let res = response.data;
          if (res) this.item_text = "";

          for (let a = 0; a < res.length; a++) {
            console.log(a);
            console.log(item.id, res[a].stu_id);
            if (res[a].stu_id == item.id) {
              console.log(res[a].stu_id == item.id);
              this.item_text = res[a].though;
              break;
            } //组里这个人为空
            else this.item_text = "";
          }
        })
        .catch((error) => {
          console.log(error);
          // alert("请求出错了");
        });
    },
    // 平时成绩
    commonMark() {
      return axios({
        method: "get",
        url: "https://danxiagis.top:8081/teacher/getPerformance",
      })
        .then((response) => {
          console.log("@@@@", response.data);
          let res = response.data;
          let Arry = [];
          this.excel_items = [];
          // console.log(res)
          for (let a = 0; a < res.length; a++) {
            let arry = {
              学号: res[a].stu_id,
              姓名: res[a].name,
              组号: res[a].group_id,
              平时成绩: res[a].regularperformance.toFixed(2),
              打卡点数量: res[a].checkpointnum,
              打卡点得分: res[a].checkPointScore,
              学习时长: res[a].study_time,
              学习时长得分: res[a].studyTimeScore,
              回答问题: res[a].answerquestion,
              公共事务: res[a].publicaffairs,
              小组考核: res[a].assessmentNumber,
              组长评分: res[a].leaderScoring,
              isLeader: false,
            };
            // 创建映射
            this.assessmentMap = new Map();
            res.forEach((item) => {
              // 使用小组ID作为键，assessmentNumber作为值，将每一组的打分映射到assessmentMap中去
              this.assessmentMap.set(item.group_id, item.assessmentNumber);
            });
            Arry.push(arry);
          }

          Arry.sort((a, b) => a.学号 - b.学号);
          this.excel_items = Arry;
          this.ifLeader();
        })
        .catch((error) => {
          console.log(error.data);
          // alert("请求出错了");
        });
    },
    em() {
      let len = this.excel_headers.length;
      for (let i = 0; i < len; i++) {
        if (this.excel_headers[i].vnum > 0) {
          // console.log(this.excel_headers[i])
          //excel_mark存储了平时成绩条目和占比
          console.log(i);
          this.excel_mark.push(this.excel_headers[i]);
        }
      }
      /* //将字符串转为number
      for(let j=0;j<this.excel_mark.length;j++)
        this.excel_mark[j].vnum=Number(this.excel_mark[j].vnum)
      
      console.log('mark',this.excel_mark); */
    },
    // 导入平时成绩评分表格
    input_psexcel() {
      let psex = [];
      let ps_headers = [];
      for (let i = 0; i < this.excel_headers.length - 1; i++) {
        ps_headers.push(this.excel_headers[i].value);
      }
      // console.log(ps_headers)
      if (this.psfiles == null) {
        alert("请选择文件");
        return;
      }

      let formData = new FormData();
      formData.append("file", this.psfiles);
      axios({
        method: "post",
        url: "https://danxiagis.top:8081/teacher/uploadStudentsRegularPerformance",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data", // 确保设置正确的Content-Type
        },
      })
        .then((res) => {
          alert(res.data);
          // 获取数据
          this.excel_items = [];
          //let jsonData = {}
          let reader = new FileReader();
          //操作后的结果储存在reader的result属性中，
          //是一个 ArrayBuffer 对象，代表文件的原始二进制数据
          reader.readAsArrayBuffer(this.psfiles);
          reader.onload = function () {
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
            for (let m of jsonData) {
              psex.push(m);
            }
          };
          this.excel_items = psex;
        })
        .catch((err) => {
          alert(err.data);
        });
    },
    /* // 添加评分项
    add_new_m() {
      const newin = {};
      if(this.new_name == ""){
        alert("评分项名称不能为空")
        return
      }
      for(let a=0;a<this.excel_headers.length;a++){
        if(this.new_name == this.excel_headers[a].text){
        alert("该评分项已存在")
        return
      }
      }
      newin.text = this.new_name;
      newin.vnum = this.new_point;
      newin.value = this.new_name;
      this.excel_mark.push(newin);
      this.excel_headers.push(newin);
     
    },
    */
    // 删除表格项
    logggg(e) {
      console.log("???????", e.target);
    },
    dele_point(e) {
      // console.log(this.excel_mark[i])
      console.log("eeeeeeeee", e);
      /* if(e.vnum==0)
        this.excel_mark.splice(e,1) 
        现在的问题是，当为0时那个框里面的也消失了，我只要那个消失，设置一个t变量
      */

      /* let de = this.excel_mark[i].text
      for(let a=0;a<this.excel_headers.length;a++){
         if(this.excel_headers[a].text == de){
          this.excel_headers.splice(a,1)
         }
      }
      this.excel_mark.splice(i,1) */
    },
    /*  // 设置判断表格是否能删除
      nesseccry_item(i){
        let text = this.excel_mark[i].text
        if(text=="打卡点数量"||text=="学习时长"){
          return false
        }else{
          return true
        }
      }, */
    // 导出评分模板excel
    exportExcel() {
      const col_name = [];
      //将列名存到数组里
      for (let i = 0; i < this.excel_headers.length - 1; i++) {
        col_name.push(this.excel_headers[i].text);
      }
      // console.log(col_name)
      let option = {}; //option代表的就是excel文件

      option.filename = "样式表"; //excel文件名

      //excel文件数据，配置属性
      option.datas = [
        {
          //excel文件的数据源
          sheetData: this.excel_items,
          //excel文件sheet的表名
          sheetName: "sheet",
          //excel文件表头名
          sheetHeader: col_name,
          //excel文件列名
          sheetFilter: col_name,
        },
      ];
      //创建ExportJsonExcel实例对象
      let toExcel = new ExportJsonExcel(option);
      console.log("excel", toExcel);
      //调用保存方法
      toExcel.saveExcel();
    },
    // 图表
    initDate() {
      for (let i = 0; i < this.pieData.length; i++) {
        // this.xData[i] = i;
        // this.yData =this.xData[i]*this.xData[i];
        this.pieName[i] = this.pieData[i].name;
      }
    },
    initEcharts() {
      // 饼图

      const option = {
        legend: {
          // 图例
          data: this.pieName,
          right: "10%",
          top: "30%",
          orient: "vertical",
        },
        title: {
          // 设置饼图标题，位置设为顶部居中
          text: "报告成绩组成示意图",
          top: "0%",
          left: "center",
        },
        series: [
          {
            type: "pie",
            label: {
              show: true,
              formatter: "{b} : {c} ({d}%)", // b代表名称，c代表对应值，d代表百分比
            },
            radius: "50%", //饼图半径
            data: [
              {
                value: this.ex1.v1,
                name: "自然地理",
              },
              {
                value: this.ex1.v2,
                name: "人文与经济地理",
              },
              {
                value: this.ex1.v3,
                name: "地图学",
              },
              {
                value: this.ex1.v4,
                name: "地理信息系统原理",
              },
              /* {
                value:this.ex1.v4,
                name: "地理信息系统原理",
              }, */
            ],
          },
        ],
      };

      this.myChart = echarts.init(document.getElementById("mychart"));
      this.myChart.setOption(option);
      console.log(this.ex1.v4, this.ex1.v3, this.ex1.v2, this.ex1.v1);

      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        this.myChart.resize();
      });
    },

    // 学生成绩
    Mark_save() {
      this.snack = true;
      this.snackColor = "success";
      this.snackText = "数据修改完毕";
    },
    Mark_cancel() {
      this.snack = true;
      this.snackColor = "error";
      this.snackText = "取消";
    },
    Mark_open() {
      this.snack = true;
      this.snackColor = "info";
      this.snackText = "修改数据";
    },
    Mark_close() {
      console.log("Dialog closed");
    },
    //导入成绩名单excel
    input_mexcel() {
      let stu_mark = [];
      if (this.mfiles == null) {
        alert("请选择文件");
        return;
      }
      // 获取数据
      this.Mark_desserts = [];
      //let jsonData = {}
      let reader = new FileReader();
      reader.readAsArrayBuffer(this.mfiles);
      reader.onload = () => {
        const data = new Uint8Array(reader.result);
        console.log("daaaa", data);
        const workbook = XLSX.read(data, { type: "array" });
        // 假设你的数据在第一张表
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // 将工作表转换为JSON，
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log("jssssssss", jsonData);

        for (let stu of jsonData) {
          let obj = {
            id: stu.学号,
            name: stu.姓名,
            class: stu.班级,
            group: stu.组号,
            bg_mark: stu.报告成绩,
            ps_mark: stu.平时成绩,
            fina_mark: stu.最终成绩,
          };
          stu_mark.push(obj);
        }
      };
      this.Mark_desserts = stu_mark;
    },
    // 导出汇总成绩
    export_mark() {
      const dataList = this.Mark_desserts_3;

      const col_name = [];
      for (let a = 0; a < this.Mark_headers.length; a++) {
        col_name.push(this.Mark_headers[a].text);
      }
      // console.log(col_name)
      let option = {}; //   option代表的就是excel文件

      let dataTable = []; //   dataTable代表excel文件中的数据内容
      if (dataList) {
        for (let m in dataList) {
          console.log(dataList[m]);
          let obj = {
            学号: dataList[m].id,
            姓名: dataList[m].name,
            班级: dataList[m].class,
            组号: dataList[m].group,
            报告成绩: dataList[m].bg_mark,
            平时成绩: dataList[m].ps_mark,
            最终成绩: dataList[m].fina_mark,
          };
          dataTable.push(obj);
        }
      }
      option.filename = "final"; //excel文件名

      //excel文件数据
      option.datas = [
        {
          //   excel文件的数据源
          sheetData: dataTable,
          //   excel文件sheet的表名
          sheetName: "sheet",
          //   excel文件表头名
          sheetHeader: col_name,
          //   excel文件列名
          sheetFilter: col_name,
        },
      ];
      //   创建ExportJsonExcel实例对象
      let toExcel = new ExportJsonExcel(option);
      //   调用保存方法
      toExcel.saveExcel();
    },
    //成绩加载

    // 调节成绩滑块
    // change(){

    //   let i = 0;
    //   const a =[];
    //   const b = [];
    //   const _b=[1,2,3,4];
    //   if(this.enabledv1==true){
    //     i++;
    //     a.push(this.ex1.v1)
    //     b.push(1)
    //   }
    //   if(this.enabledv2==true){
    //     i++;
    //     a.push(this.ex1.v2)
    //     b.push(2)
    //   }
    //   if(this.enabledv3==true){
    //     i++;
    //     a.push(this.ex1.v3)
    //     b.push(3)
    //   }
    //   if(this.enabledv4==true){
    //     i++;
    //     a.push(this.ex1.v4)
    //     b.push(4)
    //   }
    //   let _i = 4-i;
    //   let m = 0;
    //   for(let n in a){
    //    m=m+a[n]
    //    if(m>100)
    //    {this.ex1v=true}
    //    else{
    //     this.ex1v=false
    //    }
    //   }
    //   const b1 = _b.filter(item1 => !b.some(item2 => item2 === item1))
    //   const a1 = Math.round((100-m)/_i)
    //  while(_i>=0){
    //   if(b1[_i]==1){
    //     this.ex1.v1 =a1
    //   }
    //   if(b1[_i]==2){
    //     this.ex1.v2 =a1
    //   }
    //   if(b1[_i]==3){
    //     this.ex1.v3 =a1
    //   }
    //   if(b1[_i]==4){
    //     this.ex1.v4 =a1
    //   }
    //   _i--;
    //  }
    //  let sum =0;
    //   for(let k in this.ex1){
    //   sum= this.ex1[k]+sum;
    //   }

    //   if(sum>100){
    //   sum=Math.abs(sum-100)
    //   this.ex1.v4 = this.ex1.v4-sum
    //   }else if(sum<100)
    //   {
    //   sum=Math.abs(sum-100)
    //   this.ex1.v4 = this.ex1.v4+sum
    //   }
    //  },
    change() {},
    //  最终成绩
    finalMark() {
      axios({
        method: "get",
        url: "https://danxiagis.top:8081/teacher/getPerformance", //https://danxiagis.top:8081/teacher/getPerformance
      })
        .then((response) => {
          let res = response.data;
          let Arry = [];
          let differ_stu = [];
          let same_season = [];
          for (let i = 0; i < res.length; i++) {
            /* console.log('now',this.current_season); */
            if (
              this.num == 4 &&
              res[i].class_name.substring(0, 2) == this.current_season
            )
              same_season.push(res[i]);
            else if (
              this.num == 3 &&
              res[i].class_name.substring(0, 2) == this.stuGrade
            )
              same_season.push(res[i]);
          }

          for (let i = 0; i < same_season.length; i++) {
            if (this.num == 4) {
              if (
                this.current_marjority == "gis" &&
                same_season[i].class_name.substring(2, 4) == "地信"
              )
                differ_stu.push(same_season[i]);
              else if (
                this.current_marjority == "ecology" &&
                same_season[i].class_name.substring(2, 4) == "生态"
              )
                differ_stu.push(same_season[i]);
              else if (
                this.current_marjority == "cehui" &&
                same_season[i].class_name.substring(2, 4) == "测绘"
              )
                differ_stu.push(same_season[i]);
            } else if (this.num == 3) {
              if (
                this.current_marjority_1 == "giss" &&
                same_season[i].class_name.substring(2, 4) == "地信"
              )
                differ_stu.push(same_season[i]);
              else if (
                this.current_marjority_1 == "ecologyy" &&
                same_season[i].class_name.substring(2, 4) == "生态"
              )
                differ_stu.push(same_season[i]);
              else if (
                this.current_marjority_1 == "cehuii" &&
                same_season[i].class_name.substring(2, 4) == "测绘"
              )
                differ_stu.push(same_season[i]);
            }
          }

          for (let a = 0; a < differ_stu.length; a++) {
            let arr = {
              id: differ_stu[a].stu_id,
              name: differ_stu[a].name,
              class: differ_stu[a].class_name,
              group: differ_stu[a].group_id,
              bg_mark: differ_stu[a].reportTotalScore,
              ps_mark: differ_stu[a].regularperformance.toFixed(2),
              fina_mark: differ_stu[a].performance.toFixed(2),
            };
            Arry.sort((a, b) => a.id - b.id);
            Arry.push(arr);
          }
          console.log("333", Arry);
          if (this.num == 4) {
            this.Mark_desserts = Arry;
            console.log("333", this.Mark_desserts);
          } else if (this.num == 3) {
            this.Mark_desserts_3 = Arry;
            console.log("333", this.Mark_desserts_3);
          }
        })
        .catch((error) => {
          console.log(error);
          // alert("请求出错了");
        });
    },

    KHList() {
      return axios({
        method: "get",
        url: "https://danxiagis.top:8081/teacher/getAssessment", //http://danxiagis.top:3000/ui/teacher/getAssessment
      })
        .then((response) => {
          console.log("@@@@@@@", response);
          let res = response.data;
          // console.log(res)
          let sub_group = [];
          for (let b = 0; b < res.length; b++) {
            let assessmentNumber = this.assessmentMap.get(res[b].group_id) || 0;
            sub_group.push({
              id: res[b].group_id,
              leader: res[b].leader,
              mark: assessmentNumber,
              /*  answerStatus: false, */
            });
          }

          /* commonMark */
          sub_group.sort((a, b) => a.id - b.id);
          this.KH_desserts = sub_group;

          this.group_sum = res.length;
        })
        .catch((error) => {
          console.log("err", error);
        });
    },
    isAnswered() {
      this.status.forEach((item) => {
        this.KH_desserts[item.group_id - 1].answerStatus =
          item.assessment_status;
        if (item.assessment_status == 2 || item.assessment_status == 1)
          this.khansweredNum++;
      });
    },
    //获取当前小组回答的问题及其答案
    edit_khItem(item) {
      //这里的item是
      //获取当前要编辑成绩的小组的索引位置
      this.edited_khIndex = this.KH_desserts.indexOf(item);
      //将当前item拷贝给edited_khItem
      this.edited_khItem = Object.assign({}, item);
      //弹窗
      this.kh_dialog = true;
      //小组id
      this.g_id = item.id;

      axios({
        method: "get",
        url: "https://danxiagis.top:8081/teacher/getOneGroupAssess", //http://danxiagis.top:3000/ui/teacher/GetOneGroupAssess
        params: { group_id: this.g_id },
      })
        //aa装的是每一组的问题及答案，要加入到KH_desserts中对应的中去
        .then((response) => {
          let res = response.data;
          let aa = [];
          for (let a = 0; a < res.length; a++) {
            let Aarry = {
              title: res[a].aname,
              answer: res[a].answer,
              time: res[a].time.split(".")[0].replace("T", " "),
            };
            aa.push(Aarry);
          }
          this.KH_ans = aa;
        })
        .catch((error) => {
          console.log(error);
          // alert("请求出错了");
        });
    },
    kh_close() {
      this.kh_dialog = false;
      //对正在编辑的item重置
      this.$nextTick(() => {
        this.edited_khItem = Object.assign({}, this.defaultItem);
        this.edited_khIndex = -1;
      });
      /* this.KHList(); */
    },
    kh_save() {
      if (this.edited_khIndex > -1) {
        //整个都被拷贝过去了
        Object.assign(
          this.KH_desserts[this.edited_khIndex],
          this.edited_khItem
        );
      }
      console.log("kh", this.KH_desserts[this.edited_khIndex]);
      //传成绩回去
      axios({
        method: "post",
        url: "https://danxiagis.top:8081/assessment/teacher/scoreAssessment",
        params: {
          tea_id: localStorage.getItem("name"),
          group_id: this.g_id,
          assessmentNumber: this.KH_desserts[this.edited_khIndex].mark,
        },
      }).then((res) => {
        console.log(res);
        this.commonMark();
        this.finalMark();

        alert("打分成功");
      });
    },
  },
};
</script>

<style scoped>
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

.pscol {
  color: rgb(159, 22, 4); /* 文字颜色 */
  font-weight: 700;
}
.fixed-box {
  background-color: #e8eff6;
  position: sticky;
  top: 0;
  z-index: 100;
  /* height: 100px; */
}
.btn .v-btn {
  font-size: 20px;
}
.leader-row {
  background-color: #c5f2d1;
}
.slider-labels {
  white-space: nowrap;
}
</style>