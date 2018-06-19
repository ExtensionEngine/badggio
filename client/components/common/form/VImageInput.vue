<template>
  <div class="field">
    <label class="label">{{ label }}</label>
    <div class="control">
      <picture-input
        v-validate="validate"
        ref="pictureInput"
        :margin="margin"
        :width="width"
        :height="height"
        :accept="accept"
        :size="size"
        :custom-strings="customStrings"
        :hideChangeButton="hideChangeButton"
        :name="name"
        :prefill="value"
        :alertOnError="false"
        @change="$emit('input', $event)"
        @error="error"
        data-vv-delay="1000"
        data-vv-validate-on="change"
        button-class="btn" />
    </div>
    <p v-visible="showError" class="help is-danger">
      {{ vErrors.first(name) || '&nbsp;' }}
    </p>
  </div>
</template>

<script>
import humanize from 'humanize-string';
import PictureInput from 'vue-picture-input';

const DEFAULT_MARGIN = 0;
const DEFAULT_IMAGE_SIZE = 0.256;

export default {
  name: 'v-image-input',
  inheritAttrs: false,
  props: {
    type: { type: String, default: 'text' },
    name: { type: String, required: true },
    value: { type: String, required: true },
    validate: { type: [String, Object], default: null },
    width: { type: Number, default: undefined },
    height: { type: Number, default: undefined },
    margin: { type: Number, default: DEFAULT_MARGIN },
    accept: { type: String, default: '' },
    size: { type: Number, default: DEFAULT_IMAGE_SIZE },
    customStrings: { type: Object, default: () => {} },
    hideChangeButton: { type: Boolean, default: false }
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
    error({ type }) {
      if (type === 'fileSize') this.$emit('input', '');
    }
  },
  inject: ['$validator'],
  components: { PictureInput }
};
</script>

<style lang="scss">
#picture-input {
  padding: 10px;
  border: 1px solid transparent;
  border-style: solid;
  border-color: rgb(219, 219, 219);

  .picture-inner-text {
    font-size: 1.35em;
  }
}
</style>
