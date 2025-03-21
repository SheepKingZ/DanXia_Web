<template>
  <v-card tile height="100%">
    <v-tabs vertical>
      <v-tab>
        <!-- 组队的图表account-group -->
        <v-icon left> mdi-eye </v-icon>
        其他成员感想
      </v-tab>
      <v-tab>
        <v-icon left> mdi-arrow-up-bold </v-icon>
        提交实习感想
      </v-tab>

      <v-tab-item>
        <v-card  tile color="green lighten-5" min-height="700px">
          <br/>

         <v-card
         class="mx-10 mt-3 px-5"
         outlined
         v-for="(item,index) in menReports"
         :key="index">
            <v-row align="center" >
              <v-col cols="1" class="ml-8 mr-n8" >
                <v-icon large >mdi-account-circle-outline</v-icon>
                <h3 :style="{ fontFamily: 'KaiTi, 楷体, serif', fontSize: 'medium',  }">  
  {{ item.name }}  
</h3>
              </v-col>
              <v-col>
                <v-card-text 
                  :style="{
                    fontFamily: 'KaiTi, 楷体, serif', fontSize: 'large', textIndent: '2em', lineHeight: '1.5' ,fontWeight: 'bold'  
                  }"
                   
                    
                > {{ item.content }}  </v-card-text> 
              </v-col>
            </v-row>
          </v-card>
        <br/>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card tile color="green lighten-5" min-height="700px">
          <br /><br />
          <v-container>
            <v-alert
              text
              dense
              color="teal"
              icon="mdi-clock-fast"
              border="left"
              width="50%"
            >
              <span v-if="isSubmit">提交成功，您的提交时间为{{date}}</span>
              <span v-else>您还未提交个人感想</span>
            </v-alert>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  clear-icon="mdi-close-circle"
                  solo
                  name="input-7-4"
                  v-model="though_text"
                  label="请输入"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-btn color="teal" outlined @click="startSubmit()">确认提交</v-btn>
          </v-container>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>
  
  <script>
import axios from 'axios'
import debounce from "lodash/debounce"
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
export default {
  name: "studentReport",
  data() {
    return {
      date:'',
      though_text:'',
      menReports: [],
      isSubmit:null
    };
  },
  methods: {
    person_report(){
      
      let per_id = sessionStorage.group_id
      axios({
        method: "get",
        url: "https://danxiagis.top:8081/assessment/getOneGroupThought",//https://danxiagis.top:8081/assessment/getReport
        params:{
          group_id:per_id
        }
      }).then((response) => {
        let res = response.data
        let Arry = []
        console.log('res',res);
        for(var a = 0;a<res.length;a++){
          let arr = {
            name: res[a].name,
            content: res[a].though,
          }
        
          Arry.push(arr)
          if(res[a].name==sessionStorage.userName){
            this.date = res[a].date.substring(0, 10)
            this.though_text = res[a].though
          }
          console.log(res.stu_id,localStorage.getItem('name'));
          if(res[a].stu_id==localStorage.getItem('name'))
          {
            console.log('已提交');
            this.isSubmit=true
          }
        }
        this.menReports = Arry

      
      }).catch((error) => {
          console.log(error);
          // alert("请求出错了");
        });
    },
    //1\7
    startSubmit(){
      NProgress.start()
      this.Submit()
    },
    Submit:debounce(function(){
      
      if(!this.though_text||this.though_text.trim().length === 0)
      {
        alert('感想为空')
        return;
      }
      let id = sessionStorage.stu_id
      let g_id=sessionStorage.group_id
      let params={
          stu_id:id,
          though:this.though_text,
          group_id:g_id
        }
        console.log('params');
      axios({
        method:'post',
        url:'https://danxiagis.top:8081/assessment/sumbitThought',
        data:params,
      }).then(response=>{
        alert(response.data);
        NProgress.done()
        this.person_report()
        console.log(response);
      }).catch(err=>{
        console.log(err);
      })
    
    },3000)
  },
  computed: {},
  mounted: function () {
    this.person_report();
  },
};
</script>
  <style>
