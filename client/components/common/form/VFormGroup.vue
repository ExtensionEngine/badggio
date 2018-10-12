<template>
  <fieldset class="form-group">
    <legend class="title legend">
      <slot name="title">{{ title }}</slot>
    </legend>
    <form @submit.prevent="$emit('submit', $event)">
      <div v-if="$slots.header" class="header"><slot name="header"></slot></div>
      <div v-if="$slots.content" class="content"><slot name="content"></slot></div>
      <div v-if="$slots.footer" class="footer"><slot name="footer"></slot></div>
    </form>
  </fieldset>
</template>

<script>
export default {
  name: 'v-form-group',
  props: {
    title: { type: String, default: null }
  }
};
</script>

<style lang="scss" scoped>
@import '~bulma/sass/utilities/initial-variables.sass';

.form-group {
  border-radius: 4px;
  padding: 1rem 1.75rem 1.75rem;
  border: 1px solid $grey-light;

  .legend {
    margin: 0;
    padding: 0 0.5rem;
    color: $grey-dark;
    font-size: 1.75rem;
    font-weight: 400;
  }

  .header {
    margin-bottom: 1.5rem;
  }

  .footer {
    padding: 0;
    background-color: transparent;
  }
}
</style>
