<template>
  <div>
    <div class="tag-input">
      <v-input
        v-model="currentTag"
        :name="name"
        :validate="{ min: 2, 'alpha_num': true, unique: tags }"
        @keydown.enter.prevent.native="add"/>
      <button
        :disabled="!hasInput"
        @click="add"
        type="button"
        class="button is-small">
        <span
          :class="{ 'has-text-primary': hasInput }"
          class="icon mdi mdi-plus-circle mdi-24px">
        </span>
      </button>
    </div>
    <div class="tags control">
      <span v-for="tag in tags" :key="tag" class="tag is-primary">{{ tag }} &nbsp;
        <button @click.prevent="remove(tag)" class="delete is-small" type="button"></button>
      </span>
    </div>
  </div>
</template>

<script>
import { withValidation } from '@/validation';
import humanize from 'humanize-string';
import VInput from './VInput';
import without from 'lodash/without';

export default {
  name: 'v-tags-input',
  mixins: [withValidation()],
  inheritAttrs: false,
  props: {
    name: { type: String, required: true },
    tags: { type: Array, default: () => [] }
  },
  data() {
    return { currentTag: '' };
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
    add() {
      this.$validator.validate(this.name).then(isValid => {
        if (!isValid || !this.hasInput) return;
        this.update([...this.tags, this.currentTag]);
        this.currentTag = '';
      });
    },
    remove(tag) {
      this.update(without(this.tags, tag));
    },
    update(tags) {
      this.$emit('update:tags', tags);
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
