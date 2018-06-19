<template>
  <v-image-input
    :validate="'required'"
    :value="image"
    :width="300"
    :height="300"
    :accept="'image/svg+xml,image/png'"
    :size="0.256"
    :customStrings="{
      drag: 'Drag an image or <br>click here to select a file'
    }"
    :hideChangeButton="true"
    @input="updateData"
    name="image" />
</template>

<script>
import VImageInput from '@/components/common/form/VImageInput';

export default {
  name: 'image-input',
  inheritAttrs: false,
  props: {
    show: { type: Boolean, default: false },
    image: { type: String, default: '' }
  },
  methods: {
    updateData(image) {
      this.$emit('input', { image });
    }
  },
  watch: {
    show(val) {
      if (val) window.dispatchEvent(new UIEvent('resize'));
    }
  },
  components: { VImageInput }
};
</script>
