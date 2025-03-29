<template>
  <v-app>
    <AppBar></AppBar>

    <v-main>
      <router-view />
    </v-main>

    <Footer></Footer>
  </v-app>
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
  name: "App",
  components: {
    AppBar: defineAsyncComponent(() => import("@/components/layout/appbar.vue")),
    Footer: defineAsyncComponent(() => import("@/components/layout/footer.vue"))
  }
};
</script>