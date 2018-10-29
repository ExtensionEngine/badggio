<template>
  <div ref="docs" class="docs"></div>
</template>

<script>
import SwaggerUi from 'swagger-ui';

const noop = Function.prototype;

export default {
  name: 'swagger-viewer',
  props: {
    api: { type: Object, required: true },
    auth: { type: Object, default: () => ({}) },
    logger: { type: Object, default: () => ({ error: noop }) }
  },
  data() {
    return { swagger: null };
  },
  methods: {
    authorize({ key, type, ...options } = this.auth) {
      if (!this.swagger) return;
      if (type === 'basic') {
        const { username, password } = options;
        return username && password && this.swagger.preauthorizeBasic(key, username, password);
      }
      return options.value && this.swagger.preauthorizeApiKey(key, options.value);
    }
  },
  watch: {
    auth() {
      this.authorize();
    }
  },
  mounted() {
    this.swagger = new SwaggerUi({ domNode: this.$refs.docs, spec: this.api });
  }
};
</script>

<style lang="scss" scoped>
.docs {
  @import '~swagger-ui/dist/swagger-ui.css';

  width: 100%;
  transition: opacity 0.4s ease-in;
  border: none;

  /deep/ {
    .information-container, .auth-wrapper {
      display: none;
    }

    .scheme-container {
      box-shadow: none;
    }
  }
}
</style>
