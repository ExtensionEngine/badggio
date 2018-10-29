<template>
  <div class="container docs">
    <h1 class="title">Api Docs</h1>
    <v-select
      v-model="integrationId"
      :options="integrationOptions"
      name="integration"/>
    <swagger-viewer :api="api" :auth="auth" class="viewer"/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import get from 'lodash/get';
import map from 'lodash/map';
import SwaggerViewer from './SwaggerViewer';
import VSelect from '@/components/common/form/VSelect';

const INTEGRATION = 'INTEGRATION';
const format = (value, { scheme } = {}) => value ? `${scheme} ${value}` : '';
const auth = value => ({
  key: 'JWTAuthToken',
  type: 'apiKey',
  value: format(value, { scheme: 'JWT' })
});

export default {
  name: 'docs',
  data() {
    return { integrationId: null };
  },
  computed: {
    ...mapGetters('users', ['integrations', 'get']),
    api: () => get(window, 'globals.api'),
    integration() {
      return this.get(this.integrationId);
    },
    integrationOptions() {
      return map(this.integrations, ({ id, name }) => ({ value: id, label: name }));
    },
    auth() {
      if (!this.integration) return;
      return auth(this.integration.token);
    }
  },
  methods: mapActions('users', ['fetch']),
  created() {
    this.fetch({ roles: [INTEGRATION] });
  },
  components: { SwaggerViewer, VSelect }
};
</script>

<style lang="scss" scoped>
.viewer {
  margin-bottom: 6.25em;
}
</style>
