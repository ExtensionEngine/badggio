import App from './App';
import router from './router';
import store from './store';
import VeeValidate from '@/validation';
import Vue from 'vue';
import VueHotkey from 'v-hotkey';
import VueVisible from 'vue-visible';

Vue.use(VeeValidate, {
  delay: 700,
  fieldsBagName: 'vFields',
  errorBagName: 'vErrors',
  inject: false
});
Vue.use(VueHotkey);
Vue.use(VueVisible);

loadScript('/docs/api.js').then(() => {
  // eslint-disable-next-line no-new
  new Vue({
    store,
    router,
    el: '#app',
    render: h => h(App)
  });
});

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    script.src = src;
    document.getElementsByTagName('head').item(0).appendChild(script);
  });
}
