<template>
  <div class="field">
    <label class="label">{{ label }}</label>
    <button @click.prevent="addTag();update" class="button is-small">
      <span class="icon has-text-primary mdi mdi-plus-circle mdi-24px" />
    </button>
    <div v-for="(tag, index) in value" :key="index" class="control">
      <input
        v-bind="$attrs"
        :value="tag"
        :type="type"
        :name="name"
        :placeholder="'Tag'"
        @input="input($event, index);update"
        class="input">
      <button
        @click.prevent="removeTag(index);update"
        class="button is-small is-pulled-right">
        <span class="icon mdi mdi-close" />
      </button>
    </div>
  </div>
</template>

<script>
import clone from 'lodash/clone';
import humanize from 'humanize-string';
import VInput from './VInput';

export default {
  name: 'v-tags-input',
  inheritAttrs: false,
  props: {
    type: { type: String, default: 'text' },
    name: { type: String, required: true },
    value: { type: Array, default: () => [] }
  },
  data() {
    return { tags: clone(this.value) };
  },
  computed: {
    label() {
      return humanize(this.name);
    }
  },
  methods: {
    input({ target }, index) {
      this.tags.splice(index, 1, target.value);
      this.update();
    },
    addTag() {
      this.tags.push('');
      this.update();
    },
    removeTag(index) {
      this.tags.splice(index, 1);
      this.update();
    },
    update() {
      this.$emit('input', this.tags);
    }
  },
  watch: {
    value(val) {
      this.tags = clone(val);
    }
  },
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
