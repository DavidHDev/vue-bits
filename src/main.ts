import './css/main.css';
import 'primeicons/primeicons.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { installThemeShortcut } from './composables/useTheme';

import ToastService from 'primevue/toastservice';
import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';

const app = createApp(App);

app.use(router);
app.use(PrimeVue, { theme: { preset: Aura } });
app.use(ToastService);

installThemeShortcut();

app.mount('#app');
