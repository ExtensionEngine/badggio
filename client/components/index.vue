<template>
  <div class="app-container">
    <header class="app-header">
      <navbar/>
    </header>
    <main class="app-content container">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import Navbar from '@/components/common/Navbar';

export default {
  name: 'admin',
  components: { Navbar }
};
</script>

<style lang="scss" scoped>
.app-container {
  height: 100%;
  padding: 32px 16px 0;

  .app-content {
    flex: 1;
  }
}
</style>
