<template>
  <div class="container docs">
    <h1 class="title">Api Docs</h1>
    <swagger-viewer :auth="auth" class="viewer" url="/docs"/>
  </div>
</template>

<script>
import SwaggerViewer from './SwaggerViewer';

const format = (value, { scheme } = {}) => value ? `${scheme} ${value}` : '';
const auth = () => ({
  key: 'JWTAuthToken',
  type: 'apiKey',
  value: format(window.localStorage.getItem('APP_TOKEN'), { scheme: 'JWT' })
});

export default {
  name: 'docs',
  computed: { auth },
  components: { SwaggerViewer }
};
</script>

<style lang="scss" scoped>
.viewer {
  margin-bottom: 6.25em;
}
</style>
