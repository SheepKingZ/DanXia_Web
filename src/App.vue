<template>
  <v-app>
    <router-view />  
  </v-app>
</template>

<script>
import { onMounted } from 'vue';

export default {
  name: 'App',
  setup() {
    onMounted(() => {
      if (document.getElementById('Loading'))
        document.getElementById('Loading').remove();
    });
    
    return {};
  }
};
</script>
