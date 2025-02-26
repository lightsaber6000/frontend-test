import Toast from './Toast.vue';
import EventBus from './event-bus';

const Toasts = {
  install(Vue) {
    const VueIsolated = Vue;
    VueIsolated.prototype.$toast = (title, message) => {
      EventBus.$emit('toast-message', {
        title,
        message,
      });
    };

    VueIsolated.component('Toast', Toast);
  },
};

export default Toasts;
