<template>
  <v-app class="green lighten-5">
 
  <v-row>
    <v-col cols="12" md="2" >
    <v-card class="pull-left ml-5 mt-5" height="500px" min-width="11%">
      
      <v-list>

          <v-list-item-group v-model="selectedItem">
            <v-list-item
              class="list-item-wrap"
              v-for="(item, i) in items"
              :key="i"
              variant="tonal"
              color="primary"
              @click="pSrc=item.pdf"
              v-ripple="{class:'grey--text'}"
              :title="item.title"
              
              >
              <v-list-item-title class="title-wrap">{{item.title}}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        
      </v-list>
    </v-card>
  </v-col>

      <v-col cols="12" md="9" >
      <v-card height="1000px" width="2000px" id="r">
        <iframe :src="pSrc" width="100%" height="100%" ></iframe>
      </v-card>
    </v-col>

  </v-row>

  </v-app>
  
</template>

<script>



export default {
  name:"download",
  data() {
    return {
      selectedItem: null,
      items: [],//存了response
      subjectItem:[],//每个元素代表每个科目的
      childItems: [],
      pSrc: "",
    };
  },
  methods: {
    //加载的目录
    loadClassList() {
    const res = JSON.parse(localStorage.getItem('meterial'));

    this.items=[]
    for (let i = 0; i < res.length; i++) {
      // 将条件检查移到外层循环，只有当_id包含'实习资料'时，才处理内层的info
      if(res[i]._id.indexOf('实习资料') !== -1) {
        for(let j = 0; j < res[i].info.length; j++) {
          this.items.push({
            title: res[i].info[j].topic, // 应从res[i]访问info
            pdf: res[i].info[j].pdf, // 同上
            time:Date.parse(res[i].info[j].uploadTime)
          });
        }
      }
    }
    this.items.sort(function(a, b) {
      return b.time - a.time;
    })
    if(this.items.length > 0) {
      this.pSrc = this.items[0].pdf; // 设置pSrc为第一个PDF的路径
    }
  },


    /* loadPDF() {
      //baseurl ：pdf存放的文件路径，可以是本地的，也可以是远程，这个是远程的，亲测可以用
      this.pSrc = "https://scaugis.top:3007/PDF/fangfa/yanshi.pdf";
      //ie有缓存加个随机数解决  + '?r=' + new Date()
      // let pSrc = baseurl + '?r=' + new Date();
      // this.pSrc =
      //   "../../../../../pdfjs-2.6.347-dist/web/viewer.html?file=" + "unit1.pdf";
    }, */

  },

  mounted() {
    this.loadClassList();

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
.list-item-wrap {
  white-space: normal;
}

.title-wrap {
  word-break: break-word;
}
</style>