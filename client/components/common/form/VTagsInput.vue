<template>
  <div>
    <div class="tag-input">
      <v-input
        v-model="currentTag"
        :name="name"
        :validate="{ min: 2, 'alpha_num': true, unique: value }"
        @keydown.enter.prevent.native="addTag"/>
      <button
        :disabled="!hasInput"
        @click="addTag"
        type="button"
        class="button is-small">
        <span
          :class="{ 'has-text-primary': hasInput }"
          class="icon mdi mdi-plus-circle mdi-24px">
        </span>
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
import { withValidation } from '@/validation';
import clone from 'lodash/clone';
import humanize from 'humanize-string';
import VInput from './VInput';

export default {
  name: 'v-tags-input',
  mixins: [withValidation()],
  inheritAttrs: false,
  props: {
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
    },
    hasInput() {
      return !!this.currentTag;
    }
  },
  methods: {
    addTag() {
      this.$validator.validate(this.name).then(isValid => {
        if (!isValid || !this.hasInput) return;
        this.tags.push(this.currentTag);
        this.currentTag = '';
        this.update();
      });
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