#passwordpage {
  position: relative;
  left: 20%;
}
</style>
  
  <template>
  <v-card tile height="100%">
    <v-tabs vertical>
      <v-tab>
        <!-- 组队的图表account-group -->
        <v-icon left> mdi-eye </v-icon>
        其他成员感想
      </v-tab>
      <v-tab>
        <v-icon left> mdi-arrow-up-bold </v-icon>
        提交实习感想
      </v-tab>

      <v-tab-item>
        <v-card  tile color="green lighten-5" min-height="700px">
          <br/>

         <v-card
         class="mx-10 mt-3 px-5"
         outlined
         v-for="(item,index) in menReports"
         :key="index">
            <v-row align="center" >
              <v-col cols="1" class="ml-8 mr-n8" >
                <v-icon large >mdi-account-circle-outline</v-icon>
                <h3 :style="{ fontFamily: 'KaiTi, 楷体, serif', fontSize: 'medium',  }">  
  {{ item.name }}  
</h3>
              </v-col>
              <v-col>
                <v-card-text 
                  :style="{
                    fontFamily: 'KaiTi, 楷体, serif', fontSize: 'large', textIndent: '2em', lineHeight: '1.5' ,fontWeight: 'bold'  
                  }"
                   
                    
                > {{ item.content }}  </v-card-text> 
              </v-col>
            </v-row>
          </v-card>
        <br/>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card tile color="green lighten-5" min-height="700px">
          <br /><br />
          <v-container>
            <v-alert
              text
              dense
              color="teal"
              icon="mdi-clock-fast"
              border="left"
              width="50%"
            >
              <span v-if="isSubmit">提交成功，您的提交时间为{{date}}</span>
              <span v-else>您还未提交个人感想</span>
            </v-alert>
            <v-row>
              <v-col cols="12">
                <v-textarea
                  clear-icon="mdi-close-circle"
                  solo
                  name="input-7-4"
                  v-model="though_text"
                  label="请输入"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-btn color="teal" outlined @click="startSubmit()">确认提交</v-btn>
          </v-container>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>
  
  <script>
import axios from 'axios'
import debounce from "lodash/debounce"
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
export default {
  name: "studentReport",
  data() {
    return {
      date:'',
      though_text:'',
      menReports: [],
      isSubmit:null
    };
  },
  methods: {
    person_report(){
      
      let per_id = sessionStorage.group_id
      axios({
        method: "get",
        url: "https://danxiagis.top:8081/assessment/getOneGroupThought",//https://danxiagis.top:8081/assessment/getReport
        params:{
          group_id:per_id
        }
      }).then((response) => {
        let res = response.data
        let Arry = []
        console.log('res',res);
        for(var a = 0;a<res.length;a++){
          let arr = {
            name: res[a].name,
            content: res[a].though,
          }
        
          Arry.push(arr)
          if(res[a].name==sessionStorage.userName){
            this.date = res[a].date.substring(0, 10)
            this.though_text = res[a].though
          }
          console.log(res.stu_id,localStorage.getItem('name'));
          if(res[a].stu_id==localStorage.getItem('name'))
          {
            console.log('已提交');
            this.isSubmit=true
          }
        }
        this.menReports = Arry

      
      }).catch((error) => {
          console.log(error);
          // alert("请求出错了");
        });
    },
    //1\7
    startSubmit(){
      NProgress.start()
      this.Submit()
    },
    Submit:debounce(function(){
      
      if(!this.though_text||this.though_text.trim().length === 0)
      {
        alert('感想为空')
        return;
      }
      let id = sessionStorage.stu_id
      let g_id=sessionStorage.group_id
      let params={
          stu_id:id,
          though:this.though_text,
          group_id:g_id
        }
        console.log('params');
      axios({
        method:'post',
        url:'https://danxiagis.top:8081/assessment/sumbitThought',
        data:params,
      }).then(response=>{
        alert(response.data);
        NProgress.done()
        this.person_report()
        console.log(response);
      }).catch(err=>{
        console.log(err);
      })
    
    },3000)
  },
  computed: {},
  mounted: function () {
    this.person_report();
  },
};
</script>
  <style>
#passwordpage {
  position: relative;
  left: 20%;
}
</style>
  
  