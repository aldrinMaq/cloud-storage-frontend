<script setup lang="ts">
import {onMounted, ref} from "vue";
import axios from "axios";

const images = ref<string[]>([]);
const nextCursor = ref<string | null>(null);


const fetchImages = async (cursor: string | null) => {
  try {
    const response = await axios.get('/api/images', { params: { next_cursor: cursor } });
    images.value.push(...response.data.resources);
    console.log(response.data)
    nextCursor.value = response.data.next_cursor;
  } catch (error) {
    console.error('Error fetching images:', error);
  }
};

onMounted(() => {
  fetchImages(null);
});

const loadMore = () => {
  if (nextCursor.value) {
    fetchImages(nextCursor.value);
  }
};
const selectedFile = ref(null);

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
};

const uploadImage = async () => {
  if (!selectedFile.value) {
    alert("Please select a file first!");
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile.value);

  try {
    const response = await axios.post('/api/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('File uploaded successfully', response.data);
    // Handle the response as needed, e.g., displaying the uploaded image
  } catch (error) {
    console.error('Error during file upload:', error);
    // Handle the upload error
  }
};
</script>

<template>
  <div>
    <input type="file" @change="handleFileUpload" />
    <button @click="uploadImage">Upload Image</button>
  </div>
  <div>
    <div v-for="image in images" :key="image.asset_id" class="image-container">
      <img :src="image.secure_url" :alt="image.display_name" />
      <p>{{ image.display_name }}</p>
    </div>
    <button v-if="nextCursor" @click="loadMore">Load More</button>
  </div>
</template>

<style scoped>

</style>