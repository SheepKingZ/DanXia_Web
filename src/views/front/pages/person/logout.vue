<template>
  <v-img
    class="fill-height"
    src="../../../../assets/登录背景.png"
    :aspect-ratio="16 / 9"
    height="100vh"
    width="100vw"
    gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
  >
    <v-container fill-height fluid>
      <v-row justify="center" align="center" class="fill-height">
        <v-col cols="12" md="8" lg="6" xl="4">
          <v-card elevation="12" class="py-8">
            <v-card-text class="text-center">
              <h2 class="text-h4 black--text font-weight-bold">确认退出登录</h2>

              <div class="mt-6">
                <v-row justify="center">
                  <v-col cols="12" md="10">
                    <div class="mt-6">
                      <v-btn
                        block
                        class="text-capitalize"
                         
                        large 
                        color="primary"
                        @click.stop="logout"
                        >确认</v-btn>
                      <p></p>
                     
                      <v-btn
                     
                        block
                        class="text-capitalize"
                        large
                        color="information"
                        @click="$router.back()"
                        >取消</v-btn>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-img>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {};
  },
  methods: {
    
    logout() {
      //将用户信息清空
      this.$store.commit("loginIn", null);
      this.$router.push("/Login"); //跳转登录页面
    },
  },
};
</script>
