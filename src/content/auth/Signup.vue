<script setup lang="ts">

import router, {baseUrl} from "../../router";
import {computed, onMounted, ref} from "vue";
import {defaultUser, User} from "./User.ts";
import axios, {AxiosError} from "axios";
import {useToast} from 'primevue/usetoast';
import Toast from 'primevue/toast';
import {useSessionStore} from "../../session/useSessionStore.ts";

const toast = useToast();
const store = useSessionStore();

const signupForm = ref<User>({...defaultUser});
const err = ref<AxiosError | null>(null); // Changed to a ref

const handleCreateAccount = async () => {
  if (signupForm.value) {
    try {
      const response = await axios.post(`${baseUrl}/api/user/create`, signupForm.value);
      if (response.status === 201) {
        toast.add({severity: 'success', summary: 'Success', detail: 'Account created!', life: 3000});

        setTimeout(async () => {
          await router.push('/');
        }, 2000);
      } else {
        toast.add({severity: 'error', summary: 'Error', detail: response.data, life: 3000});
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Now we know this is an AxiosError and can access error.response, etc.
        const serverError = error as AxiosError;
        err.value = serverError; // Set the error

        if (serverError && serverError.response) {
          toast.add({severity: 'error', summary: 'Error', detail: serverError.response.data, life: 3000});
        }
      } else {
        // Handle non-Axios errors
        toast.add({severity: 'error', summary: 'Error', detail: 'An unexpected error occurred', life: 3000});
      }
    }
  } else {
    toast.add({severity: 'error', summary: 'Error', detail: 'Failed to create an account!', life: 3000});
  }
};

const isFieldEmpty = computed(() => {
  return signupForm.value.email === '' ||
      signupForm.value.username === '' ||
      !isPasswordValid.value;
});

const goToLogin = async () => {
  await router.push('/');
};

const isPasswordValid = computed(() => {
  const password = signupForm.value.password;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isLengthValid = password.length >= 8;
  return hasLowercase && hasUppercase && hasNumber && isLengthValid;
});

onMounted(async () => {
  if (store.getEmail && store.getUsername) {
    await router.push('/home');
  }
})
</script>

<template>
  <div class="grid grid-nogutter col-12 xl:col-6 xl:col-offset-3 mt-8">
    <div class="flex flex-column w-full gap-3">
      <Toast :position="'top-center'"/>
      <div class="flex justify-content-center">
        <div class="text-3xl font-bold mb-3">SIGN UP</div>
      </div>
      <div class="flex justify-content-center">
        <span class="p-float-label">
          <InputText id="username" v-model="signupForm.username" class="w-21rem" />
          <label for="username">Username</label>
        </span>
      </div>
      <div class="flex justify-content-center">
        <span class="p-float-label">
          <InputText id="email" v-model="signupForm.email" class="w-21rem" typeof="email"/>
          <label for="email">Email</label>
        </span>
      </div>
      <div class="flex justify-content-center">
        <span class="p-float-label">
          <Password id="password" v-model="signupForm.password" input-class="w-21rem" toggle-mask>
            <template #header>
                <h6>Pick a password</h6>
            </template>
            <template #footer>
                <Divider />
                <p class="mt-2">Suggestions</p>
                <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                    <li>At least one lowercase</li>
                    <li>At least one uppercase</li>
                    <li>At least one numeric</li>
                    <li>Minimum 8 characters</li>
                </ul>
            </template>
          </Password>
          <label for="password">Password</label>
        </span>
      </div>
      <div class="flex justify-content-center">
        <Button :disabled="isFieldEmpty" @click="handleCreateAccount" raised class="w-21rem" label="Create account"/>
      </div>
      <div class="flex justify-content-center">
        <Button @click="goToLogin" class="w-21rem" label="Login" raised/>
      </div>
    </div>
    Error:  {{ JSON.stringify(err)}}
  </div>
</template>

<style scoped>

</style>