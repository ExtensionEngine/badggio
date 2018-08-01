import Vue from 'vue';
import Vuex from 'vuex';

import auth from '@/store/modules/auth';
import badges from '@/store/modules/badges';
import plugins from '@/store/plugins';
import users from '@/store/modules/users';
import recipients from '@/store/modules/recipients';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    users,
    badges,
    recipients
  },
  plugins
});
