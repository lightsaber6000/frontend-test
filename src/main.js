import Vue from 'vue';
import App from './App.vue';
import Toasts from './plugins/Toast';
import droppable from './directives/droppable';

import './assets/styles/main.scss';

import vClickOutside from 'v-click-outside';

Vue.use(vClickOutside);
Vue.use(Toasts);

new Vue({
  droppable,
  render: (h) => h(App),
}).$mount('#app');