<script setup lang="ts">

import {useSessionStore} from "../../session/useSessionStore.ts";
import {useToast} from "primevue/usetoast";
import router, {baseUrl} from "../../router";
import Toast from 'primevue/toast';
import {computed, onMounted, ref, watch} from "vue";
import axios from "axios";
import {defaultUserUpdateDTO, UserUpdateDTO} from "./UserUpdateDTO.ts";

const session = useSessionStore();
const toast = useToast();
const store = useSessionStore();
const user = ref<UserUpdateDTO>({...defaultUserUpdateDTO});
const shouldCheckInput = ref(true);

const password = ref('');

const handleLogout = async () => {
  shouldCheckInput.value = false; // Disable input checking
  session.clearSession();
  toast.add({ severity: 'success', summary: 'Success', detail: 'Logged out successfully!', life: 2000 });
  setTimeout(async () => {
    await router.push('/');
  }, 2000);
};

const isInputChanged = computed(() => {
  return user.value.email !== store.getEmail || user.value.username !== store.getUsername;
});

const handleSaveChanges = async () => {
  await updateUser();
};

const updateUser = async () => {
  try {
    user.value.password = password.value;
    const response = await axios.put(`/api/user/update`, user.value);
    if (response.data) {
      toast.add({severity: 'success', summary: 'Success!', detail: 'Profile updated successfully!', life: 4000});
      session.clearSession();
      setTimeout(async () => {
        await router.push('/');
      }, 2000);
    } else {
      toast.add({severity: 'error', summary: 'Error!', detail: 'Incorrect password!', life: 4000});
    }
  } catch (error) {
    toast.add({severity: 'error', summary: 'Error!', detail: 'Incorrect password!', life: 4000});
  }
};

watch(isInputChanged, (newVal) => {
  if (newVal && shouldCheckInput.value) {
    toast.add({severity: 'info', summary: 'Notice', detail: 'Please verify your password.', life: 4000});
  }
});

onMounted(() => {
  user.value.email = store.getEmail;
  user.value.username = store.getUsername;
  shouldCheckInput.value = true;
});

</script>

<template>
  <Toast :position="'top-center'"/>
  <div class="grid grid-nogutter col-12 xl:col-6 xl:col-offset-3 mt-8">
    <div class="flex flex-column w-full gap-3">
      <div class="flex justify-content-center">
        <div class="text-3xl font-bold mb-3">PROFILE</div>
      </div>
      <div class="flex justify-content-center">
        <span class="p-float-label">
          <InputText id="username" disabled v-model="user.username" class="w-21rem"/>
          <label for="username">Username</label>
        </span>
      </div>
      <div class="flex justify-content-center">
        <span class="p-float-label">
          <InputText id="email" v-model="user.email" class="w-21rem"/>
          <label for="email">Email</label>
        </span>
      </div>
      <div class="flex justify-content-center" v-if="isInputChanged">
        <span class="p-float-label">
          <Password id="password" v-model="password"
                    input-class="w-21rem" toggle-mask :feedback="false"/>
          <label for="password">Password</label>
        </span>
      </div>
      <div class="flex justify-content-center">
        <Button :disabled="password.length === 0" class="w-21rem" @click="handleSaveChanges" label="Save"/>
      </div>
<!--      <div class="flex justify-content-center">-->
<!--        <Button :disabled="isFieldEmpty" @click="handleCreateAccount" raised class="w-23rem" label="Create account"/>-->
<!--      </div>-->
      <div class="flex justify-content-center">
        <Button class="w-21rem bg-red-600" @click="handleLogout" label="Logout"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>