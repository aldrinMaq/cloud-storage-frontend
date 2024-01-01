import { createApp } from 'vue'
import App from './App.vue'
import "primevue/resources/themes/md-light-indigo/theme.css";
import "primevue/resources/primevue.min.css";
import '/node_modules/primeflex/primeflex.css';
import router from './router'
import PrimeVue from 'primevue/config';
import './assets/app.css';
import 'primeicons/primeicons.css';
import Button from "primevue/button";
import Avatar from "primevue/avatar";
import InputText from "primevue/inputtext";
import Password from 'primevue/password';
import ToastService from 'primevue/toastservice';
import ProgressBar from 'primevue/progressbar';

import {createPinia} from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate"

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedState)
app.use(pinia);
app.use(router);
app.use(PrimeVue);
app.use(ToastService);

app.component('InputText', InputText)
app.component('Avatar', Avatar)
app.component('Button', Button)
app.component('Password', Password)
app.component('ProgressBar', ProgressBar)


app.mount('#app')
