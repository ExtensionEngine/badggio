<template>
  <nav
    class="navbar is-fixed-top is-light"
    role="navigation"
    aria-label="main navigation">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">BADGGIO</router-link>
      <div class="navbar-item is-hidden-desktop is-right">{{ user.email }}</div>
      <a :class="{ 'is-active': showMenu }" @click="showMenu = !showMenu" class="navbar-burger">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div :class="{ 'is-active': showMenu }" class="navbar-menu">
      <div v-if="user" class="navbar-end">
        <router-link to="/badges" class="navbar-item">Badges</router-link>
        <div class="navbar-item is-hidden-touch">{{ user.email }}</div>
        <div class="navbar-item has-dropdown is-hoverable">
          <div class="navbar-item is-hidden-touch mdi mdi-settings mdi-24px"></div>
          <div class="navbar-dropdown is-right is-boxed">
            <router-link to="/users" class="navbar-item">
              <span>Access Rights</span>
            </router-link>
            <hr class="navbar-divider">
            <a @click="logout" class="navbar-item has-icon">
              <span class="icon mdi mdi-logout"></span>
              <span>Logout</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'app-navbar',
  data() {
    return { showMenu: false };
  },
  computed: mapState('auth', ['user']),
  methods: mapActions('auth', ['logout']),
  mounted() {
    // NOTE: Add appropriate css class to <html> element according to:
    //       https://bulma.io/documentation/components/navbar/#fixed-navbar
    document.documentElement.classList.add('has-navbar-fixed-top');
  }
};
</script>

<style lang="scss" scoped>
@import '~bulma/sass/utilities/initial-variables.sass';

.mdi-logout {
  margin-left: -5px;
}

@media (min-width: 1024px) {
  .navbar-dropdown {
    .has-icon {
      display: block;
    }
  }
}

@media (max-width: 1023px) {
  .navbar-dropdown {
    &:before {
      content: "";
      display: block;
      height: 1px;
      width: 96%;
      margin-left: 2%;
      background-color: $grey-lighter;
    }
    .navbar-item {
      padding-right: 1rem;
      padding-left: 1rem;
    }
  }
}
</style>
