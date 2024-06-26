<script setup lang="ts">

import router, {baseUrl} from "../../router";
import {defaultLoginRequest, LoginRequest} from "./LoginRequest.ts";
import {onMounted, ref} from "vue";
import {useToast} from "primevue/usetoast";
import axios, {AxiosError} from "axios";
import Toast from 'primevue/toast';
import {useSessionStore} from "../../session/useSessionStore.ts";
import {computed} from "vue";

const loginForm = ref<LoginRequest>({...defaultLoginRequest});
const toast = useToast();
const store = useSessionStore();
const isLoading = ref(false);

const handleSignUp = async () => {
  await router.push('signup');
};

const handleLogin = async () => {
  try {
    isLoading.value = true;

    const response = await axios.post(`${baseUrl}/api/user/login`, loginForm.value);
    if (response) {
      store.setEmail(loginForm.value.email);
      store.setUsername(response.data.username);
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
  } finally {
    isLoading.value = false;
  }

};

const isFieldEmpty = computed(() => {
  return loginForm.value.email === '' || loginForm.value.password === '';
});

onMounted(async () => {
  if (store.getEmail && store.getUsername) {
    await router.push('/home');
  }
});

</script>

<template>
  <div class="grid grid-nogutter col-12 xl:col-6 xl:col-offset-3 mt-8">
    <div class="flex flex-column w-full gap-3">
      <Toast :position="'top-center'"/>
      <div class="flex justify-content-center">
        <div class="text-3xl font-bold mb-3">LOGIN</div>
      </div>
      <div class="flex justify-content-center">
        <span class="p-float-label">
          <InputText id="email"
                     v-model="loginForm.email"
                     class="w-21rem"
                     @keyup.enter="handleLogin"/>
          <label for="email">Email</label>
        </span>
      </div>
      <div class="flex justify-content-center">
        <span class="p-float-label">
          <Password id="password" v-model="loginForm.password"
                    input-class="w-21rem"
                    toggle-mask
                    :feedback="false"
                    @keyup.enter="handleLogin"
          />
          <label for="username">Password</label>
        </span>
      </div>
      <div class="flex justify-content-center">
        <Button @click="handleLogin" :disabled="isFieldEmpty || isLoading" raised class="w-21rem flex justify-content-center" label="Login">
          <div v-if="!isLoading" >Login</div>
          <div v-else >Logging in
            <span v-if="isLoading" class="pi pi-spin pi-spinner">
            </span>
          </div>
        </Button>

      </div>
      <div class="flex justify-content-center">
        <Button @click="handleSignUp" class="w-21rem" label="Sign up" raised/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>