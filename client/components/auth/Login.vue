<template>
  <div>
    <div class="message">
      <span v-if="message">{{ message }}</span>
    </div>
    <form @submit.prevent="submit">
      <v-input
        v-model="email"
        autocomplete="email"
        name="email"
        validate="required|email">
      </v-input>
      <v-input
        v-model="password"
        autocomplete="current-password"
        name="password"
        type="password"
        validate="required">
      </v-input>
      <div class="options">
        <router-link :to="{ name: 'forgot-password' }">
          Forgot password ?
        </router-link>
        <button class="button is-primary" type="submit">Login</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { withValidation } from '@/validation';
import pick from 'lodash/pick';
import VInput from '@/components/common/form/VInput';

const LOGIN_ERR_MESSAGE = 'User email and password do not match';

export default {
  name: 'login',
  mixins: [withValidation()],
  data() {
    return {
      email: '',
      password: '',
      message: ''
    };
  },
  methods: {
    ...mapActions('auth', ['login']),
    submit() {
      this.message = '';
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        this.login(pick(this, ['email', 'password']))
          .then(() => this.$router.push({ name: 'users' }))
          .catch(() => (this.message = LOGIN_ERR_MESSAGE));
      });
    }
  },
  components: { VInput }
};
</script>

<style lang="scss" scoped>
.options {
  padding: 5px 0 10px 0;
  text-align: right;

  a {
    display: inline-block;
    padding: 6px 20px;
  }
}
</style>
