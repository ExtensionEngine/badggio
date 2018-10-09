<template>
  <div>
    <div class="tag-input">
      <v-input
        :name="name"
        v-bind="$attrs"
        v-model="currentTag"
        @keydown.enter.prevent="addTag"/>
      <button @click.prevent="addTag" class="button is-small">
        <span class="icon has-text-primary mdi mdi-plus-circle mdi-24px" />
      </button>
    </div>
    <div class="tags control">
      <span v-for="(tag, index) in value" :key="index" class="tag is-primary">{{ tag }} &nbsp;
        <button @click.prevent="removeTag(index)" class="delete is-small"></button>
      </span>
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
    return {
      currentTag: '',
      tags: clone(this.value)
    };
  },
  computed: {
    label() {
      return humanize(this.name);
    }
  },
  methods: {
    addTag() {
      this.tags.push(this.currentTag);
      this.currentTag = '';
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
.tag-input {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  .button {
    margin-left: 10px;
    border:  0;
    background-color: transparent;
  }
}
</style>
