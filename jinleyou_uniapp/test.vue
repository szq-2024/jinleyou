<template>
  <input v-model="test" type="text">
</template>

<script setup>
import { ref } from 'vue';
const test = ref('');
</script>