<script setup lang="ts">

import Toast from 'primevue/toast';
import {ref} from "vue";
import axios from "axios";
import {onMounted} from "vue";
import {useToast} from "primevue/usetoast";
import {useSessionStore} from "../../session/useSessionStore.ts";

const folderName = ref<string>('');
const toast = useToast();
const session = useSessionStore();

onMounted(async () => {
  console.log(session)
  await fetchImages(null);
});


const images = ref<string[]>([]);
const nextCursor = ref<string | null>(null);

const fetchImages = async (cursor: string | null) => {
  console.log(folderName)
  try {
    const response = await axios.get(`https://cloud-storage-project.onrender.com/api/cloudinary/images/${session.getEmail}`, {
      params: { next_cursor: cursor }
    });

    // If cursor is null, it means we are doing a fresh fetch, not loading more.
    if (cursor === null) {
      images.value = [];  // Clear the current images array
    }

    images.value.push(...response.data.resources);
    nextCursor.value = response.data.next_cursor;

  } catch (error) {
    console.error('Error fetching images:', error);
  }
};
// const loadMore = () => {
//   if (nextCursor.value) {
//     fetchImages(nextCursor.value);
//   }
// };
const selectedFile = ref(null);

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
};

const uploadImage = async () => {
  if (!selectedFile.value) {
    toast.add({ severity: 'warn', summary: '', detail: 'Please select a file first', life: 3000 });
    return;
  }
  const formData = new FormData();
  formData.append('file', selectedFile.value);
  formData.append('folderPath', session.getEmail);


  try {
    const response = await axios.post('https://cloud-storage-project.onrender.com/api/images/upload-to-folder', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    toast.add({ severity: 'info', summary: '', detail: 'Your file is being uploaded', life: 3000 });
    if (response.data) {
      await fetchImages(null);

      selectedFile.value = null;
      const fileInputElement = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInputElement) {
        fileInputElement.value = ''; // This safely clears the file input
      }
    }
    toast.add({ severity: 'success', summary: 'Success', detail: 'File uploaded successfully!', life: 3000 });
    // Handle the response as needed, e.g., displaying the uploaded image
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error uploading the file!', detail: 'File size exceeds 10MB limit!', life: 4000 });
    // Handle the upload error
  }
};
</script>

<template>
  <Toast/>
  {{ JSON.stringify(session.getEmail) }}
  <div class="grid grid-nogutter">
    <div class="col-2">
      <h1>Your Cloud</h1>
    </div>
    <div class="col-3 flex align-items-center">
      <span class="p-input-icon-left w-full">
              <i class="pi pi-search"/>
              <InputText class="w-full border-round-left-2xl	border-round-right-2xl"
                         placeholder="Search in cloud"/>
          </span>
    </div>
    <div class="col-5 flex justify-content-end">
      <div class="flex justify-content-end align-items-center gap-3">
        <input class="w-6" type="file" @change="handleFileUpload" />
        <Button @click="uploadImage">
          <i class="pi pi-upload"></i>
          <span class="px-2">Upload</span>
        </Button>
      </div>
    </div>
    <div class="col-2 flex justify-content-end">
      <div class="flex align-items-center">
        <i class="pi pi-cog text-5xl"></i>
      </div>
    </div>
  </div>

  <div class="grid grid-nogutter h-full">
    <div class="col-12 xl:col-8 xl:col-offset-2">
      <div class="grid grid-nogutter column-gap-3 flex justify-content-start ml-8">
        <div class="col-4 sm:col-3 md:col-3 lg:col-2 xl:col-2 h-10rem mt-2 cursor-pointer" v-for="image in images" :key="image.asset_id">
          <img class="w-full h-full" :src="image.secure_url" :alt="image.display_name"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>