<template>
  <nav class="breadcrumb is-centered has-succeeds-separator">
    <ul>
      <li
        v-for="(step, index) in steps"
        :key="index"
        :class="{ 'active': isActive(step) }">
        <a :class="{ 'error': hasError(step) }" @click="activate(step)">
          {{ step | readable }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
import humanize from 'humanize-string';

export default {
  name: 'navigation',
  props: {
    steps: { type: Array, required: true },
    active: { type: String, required: true }
  },
  methods: {
    activate(step) {
      this.$emit('activate', step);
    },
    isActive(step) {
      return step === this.active;
    },
    hasError(step) {
      const imageSteps = ['image', 'imageCaption', 'imageAuthorIri'];
      return step === 'imageSet'
        ? imageSteps.some(step => this.vErrors.has(step))
        : this.vErrors.has(step);
    }
  },
  filters: {
    readable(value) {
      return humanize(value);
    }
  },
  inject: ['$validator']
};
</script>

<style lang="scss" scoped>
.breadcrumb {
  margin-bottom: 3.5rem;
}

.error {
  color: #ff3860;
}

a {
  opacity: 0.5;
}

.active {
  a {
    opacity: 1;
  }
}
</style>
