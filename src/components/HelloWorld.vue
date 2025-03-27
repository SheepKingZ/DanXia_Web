<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="mx-auto">
          <v-card-title class="text-center">
            {{ title }}
          </v-card-title>
          <v-card-text>
            <v-btn color="primary" @click="increment">
              <v-icon start>mdi-plus</v-icon> 计数: {{ count }}
            </v-btn>
            <p class="mt-4">本项目已迁移到Vue3!</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'HelloWorld',
  setup() {
    // 使用组合式API
    const count = ref(0);
    const title = ref('欢迎使用 Vue3 版丹霞 Web');

    const increment = () => {
      count.value++;
    };

    onMounted(() => {
      console.log('组件已挂载');
    });

    return {
      count,
      title,
      increment
    };
  }
};
</script> 