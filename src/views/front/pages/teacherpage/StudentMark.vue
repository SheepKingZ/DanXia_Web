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
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import axios from "axios";
import * as echarts from "echarts";
import { mapState } from "vuex";
import fly2Vue from "../fly/fly2.vue";

export default {
  name: "StudentMark",
  
  setup() {
    const store = useStore();
    
    // 状态数据
    const num = ref("1");
    const panels = ref([0]);
    const MarkSelected = ref(null);
    const ManageSelected = ref(null);
    const ThoughSearch = ref("");
    const gxansweredNum = ref(0);
    const stu_sum = ref(0);
    const S_headers = ref([
      { text: "学号", value: "id", sortable: true },
      { text: "姓名", value: "name", sortable: true },
      { text: "组号", value: "group", sortable: true },
      { text: "是否为组长", value: "是否为组长", sortable: true },
      { text: "提交时间", value: "submitDate", sortable: true },
      { text: "感想状态", value: "answerStatus", sortable: true },
      { text: "查看实习感想", value: "查看实习感想", sortable: false },
    ]);
    const S_desserts = ref([]);
    const person_dialog = ref(false);
    const item_name = ref("");
    const gxsortBy = ref("id");
    const gxsortDesc = ref(false);
    const gxnoAnswer = ref(0);
    const thought_index = ref(0);
    
    // 计算属性
    const thoughtList = computed(() => store.getters.thoughtList);
    const status = computed(() => store.getters.status);
    
    // 方法
    const gxmarkLeader = (item) => {
      return item.是否为组长 == "是" ? "leader-row" : "";
    };
    
    const gxonSortByUpdated = (value) => {
      gxsortBy.value = value;
      gxsortData();
    };
    
    const gxonSortDescUpdated = (value) => {
      gxsortDesc.value = value;
      gxsortData();
    };
    
    const gxsortData = () => {
      S_desserts.value.sort((a, b) => {
        if (gxsortDesc.value) {
          return a[gxsortBy.value] < b[gxsortBy.value] ? 1 : -1;
        } else {
          return a[gxsortBy.value] > b[gxsortBy.value] ? 1 : -1;
        }
      });
      console.log("调gx", S_desserts.value);
    };
    
    const isThought = async () => {
      await store.dispatch("getAllThought");
      S_desserts.value.forEach((item) => {
        for (let i = 0; i < thoughtList.value.length; i++) {
          if (item.id == thoughtList.value[i].stu_id) {
            item.answerStatus = 1;
            item.submitDate = thoughtList.value[i].date
              .split(".")[0]
              .replace("T", " ");
            gxansweredNum.value++;
            break;
          }
          item.answerStatus = 0;
          gxnoAnswer.value++;
        }
      });
    };
    
    const handleClick = (category) => {
      if (category == "MarkSelected") ManageSelected.value = null;
      else if (category == "ManageSelected") MarkSelected.value = null;
    };
    
    const check_thought = (item) => {
      // 需要补充实现这个方法
      item_name.value = item.name;
      person_dialog.value = true;
      thought_index.value = S_desserts.value.findIndex(i => i.id === item.id);
    };
    
    const gxpre_group = () => {
      if (thought_index.value > 0) {
        thought_index.value--;
        check_thought(S_desserts.value[thought_index.value]);
      } else alert("已经是第一组了");
    };
    
    const gxnext_group = () => {
      if (thought_index.value < S_desserts.value.length - 1) {
        thought_index.value++;
        check_thought(S_desserts.value[thought_index.value]);
      } else {
        alert("已经是最后一组");
      }
    };
    
    const logggg = () => {
      // 这个方法似乎是用于调试的
      console.log("logggg");
    };
    
    // 组件挂载时执行的操作
    onMounted(() => {
      // 在此处添加初始化代码
    });
    
    return {
      num,
      panels,
      MarkSelected,
      ManageSelected,
      ThoughSearch,
      gxansweredNum,
      stu_sum,
      S_headers,
      S_desserts,
      person_dialog,
      item_name,
      gxsortBy,
      gxsortDesc,
      gxnoAnswer,
      thought_index,
      thoughtList,
      status,
      gxmarkLeader,
      gxonSortByUpdated,
      gxonSortDescUpdated,
      gxsortData,
      isThought,
      handleClick,
      check_thought,
      gxpre_group,
      gxnext_group,
      logggg
    };
  }
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