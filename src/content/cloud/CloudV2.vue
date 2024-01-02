<script setup lang="ts">

import Toast from 'primevue/toast';
import {computed, ref} from "vue";
import axios from "axios";
import {onMounted} from "vue";
import {useToast} from "primevue/usetoast";
import {useSessionStore} from "../../session/useSessionStore.ts";
import router, {baseUrl} from "../../router";

const toast = useToast();
const session = useSessionStore();

const images = ref<Image[]>([]);
const nextCursor = ref<string | undefined>(undefined);
const selectedFile = ref<File | undefined>(undefined);
const selectedFileName = ref('');
const isLoading = ref(false);
const isUploadingOrDeleting = ref(false);
const selectedImages = ref<Image[]>([]);
const isSelectMode = ref(false);

const fetchImages = async (cursor: string | undefined) => {
  isLoading.value = true;
  try {
    const response = await axios.get(`${baseUrl}/api/cloudinary/images/${session.getUsername}`, {
      params: {next_cursor: cursor},
    });
    console.log(response.data)
    // If cursor is null, it means we are doing a fresh fetch, not loading more.
    if (cursor === undefined) {
      images.value = [];  // Clear the current images array
    }

    images.value.push(...response.data.resources);
    nextCursor.value = response.data.next_cursor;

  } catch (error) {
    console.error('Error fetching images:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input && input.files && input.files.length > 0) {
    selectedFile.value = input.files[0];
    selectedFileName.value = input.files[0].name; // Store the file name
  }
};

const uploadImage = async () => {
  isUploadingOrDeleting.value = true
  if (!selectedFile.value) {
    toast.add({severity: 'warn', summary: '', detail: 'Please select a file first', life: 3000});
    isUploadingOrDeleting.value = false
    return;
  }
  const formData = new FormData();
  formData.append('file', selectedFile.value);
  formData.append('folderPath', session.getUsername || '');

  try {
    const response = await axios.post(`${baseUrl}/api/images/upload-to-folder`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (response.data) {
      setTimeout(async () => {
        await fetchImages(undefined);
      }, 2000); // Adjust the delay as needed

      selectedFile.value = undefined;
      selectedFileName.value = '';
      const fileInputElement = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInputElement) {
        fileInputElement.value = ''; // This safely clears the file input
      }
    }
    toast.add({severity: 'success', summary: 'Success', detail: 'File uploaded successfully!', life: 3000});
    // Handle the response as needed, e.g., displaying the uploaded image
  } catch (error) {
    toast.add({severity: 'error', summary: 'Error uploading the file!', detail: 'File size exceeds 10MB limit!', life: 4000});
  } finally {
    isUploadingOrDeleting.value = false
  }
};

const goToSetting = async () => {
  await router.push('/profile')
};

const goToHome = async () => {
  await fetchImages(undefined);
  await router.push('/home')
};

const firstInitial = computed(() => {
  return session.getUsername ? session.getUsername.charAt(0).toUpperCase() : '';
});

onMounted(async () => {
  if (!session.getEmail) {
    await router.push('/login')
  } else {
    await fetchImages(undefined);
  }
});

const toggleImageSelection = (image: Image) => {
  if (isSelectMode.value) {
    const index = selectedImages.value.indexOf(image);
    if (index === -1) {
      selectedImages.value.push(image);
    } else {
      selectedImages.value.splice(index, 1);
    }
  } else {
    window.open(image.secure_url, '_blank');
  }
};

const deleteSelectedImages = async () => {
  isUploadingOrDeleting.value = true;
  const publicIdsToDelete = selectedImages.value.map(img => img.public_id);

  if (publicIdsToDelete.length === 0) {
    toast.add({severity: 'warn', summary: 'Warning', detail: 'No images selected', life: 3000});
    isUploadingOrDeleting.value = false;
    isSelectMode.value = false;
  }

  try {
    const response = await axios.delete(`${baseUrl}/api/cloudinary/delete`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: publicIdsToDelete // Send the array of publicIds directly
    });

    if (response.status === 200) {
      toast.add({severity: 'success', summary: 'Success', detail: 'Images deleted successfully', life: 3000});

      // Optionally, refresh the images list or remove deleted images from the local state
      await fetchImages(undefined);

      // Clear the selection
      selectedImages.value = [];
    }
  } catch (error) {
    toast.add({severity: 'error', summary: 'Error', detail: 'Failed to delete images', life: 4000});
  } finally {
    isUploadingOrDeleting.value = false;
    isSelectMode.value = false;
  }
};

