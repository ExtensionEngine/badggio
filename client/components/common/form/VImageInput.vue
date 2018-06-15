<template>
  <div class="field">
    <label class="label">{{ label }}</label>
    <figure>
      <picture-input
        v-validate="validate"
        ref="pictureInput"
        :margin="margin"
        :width="width"
        :height="height"
        :accept="accept"
        :size="size"
        :custom-strings="customStrings"
        @change="$emit('input', $event.target.value)"
        button-class="btn" />
    </figure>
    <p v-visible="showError" class="help is-danger">
      {{ vErrors.first(name) || '&nbsp;' }}
    </p>
  </div>
</template>

<script>
import humanize from 'humanize-string';
import PictureInput from 'vue-picture-input';

const DEFAULT_MARGIN = 16;
const DEFAULT_IMAGE_SIZE = 10;

export default {
  name: 'v-image-input',
  inheritAttrs: false,
  props: {
    type: { type: String, default: 'text' },
    width: { type: Number, default: undefined },
    height: { type: Number, default: undefined },
    margin: { type: Number, default: DEFAULT_MARGIN },
    accept: { type: String, default: '' },
    size: { type: Number, default: DEFAULT_IMAGE_SIZE },
    customStrings: { type: Object, default: () => {} },
    name: { type: String, required: true },
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
  inject: ['$validator'],
  components: { PictureInput }
};
</script>
