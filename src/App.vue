<template>
  <div style="text-align: center; margin-top: 50px;">
    <h1>Vue & Express Split Setup</h1>
    <p>Backend Message: <strong>{{ backendMessage }}</strong></p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const backendMessage = ref('Loading...');

onMounted(async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await axios.get(`${apiUrl}/api/data`);
    backendMessage.value = response.data.message;
  } catch (error) {
    console.error('Error connecting to backend:', error);
    backendMessage.value = 'Failed to connect to backend server.';
  }
});
</script>
