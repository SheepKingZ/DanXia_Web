<template>
  <v-app>
    <router-view />  
  </v-app>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    if( document.getElementById('Loading'))
      document.getElementById('Loading').remove();

    
  }
};

</script>