const handleSelectOption = () => {
  isSelectMode.value = !isSelectMode.value; // Toggle the mode
};
</script>

<template>
  <Toast :position="'top-center'"/>
  <div class="grid grid-nogutter">
    <div class="col-12 xl:col-2 sm:col-12 ">
      <h1 class="cursor-pointer flex justify-content-center" @click="goToHome">Your Cloud</h1>
    </div>
    <div class="col-12 xl:col-4 sm:col-5 flex align-items-center mb-2">
      <span class="p-input-icon-left w-full">
              <i class="pi pi-search"/>
              <InputText class="w-full border-round-left-2xl	border-round-right-2xl"
                         placeholder="Search in cloud"/>
      </span>
    </div>
    <div class="col-10 xl:col-4 sm:col-6 flex justify-content-end mb-2">
      <div class="flex justify-content-between xl:justify-content-end align-items-center gap-2 w-full">
        <!-- Custom styled label for the file input -->
        <label for="file-upload" class="custom-file-label mt-1 ">Choose File</label>
        <span v-if="selectedFileName" class="mt-1 w-7rem file-name-display surface-overlay white-space-nowrap overflow-hidden text-overflow-ellipsis">
          {{ selectedFileName }}
        </span>
        <!-- Actual file input, hidden -->
        <input id="file-upload" type="file" @change="handleFileUpload" class="hidden-file-input mt-1"/>
        <Button @click="uploadImage" class="w-7rem">
          <i class="pi pi-upload"></i>
          <span class="px-2">Upload</span>
        </Button>
      </div>
    </div>
    <div class="col-2 xl:col-2 sm:col-1 flex justify-content-end">
      <div @click="goToSetting" class="flex align-items-center xl:mr-6 cursor-pointer">
<!--        <i class="pi pi-cog text-5xl"></i>-->
        <Avatar :label="firstInitial" class="mr-2" size="large" style="background-color:#2196F3; color: #ffffff" shape="circle" />
      </div>
    </div>
  </div>
  <template v-if="images.length">
    <div v-if="!isSelectMode" class="col-12 xl:col-8 xl:col-offset-2 flex justify-content-end xl:pr-0">
      <Button @click="handleSelectOption"
              class="w-full xl:w-16rem h-2rem justify-content-center"
              label="Select image">
      </Button>
    </div>
    <div v-else class="col-12 xl:col-8 xl:col-offset-2 flex justify-content-end xl:pr-0">
      <Button @click="deleteSelectedImages"
              label="Delete Selected Images"
              class="w-full xl:w-16rem h-2rem justify-content-center"
              :class="{'bg-red-600' : isSelectMode}">
      </Button>
    </div>
  </template>

  <ProgressBar v-if="isUploadingOrDeleting" mode="indeterminate" style="height: 6px"></ProgressBar>
  <div v-if="!isLoading" class="grid grid-nogutter h-full">
    <div class="col-12 xl:col-8 xl:col-offset-2">
      <div class="grid grid-nogutter flex justify-content-start">
        <div class="col-4 sm:col-3 md:col-3 lg:col-2 xl:col-2 h-10rem mt-2 cursor-pointer p-1" v-for="image in images"
             :key="image.asset_id"
             :class="{ 'selected-border': selectedImages && selectedImages.includes(image) }"
             @click="toggleImageSelection(image)">
          <img class="w-full h-full" :src="image.secure_url" :alt="image.display_name"/>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="loading-spinner">
    <i class="pi pi-spin pi-spinner text-5xl"></i>
  </div>
</template>

<style scoped>
.loading-spinner {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.custom-file-label {
  display: inline-block;
  padding: 10px 20px;
  cursor: pointer;
  background-color: #f0f0f0;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  margin-right: 8px; /* Space between label and button */
}

.hidden-file-input {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.selected-border {
  border: 4px solid blue; /* Adjust the border style as needed */
}
</style>