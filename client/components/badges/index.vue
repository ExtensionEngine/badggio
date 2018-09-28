<template>
  <div>
    <h1 class="title">Badges</h1>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'badges',
  methods: mapActions('badges', ['fetch']),
  created() {
    this.fetch();
  }
};
</script>
