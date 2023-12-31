<script setup lang="ts">

import router from "../../router";
import {computed, ref} from "vue";
import {defaultUser, User} from "./User.ts";
import axios from "axios";
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

const toast = useToast();

const signupForm = ref<User>({...defaultUser});

const handleCreateAccount = async () => {
  if (signupForm.value) {
    const response = await axios.post('http://localhost:8080/api/user/create', signupForm.value);
    if (response.data) {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Account created!', life: 3000 });
      await createCloudinaryFolderForUser(signupForm.value.email);
    }
    setTimeout(async () => {
      await router.push('/');
    },2000);

  } else {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create an account!', life: 3000 });
  }
};

const isFieldEmpty = computed(() => {
  return signupForm.value.email === '' || signupForm.value.username === '' || signupForm.value.password === '';
});

const createCloudinaryFolderForUser = async (email: string) => {
  try {
    const response = await axios.post(`http://localhost:8080/api/cloudinary/create-folder`, null, {
      params: { folderPath: email }
    });
    console.log('Success');
  } catch (error) {
    console.error('Error creating folder for user:', error);
  }
};

</script>

<template>
  <div class="p-card grid col-6 col-offset-3 mt-8">
    <Toast/>
    <div class="grid">
      <div class="col-12">
        <InputText v-model="signupForm.username" class="w-full" placeholder="Username"/>
      </div>
      <div class="col-12">
        <InputText v-model="signupForm.email" class="w-full" placeholder="Email"/>
      </div>
      <div class="col-12">
        <InputText v-model="signupForm.password" class="w-full" placeholder="Password"/>
      </div>
      <div class="col-12">
        <Button :disabled="isFieldEmpty" @click="handleCreateAccount" class="w-full" label="Create account"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>