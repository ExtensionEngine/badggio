<template>
  <div class="field">
    <label class="label">{{ label }}</label>
    <div class="control">
      <multiselect
        v-validate="validate"
        v-bind="options"
        :value="resolvedValue"
        :name="name"
        @input="it => $emit('input', isValueObj ? (it && it.value) : it)"
        @select="select"
        @tag="tag"
        @close="close"
        @open="open"
        @remove="remove"
        @search-change="val => $emit('search-change', val)"
        data-vv-delay="1000">
        <image-template
          slot-scope="{ option }"
          :slot="anyHaveImage && 'option'"
          v-bind="option">
        </image-template>
        <image-template
          slot-scope="{ option }"
          :slot="anyHaveImage && 'singleLabel'"
          v-bind="option">
        </image-template>
      </multiselect>
    </div>
    <p v-visible="showError" class="help is-danger">
      {{ error || vErrors.first(name) || '&nbsp;' }}
    </p>
  </div>
</template>

<script>
import find from 'lodash/find';
import first from 'lodash/first';
import humanize from 'humanize-string';
import ImageTemplate from './ImageTemplate';
import intersectionBy from 'lodash/intersectionBy';
import isObject from 'lodash/isObject';
import Multiselect from 'vue-multiselect';
import noop from 'lodash/noop';
import some from 'lodash/some';

export default {
  name: 'v-select',
  inheritAttrs: true,
  props: {
    name: { type: String, required: true },
    value: { type: [String, Number, Object, Array], default: null },
    validate: { type: [String, Object], default: null },
    tagValidator: { type: Function, default: () => noop }
  },
  data() {
    return {
      error: null
    };
  },
  computed: {
    options() {
      return Object.assign({
        closeOnSelect: true,
        showLabels: false,
        placeholder: 'Select option',
        trackBy: 'value',
        label: 'label'
      }, this.$attrs);
    },
    isValueObj() {
      const { options } = this.options;
      return isObject(first(options));
    },
    resolvedValue() {
      const { value, options: { multiple, options, trackBy } } = this;
      const compValue = isObject(value) ? value[trackBy] : value;

      if (!value || !this.isValueObj) return value;
      if (multiple) return intersectionBy(options, value, trackBy);
      return find(options, [trackBy, compValue]);
    },
    label() {
      return humanize(this.name);
    },
    showError() {
      return this.error || this.vErrors.has(this.name);
    },
    anyHaveImage() {
      return some(this.options.options, 'image');
    }
  },
  methods: {
    open(val, id) {
      this.$emit('open', val, id);
    },
    close(id) {
      this.$emit('close', id);
    },
    select(option, id) {
      this.error = null;
      this.$emit('select', option, id);
    },
    tag(val) {
      const { msg, validate } = this.tagValidator();

      if (!validate || validate(val)) {
        this.error = null;
        return this.$emit('tag', val);
      }
      this.error = msg || 'Value not valid';
    },
    remove(option, id) {
      this.error = null;
      this.$emit('remove', option, id);
    }
  },
  components: { ImageTemplate, Multiselect },
  inject: ['$validator']
};
</script>

<style lang="scss">
@import '~vue-multiselect/dist/vue-multiselect.min';
</style>
