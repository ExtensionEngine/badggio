<template>
  <div class="field">
    <label class="label">{{ label }}</label>
    <div class="control">
      <textarea
        v-validate="validate"
        v-bind="$attrs"
        :value="value"
        :type="type"
        :name="name"
        :data-vv-as="label"
        :placeholder="label"
        @input="input"
        data-vv-delay="1000"
        rows="4"
        class="input textarea"/>
    </div>
    <p v-visible="showError" class="help is-danger">
      {{ vErrors.first(name) || '&nbsp;' }}
    </p>
  </div>
</template>

<script>
import humanize from 'humanize-string';

export default {
  name: 'v-text-input',
  inheritAttrs: false,
  props: {
    type: { type: String, default: 'text' },
    name: { type: String, required: true },
    value: { type: String, required: true },
    validate: { type: [String, Object], default: null }
  },
  computed: {
    label() {
      return humanize(this.name);
    },
    showError() {
      return this.vErrors.has(this.name);
    }
  },
  methods: {
    input({ target }) {
      this.$emit('input', target.value);
    }
  },
  inject: ['$validator']
};
</script>

<style lang="scss" scoped>
.textarea {
  height: auto;
}
</style>
