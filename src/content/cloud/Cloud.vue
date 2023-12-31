<script setup lang="ts">

import {onMounted, ref, toRaw} from "vue";
import axios from "axios";
import {Image} from "./Image.ts";

// const selectedOption = ref('');
// const selectedImage = ref('');
const options = ['All Files', 'Recent', 'Photos', 'Notes']
//
// const fileInput = ref<HTMLInputElement | undefined>(undefined);
// const selectedFile = ref<File | null>(null);
// const userId = ref(19); // Should be set based on user context
//
// const triggerFileInput = () => {
//   fileInput.value?.click();
// };
//
// const handleFileChange = (event: Event) => {
//   const input = event.target as HTMLInputElement;
//   if (input.files?.length) {
//     selectedFile.value = input.files[0];
//   }
// };
//
// const handleUploadFile = async () => {
//   if (selectedFile.value) {
//     const formData = new FormData();
//     formData.append("image", selectedFile.value);
//
//     try {
//       const response = await axios.post(`http://localhost:8080/api/public/image/${userId.value}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       console.log('File uploaded successfully', response.data);
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       // Additional error handling can be added here
//     }
//   } else {
//     alert('Please select a file first.');
//   }
// };
// const files = ref<Image[]>([]);
//
// const fetchFiles = async () => {
//   console.log(toRaw(files.value));
//
//   try {
//     const response = await axios.get(`http://localhost:8080/api/public/image/user/${userId.value}`);
//     files.value = response.data.map((imageData: Image) => ({
//       ...imageData,
//       url: `data:${imageData.type};base64,${imageData.data}`,
//     }));
//     console.log('Files fetched successfully', files.value);
//   } catch (error) {
//     console.error('Error fetching files:', error);
//   }
// };
//
// // const fetchFiles = async () => {
// //   try {
// //     console.log('Fetching files...');
// //     const response = await axios.get(`http://localhost:8080/api/public/image/user/${userId.value}`);
// //     files.value = response.data;
// //     console.log('Files fetched successfully', response.data);
// //   } catch (error) {
// //     console.error('Error fetching files:', error);
// //   }
// // };

onMounted(async () => {
  await fetchImages(null);
});

const images = ref<string[]>([]);
const nextCursor = ref<string | null>(null);

const fetchImages = async (cursor: string | null) => {
  try {
    const response = await axios.get('/api/images', {params: {next_cursor: cursor}});
    images.value.push(...response.data.resources);
    console.log(response.data)
    nextCursor.value = response.data.next_cursor;
  } catch (error) {
    console.error('Error fetching images:', error);
  }
};


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
  <div class="grid grid-nogutter h-screen">
    <div class="col-3 xl:col-2">
      <div class="flex align-items-center h-4rem">
        <h1>Your Cloud</h1>
      </div>
      <div v-for="(option, index) in options" :key="index" class="flex flex-column mb-3 ml-3">
        <div class="text-2xl">{{ option }}</div>
      </div>
    </div>
    <div class="col-9 xl:col-10">
      <div class="flex">
        <div class="col-6">
          <span class="p-input-icon-left w-full">
              <i class="pi pi-search"/>
              <InputText class="w-full border-round-left-2xl	border-round-right-2xl"
                         placeholder="Search in cloud"/>
          </span>
        </div>
        <div class="flex w-full justify-content-end gap-3">
          <div class="flex align-items-center">
            <i class="pi pi-cog text-5xl"></i>
          </div>
          <!--          <div class="flex align-items-center">-->
          <!--            <Avatar @click="navigateManageAccount" label="A" class="mr-2" size="large" shape="circle" />-->
          <!--          </div>-->
        </div>
      </div>

      <div class="flex col-12">
        <div class="col-6">
          <div class="flex justify-content-end gap-2">
            <input type="file" @change="handleFileUpload" />
            <Button @click="uploadImage">
              <i class="pi pi-upload"></i>
              <span class="px-2">Upload</span>
            </Button>
            <Button>
              <i class="pi pi-download"></i>
              <span class="px-2">Download</span>
            </Button>
          </div>
        </div>
      </div>
<!--      <div v-for="image in images" :key="image.asset_id" >-->
<!--        <div class="w-2">-->
<!--          <img class="" :src="image.secure_url" :alt="image.display_name" />-->
<!--        </div>-->
<!--&lt;!&ndash;        <p>{{ image.display_name }}</p>&ndash;&gt;-->
<!--      </div>-->
      <div v-for="image in images" :key="image.asset_id">
        <div class="image-container">
          <img :src="image.secure_url" :alt="image.display_name" class="resized-image"/>
        </div>
      </div>
      <button v-if="nextCursor" @click="loadMore">Load More</button>

      <!--      <div>-->
      <!--        <div v-if="selectedOption === 'Recent'">-->
      <!--          <img @click="selectImage(image2)" class="h-10rem w-13rem mr-2"-->
      <!--               :src="image2" alt="image">-->
      <!--        </div>-->
      <!--        <div v-if="selectedOption === 'All Files' || selectedOption === 'Photos'">-->
      <!--          <img class="h-10rem w-13rem mr-2"-->
      <!--               @click="selectImage(image)"-->
      <!--               v-for="(image, index) in images" :key="index" :src="image" alt="image">-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<style scoped>
.image-container {
  width: 3in;  /* Set the width to 3 inches */
  height: 3in; /* Set the height to 3 inches */
  overflow: hidden; /* Hide parts of the image that overflow */
}

.resized-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Resize the image to cover the container */
}
</style>