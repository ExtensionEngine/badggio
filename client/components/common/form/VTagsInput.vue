<template>
  <div class="field">
    <label class="label">{{ label }}</label>
    <button @click.prevent="addTag" class="button is-small">
      <span class="icon has-text-primary mdi mdi-plus-circle mdi-24px" />
    </button>
    <div v-for="(tag, index) in tags" :key="index" class="control">
      <input
        v-validate="validate"
        v-bind="$attrs"
        :value="tag"
        :type="type"
        :name="name"
        :data-vv-as="label"
        :placeholder="'Tag'"
        @input="input($event.target.value, index)"
        data-vv-delay="1000"
        class="input">
      <button
        @click.prevent="removeTag(index)"
        class="button is-small is-pulled-right">
        <span class="icon mdi mdi-close" />
      </button>
    </div>
    <p v-visible="showError" class="help is-danger">
      {{ vErrors.first(name) || '&nbsp;' }}
    </p>
  </div>
</template>

<script>
import humanize from 'humanize-string';
import VInput from './VInput';
import clone from 'lodash/clone';

export default {
  name: 'v-tags-input',
  inheritAttrs: false,
  props: {
    type: { type: String, default: 'text' },
    name: { type: String, required: true },
    value: { type: Array, default: () => [''] },
    validate: { type: [String, Object], default: null }
  },
  data() {
    return { tags: clone(this.value) };
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
    input(value, index) {
      this.tags.splice(index, 1, value);
      this.$emit('input', this.tags);
    },
    addTag() {
      this.tags.push('');
    },
    removeTag(index) {
      this.tags.splice(index, 1);
    }
  },
  inject: ['$validator'],
  components: { VInput }
};
</script>

<style lang="scss" scoped>
.label {
  display: inline-block;
}

.button {
  border:  0;
}

.input {
  max-width: 95%;
}

.control {
  margin-bottom: 0.75rem;

  .button {
    margin-top: 5px;
  }
}
</style>
