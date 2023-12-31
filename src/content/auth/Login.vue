<script setup lang="ts">

import router, {baseUrl} from "../../router";
import {defaultLoginRequest, LoginRequest} from "./LoginRequest.ts";
import {ref} from "vue";
import {useToast} from "primevue/usetoast";
import axios, {AxiosError} from "axios";
import Toast from 'primevue/toast';
import {useSessionStore} from "../../session/useSessionStore.ts";
import {computed} from "vue";

const loginForm = ref<LoginRequest>({...defaultLoginRequest});
const toast = useToast();
const store = useSessionStore();

const handleSignUp = async () => {
  await router.push('signup');
};

const handleLogin = async () => {
  try {
    const response = await axios.post(`${baseUrl}/api/user/login`, loginForm.value);
    if (response) {
      store.setEmail(loginForm.value.email);
      toast.add({ severity: 'success', summary: 'Success', detail: 'User authenticated!', life: 2000 });
      setTimeout(async () => {
        await router.push('/home');
      }, 2000);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 401) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Incorrect username/password!', life: 2000 });
      } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'An error occurred!', life: 2000 });
      }
    } else {
      // Handle non-Axios errors
      toast.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred!', life: 2000 });
    }
  }
};

const isFieldEmpty = computed(() => {
  return loginForm.value.email === '' || loginForm.value.password === '';
});

</script>

<template>
  <div class="p-card grid col-6 col-offset-3 mt-8">
    <div class="flex flex-column w-full gap-2">
      <Toast/>
      <div>
        <InputText v-model="loginForm.email" class="w-full" placeholder="Username"/>
      </div>
      <div>
        <InputText v-model="loginForm.password" @keyup.enter="handleLogin" class="w-full" placeholder="Password"/>
      </div>
      <div>
        <Button @click="handleLogin" :disabled="isFieldEmpty" class="w-full" label="Login"/>
      </div>
      <div>
        <Button @click="handleSignUp" class="w-full" label="Sign up"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>