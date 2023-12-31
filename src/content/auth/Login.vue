<script setup lang="ts">

import router from "../../router";
import {defaultLoginRequest, LoginRequest} from "./LoginRequest.ts";
import {ref} from "vue";
import {useToast} from "primevue/usetoast";
import axios from "axios";
import Toast from 'primevue/toast';
import {useSessionStore} from "../../session/useSessionStore.ts";

const loginForm = ref<LoginRequest>({...defaultLoginRequest});
const toast = useToast();
const store = useSessionStore();

const handleSignUp = async () => {
  await router.push('signup');
};

const handleLogin = async () => {
  const response = await axios.post('https://cloud-storage-project.onrender.com/api/user/login', loginForm.value);
  if (response.data) {
    store.setEmail(loginForm.value.email);
    toast.add({ severity: 'success', summary: 'Success', detail: 'User authenticated!', life: 2000 });
    setTimeout(async () => {
      await router.push('/home');
    },2000);
  }
}
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
        <Button @click="handleLogin" class="w-full" label="Login"/>
      </div>
      <div>
        <Button @click="handleSignUp" class="w-full" label="Sign up"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
p.inputtext {
  border: none;
}
</style>