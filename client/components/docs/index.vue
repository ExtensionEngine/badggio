<template>
  <div class="container docs">
    <h1 class="title">Api Docs</h1>
    <swagger-viewer :auth="auth" class="viewer" url="/docs"/>
  </div>
</template>

<script>
import SwaggerViewer from './SwaggerViewer';

export default {
  name: 'docs',
  computed: {
    auth: () => ({
      key: 'JWTAuthToken',
      type: 'apiKey',
      value: `JWT ${window.localStorage.getItem('APP_TOKEN')}`
    })
  },
  components: { SwaggerViewer }
};
</script>

<style lang="scss" scoped>
.viewer {
  margin-bottom: 6.25em;
}
</style>
