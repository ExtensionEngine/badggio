<template>
  <nav
    class="navbar is-fixed-top is-light"
    role="navigation"
    aria-label="main navigation">
    <div class="navbar-brand">
      <router-link to="/" class="item-home navbar-item has-text-weight-semibold">BADGGIO</router-link>
      <div class="item-email navbar-item is-hidden-desktop has-text-grey">{{ user.email }}</div>
      <a :class="{ 'is-active': showMenu }" @click="showMenu = !showMenu" class="navbar-burger">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div :class="{ 'is-active': showMenu }" class="navbar-menu">
      <div v-if="user" class="navbar-end">
        <router-link :to="{ name: 'badges' }" class="navbar-item">Badges</router-link>
        <div class="item-email navbar-item is-hidden-touch has-text-grey">{{ user.email }}</div>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="btn-menu navbar-item is-hidden-touch mdi mdi-dots-vertical mdi-24px"></a>
          <div class="navbar-dropdown is-right is-boxed">
            <router-link :to="{ name: 'users' }" class="navbar-item">
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
@import '~bulma/sass/utilities/all';

@media (min-width: $desktop) {
  .item-email {
    user-select: none;
  }

  .btn-menu {
    margin-left: -0.25rem;

    &:hover {
      color: $link-hover;
      background-color: #e8e8e8;
    }
  }

  .navbar-dropdown {
    $border-color: lighten($grey-lighter, 5%);

    margin-top: 4px;
    border-radius: 0;
    box-shadow: 0 8px 8px rgba(10, 10, 10, 0.1);
    border: 1px solid $border-color;
    border-top: none;
    border-right: none;

    .navbar-item {
      display: inline-block;
      width: 100%;
    }

    .navbar-divider {
      height: 1px;
      background: $border-color;
    }
  }
}

@media (max-width: $desktop - 1px) {
  .navbar-burger {
    margin-left: 0;
  }

  .item-home {
    flex-grow: 0;
    margin-right: auto;
  }

  .navabar-menu .item-email {
    flex-grow: 0;
  }

  .navbar-dropdown {
    padding: 0.5rem 0.75rem;
    font-size: 1rem;

    &::before {
      content: "";
      display: block;
      height: 1px;
      margin-bottom: 0.5rem;
      background-color: $grey-lighter;
    }

    .navbar-item {
      margin: 0 -0.75rem;
      padding: 0.5rem 1rem;
    }

    .mdi-logout {
      margin-left: -0.25px;
    }
  }
}
</style>
